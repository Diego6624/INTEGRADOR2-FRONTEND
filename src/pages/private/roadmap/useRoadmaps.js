import useVocationalAccess from '@/hooks/useVocationalAccess';
import { requireVocationalTest } from '@/lib/vocationalAccess';
import { useCallback, useEffect, useRef, useState } from 'react';
import apiFetch from '@/lib/apiClient';
import { createRoadmapApi, errorMessage } from './roadmapApi';

const roadmapApi = createRoadmapApi(apiFetch);
const { fetchAllPages } = roadmapApi;

export default function useRoadmaps(tab) {
  const vocationalAccess = useVocationalAccess();
  const [roadmaps, setRoadmaps] = useState([]);
  const [userId, setUserId] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});
  const [revision, setRevision] = useState(0);
  const [reload, setReload] = useState(0);
  const locks = useRef(new Set());
  const active = useRef(true);
  const refresh = useCallback(() => setReload(value => value + 1), []);

  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function load() {
      setLoading(true);
      setError('');
      setActionError('');
      try {
        const { data: user } = await apiFetch.get('/me', { signal });
        const [listed, records] = await Promise.all([
          fetchAllPages(tab === 'comunidad' ? '/roadmap' : '/roadmap/user', { signal, params: { sort: 'createdAt,desc' } }),
          fetchAllPages(`/user-step-progress/user/${user.id}`, { signal }),
        ]);
        const visible = tab === 'comunidad' ? listed.filter(item => item.isPublic) : listed;
        const detailed = await Promise.all(visible.map(async item => {
          const [steps, { data: graph }, { data: engagement }] = await Promise.all([
            fetchAllPages(`/roadmap-step/roadmap/${item.id}`, { signal, params: { sort: 'orderIndex,asc' } }),
            roadmapApi.loadConnections(item.id, { signal }),
            apiFetch.get(`/roadmap/${item.id}/like`, { signal }),
          ]);
          return { ...item, ...engagement, steps, graph };
        }));
        if (signal.aborted) return;
        setUserId(user.id);
        setRoadmaps(detailed);
        setProgress(Object.fromEntries(records.filter(item => String(item.userId) === String(user.id))
          .map(item => [String(item.roadmapStepId), item])));
        setRevision(value => value + 1);
      } catch (requestError) {
        if (!signal.aborted) setError(errorMessage(requestError, 'No se pudieron cargar los roadmaps.'));
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    }
    // The request owns its loading state; abort it when changing tabs or leaving the page.
    load();
    return () => controller.abort();
  }, [tab, reload]);

  const mutate = useCallback(async (key, task) => {
    if (locks.current.has(key)) return false;
    locks.current.add(key);
    setPending(previous => ({ ...previous, [key]: true }));
    setActionError('');
    try {
      await task();
      return true;
    } catch (requestError) {
      if (active.current) setActionError(errorMessage(requestError, requestError.message?.startsWith('El bloque se guardo') ? requestError.message : 'No se pudo guardar el cambio. Inténtalo nuevamente.'));
      return false;
    } finally {
      locks.current.delete(key);
      if (active.current) setPending(previous => ({ ...previous, [key]: false }));
    }
  }, []);

  const toggleLike = roadmap => mutate(`like:${roadmap.id}`, async () => {
    const { data } = await (roadmap.likedByCurrentUser
      ? apiFetch.delete(`/roadmap/${roadmap.id}/like`)
      : apiFetch.post(`/roadmap/${roadmap.id}/like`));
    if (active.current) setRoadmaps(items => items.map(item => item.id === roadmap.id ? { ...item, ...data } : item));
  });

  const savePosition = (roadmapId, stepId, position) => mutate(`position:${stepId}`, async () => {
    const owner = roadmaps.find(item => item.id === roadmapId);
    if (!owner || String(owner.userId) !== String(userId)) throw new Error('Roadmap ajeno');
    const { data } = await roadmapApi.savePosition(stepId, position);
    if (active.current) setRoadmaps(previous => previous.map(item => item.id === roadmapId
      ? { ...item, steps: item.steps.map(step => String(step.id) === String(stepId) ? { ...step, x: data.x, y: data.y } : step) } : item));
  });

  const saveStatus = (stepId, status) => mutate(`status:${stepId}`, async () => {
    const existing = progress[String(stepId)];
    const { data } = await roadmapApi.saveStatus(stepId, status, existing);
    if (active.current) setProgress(previous => ({ ...previous, [String(stepId)]: data }));
  });

  const createRoadmap = values => mutate('create', async () => {
    await requireVocationalTest(apiFetch, userId);
    await roadmapApi.createRoadmap(values);
    if (active.current) refresh();
  });

  const createStep = (roadmapId, values) => mutate(`step:${roadmapId}`, async () => {
    const owner = roadmaps.find(item => item.id === roadmapId);
    if (!owner || String(owner.userId) !== String(userId)) throw new Error('Roadmap ajeno');
    await roadmapApi.createStep(roadmapId, values);
    if (active.current) refresh();
  });

  const createLinkedStep = (roadmapId, anchorId, direction, position, onCreated) => mutate(`manage:${roadmapId}`, async () => {
    const roadmap = roadmaps.find(item => item.id === roadmapId);
    if (!roadmap || String(roadmap.userId) !== String(userId)) throw new Error('Roadmap ajeno');
    const { data: step } = await roadmapApi.createStep(roadmapId, {
      title: 'Nuevo bloque', description: 'Agrega el contenido de este paso.',
      orderIndex: Math.max(-1, ...roadmap.steps.map(item => item.orderIndex ?? 0)) + 1,
      ...position,
    });
    // Keep the saved block visible even if saving its connection fails.
    if (active.current) {
      setRoadmaps(items => items.map(item => item.id === roadmapId ? { ...item, steps: [...item.steps, step] } : item));
      onCreated?.(step);
    }
    const link = direction === 'top' || direction === 'left'
      ? { sourceId: step.id, targetId: Number(anchorId) }
      : { sourceId: Number(anchorId), targetId: step.id };
    try {
      const { data: graph } = await roadmapApi.saveConnections(roadmapId, {
        version: roadmap.graph.version, links: anchorId == null ? roadmap.graph.links : [...roadmap.graph.links, link],
      });
      if (active.current) setRoadmaps(items => items.map(item => item.id === roadmapId ? { ...item, graph } : item));
    } catch (error) {
      const detail = errorMessage(error, 'Intenta conectar el bloque nuevamente.');
      throw new Error(`El bloque se guardo, pero no se pudo guardar su enlace. ${detail}`, { cause: error });
    }
  });

  const manageRoadmap = (roadmapId, task) => mutate(`manage:${roadmapId}`, async () => {
    const roadmap = roadmaps.find(item => item.id === roadmapId);
    if (!roadmap || String(roadmap.userId) !== String(userId)) throw new Error('Roadmap ajeno');
    await task(roadmap);
    if (active.current) refresh();
  });

  const updateVisibility = (id, isPublic) => manageRoadmap(id, () => roadmapApi.updateVisibility(id, isPublic));
  const deleteRoadmap = id => manageRoadmap(id, () => roadmapApi.deleteRoadmap(id));
  const updateStep = (roadmapId, stepId, values) => mutate(`manage:${roadmapId}`, async () => {
    const roadmap = roadmaps.find(item => item.id === roadmapId);
    if (!roadmap || String(roadmap.userId) !== String(userId) || !roadmap.steps.some(step => step.id === stepId)) throw new Error('Paso ajeno');
    const { data } = await roadmapApi.updateStep(stepId, values);
    if (active.current) setRoadmaps(previous => previous.map(item => item.id === roadmapId
      ? { ...item, steps: item.steps.map(step => step.id === stepId ? { ...step, ...data } : step) } : item));
  });
  const saveConnections = (roadmapId, links) => mutate(`manage:${roadmapId}`, async () => {
    const roadmap = roadmaps.find(item => item.id === roadmapId);
    if (!roadmap || String(roadmap.userId) !== String(userId)) throw new Error('Roadmap ajeno');
    const { data } = await roadmapApi.saveConnections(roadmapId, { version: roadmap.graph.version, links });
    if (active.current) setRoadmaps(previous => previous.map(item => item.id === roadmapId ? { ...item, graph: data } : item));
  });
  const deleteStep = (roadmapId, stepId) => manageRoadmap(roadmapId, roadmap => {
    if (!roadmap.steps.some(step => step.id === stepId)) throw new Error('Paso ajeno');
    return roadmapApi.deleteStep(stepId);
  });

  return { vocationalAccess, roadmaps, userId, progress, loading, error, actionError, pending, revision,
    refresh, toggleLike, savePosition, saveStatus, createRoadmap, createStep, createLinkedStep, updateVisibility, deleteRoadmap, updateStep, deleteStep, saveConnections };
}
