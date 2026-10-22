import VocationalTestGate from '@/components/VocationalTestGate';
import { useCallback, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, Handle, Position, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useRoadmaps from './roadmap/useRoadmaps';
import { buildNodes } from './roadmap/roadmapApi';

const OPTIONS = [
  { value: 'PENDIENTE', label: 'Pendiente', color: '#a0b4ff' },
  { value: 'HECHO', label: 'Completado', color: '#00e5b8' },
  { value: 'OMITIR', label: 'Omitido', color: '#7b8ab0' },
];
const panel = 'rounded-2xl border border-white/10 bg-slate-950/70 p-5';
const button = 'rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 disabled:cursor-wait disabled:opacity-50';
const input = 'w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white';

function StatusSelect({ status, disabled, onChange }) {
  return (
    <select aria-label="Estado del paso" className={`${input} nodrag nopan nowheel max-w-36`}
      value={status} disabled={disabled} onChange={event => onChange(event.target.value)}>
      {OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
}

function RoadmapNode({ data }) {
  const option = OPTIONS.find(item => item.value === data.status) ?? OPTIONS[0];
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-center text-sm text-white shadow-lg"
        style={{ border: `1.5px solid ${option.color}` }} title={data.description}>
        {data.status === 'HECHO' && <span className="text-emerald-300">✓</span>}
        <span className="line-clamp-2">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </>
  );
}
const NODE_TYPES = { roadmap: RoadmapNode };

function RoadmapCard({ roadmap, api }) {
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);
  const [nodes, setNodes] = useState(() => buildNodes(roadmap.steps));
  const dragOrigins = useRef(new Map());
  const formRef = useRef(null);
  const owned = String(roadmap.userId) === String(api.userId);
  const done = roadmap.steps.filter(step => api.progress[String(step.id)]?.status === 'HECHO').length;
  const percentage = roadmap.steps.length ? Math.round(done / roadmap.steps.length * 100) : 0;
  const sorted = [...roadmap.steps].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
  const edges = sorted.slice(1).map((step, index) => ({
    id: `${sorted[index].id}-${step.id}`, source: String(sorted[index].id), target: String(step.id),
    style: { stroke: '#5b74d8', strokeWidth: 1.8 },
  }));
  const displayNodes = nodes.map(node => ({ ...node,
    draggable: owned && !api.pending[`position:${node.id}`],
    data: { ...node.data, status: api.progress[node.id]?.status ?? 'PENDIENTE' },
  }));
  const handleNodesChange = useCallback(changes => {
    setNodes(previous => applyNodeChanges(changes.filter(change => change.type !== 'remove'), previous));
  }, []);

  async function handleDragStop(_, node) {
    const origin = dragOrigins.current.get(node.id);
    if (!origin || (origin.x === node.position.x && origin.y === node.position.y)) return;
    const saved = await api.savePosition(roadmap.id, node.id, node.position);
    if (!saved) setNodes(previous => previous.map(item => item.id === node.id ? { ...item, position: origin } : item));
  }

  async function addStep(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const saved = await api.createStep(roadmap.id, {
      title: values.get('title').trim(), description: values.get('description').trim(),
      orderIndex: Math.max(-1, ...roadmap.steps.map(step => step.orderIndex ?? 0)) + 1,
      x: 360, y: 80 + roadmap.steps.length * 140,
    });
    if (saved) formRef.current?.reset();
  }

  return (
    <article className={`${panel} space-y-4`} aria-label={roadmap.title}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-white">{roadmap.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{roadmap.category} · {roadmap.isPublic ? 'Público' : 'Privado'}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{roadmap.description}</p>
        </div>
        <div className="flex gap-2">
          {['list', 'map'].map(mode => <button key={mode} type="button" aria-pressed={view === mode}
            className={`${button} ${view === mode ? 'bg-indigo-500/25' : ''}`} onClick={() => setView(mode)}>
            {mode === 'list' ? 'Lista' : 'Mapa'}
          </button>)}
        </div>
      </header>
      <div>
        <p className="mb-2 text-xs text-slate-400">{done} de {roadmap.steps.length} pasos completados · {percentage}%</p>
        <div role="progressbar" aria-label="Avance del roadmap" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}
          className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${percentage}%` }} />
        </div>
      </div>
      {!sorted.length ? <p className="text-sm text-slate-400">Este roadmap todavía no tiene pasos.</p>
        : view === 'list' ? (
          <ol className="space-y-2">
            {sorted.map(step => <li key={step.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{step.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-slate-400">{step.description}</p>
              </div>
              <StatusSelect status={api.progress[String(step.id)]?.status ?? 'PENDIENTE'} disabled={api.pending[`status:${step.id}`]}
                onChange={status => api.saveStatus(step.id, status)} />
            </li>)}
          </ol>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">{owned ? 'Arrastra un paso para guardar su posición. ' : ''}Selecciona un paso para actualizar tu avance.</p>
            <div className="h-[540px] overflow-hidden rounded-xl border border-white/10">
              <ReactFlow nodes={displayNodes} edges={edges} nodeTypes={NODE_TYPES} onNodesChange={handleNodesChange}
                nodeOrigin={[0.5, 0.5]} onNodeClick={(_, node) => setSelected(node.id)} onPaneClick={() => setSelected(null)}
                onNodeDragStart={(_, node) => dragOrigins.current.set(node.id, { ...node.position })} onNodeDragStop={handleDragStop}
                nodesDraggable={owned} nodesConnectable={false} edgesReconnectable={false} deleteKeyCode={null}
                fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.2} maxZoom={2} colorMode="dark">
                <Background color="#1e2d4a" gap={24} /><Controls showInteractive={false} />
              </ReactFlow>
            </div>
            {selected && <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <span>{roadmap.steps.find(step => String(step.id) === selected)?.title}</span>
              <StatusSelect status={api.progress[selected]?.status ?? 'PENDIENTE'} disabled={api.pending[`status:${selected}`]}
                onChange={status => api.saveStatus(selected, status)} />
            </div>}
          </div>
        )}
      {owned && <details className="border-t border-white/10 pt-3 text-sm text-slate-300">
        <summary className="cursor-pointer">Agregar paso</summary>
        <form ref={formRef} onSubmit={addStep} className="mt-3 space-y-3">
          <label className="block">Título<input className={`${input} mt-1`} name="title" required pattern=".*\S.*" /></label>
          <label className="block">Descripción<textarea className={`${input} mt-1`} name="description" required /></label>
          <button className={button} disabled={api.pending[`step:${roadmap.id}`]}>Guardar paso</button>
        </form>
      </details>}
    </article>
  );
}

export default function RoadmapPage() {
  const [tab, setTab] = useState('mis');
  const [creating, setCreating] = useState(false);
  const api = useRoadmaps(tab);
  const busy = Object.values(api.pending).some(Boolean);

  async function create(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const saved = await api.createRoadmap({ title: values.get('title').trim(), description: values.get('description').trim(),
      category: values.get('category').trim(), isPublic: values.get('isPublic') === 'on' });
    if (saved) { setCreating(false); setTab('mis'); }
  }

  return (
    <main className={`${panel} space-y-5`}>
      <header><h1 className="text-3xl font-semibold text-white">Roadmaps</h1>
        <p className="mt-2 text-slate-300">Traza y gestiona tus rutas de aprendizaje universitario.</p></header>
      <nav className="flex flex-wrap gap-2" aria-label="Roadmaps">
        {[['mis', 'Mis Roadmaps'], ['comunidad', 'Comunidad']].map(([value, label]) => (
          <button key={value} className={`${button} ${tab === value ? 'bg-indigo-500/25' : ''}`} disabled={busy}
            aria-pressed={tab === value && !creating} onClick={() => { setCreating(false); setTab(value); }}>{label}</button>
        ))}
        <button className={button} disabled={busy} onClick={() => setCreating(value => !value)}>Crear nuevo roadmap</button>
        <button className={button} disabled={busy || api.loading} onClick={api.refresh}>Actualizar</button>
      </nav>
      {api.actionError && <p role="alert" className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{api.actionError}</p>}
      {busy && <p role="status" className="text-xs text-indigo-200">Guardando cambios…</p>}
      {creating && <VocationalTestGate access={api.vocationalAccess} action="crear roadmaps"><form onSubmit={create} className={`${panel} space-y-3`}>
        <h2 className="text-lg text-white">Nuevo roadmap</h2>
        <label className="block text-sm text-slate-300">Título<input className={`${input} mt-1`} name="title" required pattern=".*\S.*" /></label>
        <label className="block text-sm text-slate-300">Descripción<textarea className={`${input} mt-1`} name="description" required /></label>
        <label className="block text-sm text-slate-300">Categoría<input className={`${input} mt-1`} name="category" required pattern=".*\S.*" /></label>
        <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" name="isPublic" /> Público</label>
        <button className={button} disabled={api.pending.create}>Crear roadmap</button>
      </form></VocationalTestGate>}
      {api.loading ? <p role="status" className="text-slate-300">Cargando roadmaps…</p>
        : api.error ? <div role="alert" className="space-y-3 text-rose-200"><p>{api.error}</p><button className={button} onClick={api.refresh}>Reintentar</button></div>
        : !api.roadmaps.length ? <p className="text-slate-400">{tab === 'mis' ? 'Todavía no tienes roadmaps. Crea uno para comenzar.' : 'No hay roadmaps públicos disponibles.'}</p>
        : api.roadmaps.map(roadmap => <RoadmapCard key={`${tab}:${roadmap.id}:${api.revision}`} roadmap={roadmap} api={api} />)}
    </main>
  );
}
