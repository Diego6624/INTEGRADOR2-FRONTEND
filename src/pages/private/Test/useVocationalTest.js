import { useEffect, useRef, useState } from 'react';
import apiFetch from '@/lib/apiClient';
import { apiError, createVocationalApi } from './vocationalApi';

const api = createVocationalApi(apiFetch);

export default function useVocationalTest() {
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [reload, setReload] = useState(0);
  const submitting = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const loaded = await api.load(controller.signal);
        if (controller.signal.aborted) return;
        setQuestions(loaded.questions);
        setUserId(loaded.userId);
        setResult(loaded.result);
      } catch (requestError) {
        if (!controller.signal.aborted) setError(apiError(requestError, 'No se pudo cargar el test vocacional.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [reload]);

  async function submit(answers) {
    if (submitting.current || result || !userId) return;
    submitting.current = true;
    setSaving(true);
    setSaveError('');
    try {
      const saved = await api.submit(userId, questions, answers);
      if (mounted.current) setResult(saved);
    } catch (requestError) {
      if (mounted.current) setSaveError(apiError(requestError, 'No se pudo guardar el resultado. Vuelve a intentarlo.'));
    } finally {
      submitting.current = false;
      if (mounted.current) setSaving(false);
    }
  }

  return { questions, result, loading, saving, error, saveError, submit,
    retry: () => setReload(value => value + 1) };
}
