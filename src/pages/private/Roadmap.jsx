import { Trash2, X, GitBranch, Pencil } from 'lucide-react';
import { canConnect } from './roadmap/roadmapGraph';
import MarkdownContent from '@/components/MarkdownContent';
import StepActions from './roadmap/StepActions';
import { Link, useSearchParams } from 'react-router-dom';
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
const dangerButton = 'inline-flex items-center justify-center gap-2 rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-300/70 hover:bg-rose-500/25 focus-visible:outline-2 focus-visible:outline-rose-400 disabled:opacity-50';
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
      <Handle type="target" position={Position.Top} className="!size-3 !border-indigo-200 !bg-indigo-500" />
      <div className="flex h-full w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-center text-sm text-white shadow-lg"
        style={{ border: `1.5px solid ${option.color}` }} title={data.description}>
        {data.status === 'HECHO' && <span className="text-emerald-300">✓</span>}
        <span className="line-clamp-2">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!size-3 !border-indigo-200 !bg-indigo-500" />
    </>
  );
}
const NODE_TYPES = { roadmap: RoadmapNode };

function RoadmapCard({ roadmap, api }) {
  const [view, setView] = useState('map');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const busy = Object.values(api.pending).some(Boolean);
  const [selected, setSelected] = useState(null);
  const [nextStep, setNextStep] = useState("");
  const [nodes, setNodes] = useState(() => buildNodes(roadmap.steps));
  const dragOrigins = useRef(new Map());
  const formRef = useRef(null);
  const owned = String(roadmap.userId) === String(api.userId);
  const selectedStep = roadmap.steps.find(step => String(step.id) === selected);
  const stepActions = step => owned && <StepActions key={step.id} step={step} busy={busy}
    onSave={values => api.updateStep(roadmap.id, step.id, values)} onDelete={() => api.deleteStep(roadmap.id, step.id)} />;
  const done = roadmap.steps.filter(step => api.progress[String(step.id)]?.status === 'HECHO').length;
  const percentage = roadmap.steps.length ? Math.round(done / roadmap.steps.length * 100) : 0;
  const sorted = [...roadmap.steps].sort((a, b) => a.orderIndex - b.orderIndex || a.id - b.id);
  const links = roadmap.graph.links;
  const edges = links.map(link => ({
    id: `${link.sourceId}-${link.targetId}`, source: String(link.sourceId), target: String(link.targetId),
    type: 'smoothstep', markerEnd: { type: 'arrowclosed', color: '#818cf8' },
    style: { stroke: '#818cf8', strokeWidth: 2 },
  }));
  const validConnection = (source, target) => canConnect(links, source, target, roadmap.steps.map(step => step.id));
  const connect = (source, target) => {
    if (!owned || busy || !validConnection(source, target)) return;
    api.saveConnections(roadmap.id, [...links, { sourceId: Number(source), targetId: Number(target) }]);
  };
  const displayNodes = nodes.map(node => ({ ...node,
    draggable: owned && !busy && !api.pending[`position:${node.id}`],
    data: { ...node.data, label: roadmap.steps.find(step => String(step.id) === node.id)?.title, description: roadmap.steps.find(step => String(step.id) === node.id)?.description, status: api.progress[node.id]?.status ?? 'PENDIENTE' },
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
    <article className={`${panel} space-y-4`} aria-label={roadmap.title} id={`roadmap-${roadmap.id}`}>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-white">{roadmap.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{roadmap.category} · {roadmap.isPublic ? 'Público' : 'Privado'}</p>
          <MarkdownContent>{roadmap.description}</MarkdownContent>
        </div>
        <div className="flex gap-2">
          {['list', 'map'].map(mode => <button key={mode} type="button" aria-pressed={view === mode}
            className={`${button} ${view === mode ? 'bg-indigo-500/25' : ''}`} onClick={() => setView(mode)}>
            {mode === 'list' ? 'Lista' : 'Mapa'}
          </button>)}
        </div>
      </header>
      {owned && <div className="space-y-2">
        {!confirmDelete ? <button type="button" className={dangerButton} disabled={busy} onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" aria-hidden="true" />Eliminar roadmap</button>
          : <div role="alert" className="space-y-3 rounded-xl border border-rose-400/30 p-3">
            <p className="text-sm text-rose-200">¿Eliminar "{roadmap.title}" con todos sus pasos y progreso? Esta acción es permanente.</p>
            <div className="flex gap-2">
              <button type="button" className={dangerButton} disabled={busy} onClick={() => api.deleteRoadmap(roadmap.id)}><Trash2 className="size-4" aria-hidden="true" />Confirmar eliminación</button>
              <button type="button" className={button} disabled={busy} onClick={() => setConfirmDelete(false)}>Cancelar</button>
            </div>
          </div>}
      </div>}
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
                <MarkdownContent>{step.description}</MarkdownContent>
              </div>
              <StatusSelect status={api.progress[String(step.id)]?.status ?? 'PENDIENTE'} disabled={busy || api.pending[`status:${step.id}`]}
                onChange={status => api.saveStatus(step.id, status)} />
              {stepActions(step)}
            </li>)}
          </ol>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">{owned ? 'Arrastra un paso para guardar su posición. ' : ''}Selecciona un paso para actualizar tu avance.</p>
            {owned && <p className="flex items-center gap-2 text-xs text-indigo-200"><GitBranch className="size-4" />Conecta los puntos de dos pasos para crear una rama. Tambien puedes agregar conexiones desde el panel lateral.</p>}
            <div className="relative flex h-[600px] overflow-hidden rounded-xl border border-white/10">
              <div className="min-w-0 flex-1">
                <ReactFlow nodes={displayNodes} edges={edges} nodeTypes={NODE_TYPES} onNodesChange={handleNodesChange}
                  nodeOrigin={[0.5, 0.5]} onNodeClick={(_, node) => { setSelected(node.id); setNextStep(""); }}
                  onEdgeClick={(_, edge) => { setSelected(edge.source); setNextStep(""); }}
                  onNodeDragStart={(_, node) => dragOrigins.current.set(node.id, { ...node.position })} onNodeDragStop={handleDragStop}
                  nodesDraggable={owned && !busy} nodesConnectable={owned && !busy} edgesReconnectable={false} deleteKeyCode={null}
                  onConnect={({ source, target }) => connect(source, target)} isValidConnection={({ source, target }) => validConnection(source, target)}
                  fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.2} maxZoom={2} colorMode="dark">
                  <Background color="#1e2d4a" gap={24} /><Controls showInteractive={false} />
                </ReactFlow>
              </div>
              <aside aria-label="Detalles del paso" className={`${selectedStep ? 'absolute inset-y-0 right-0 z-10 flex w-full max-w-sm lg:static lg:w-80 xl:w-96' : 'hidden lg:flex lg:w-72'} shrink-0 flex-col border-l border-white/10 bg-slate-950/95 shadow-xl backdrop-blur-xl`}>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
                  <h3 className="flex items-center gap-2 font-semibold"><Pencil className="size-4 text-indigo-300" />Detalles del paso</h3>
                  {selectedStep && <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar detalles del paso" className="rounded-lg p-2 hover:bg-white/10"><X className="size-4" /></button>}
                </div>
                {selectedStep ? <div className="min-h-0 space-y-4 overflow-y-auto p-4 text-sm text-slate-200">
                  <h4 className="text-lg font-semibold text-white">{selectedStep.title}</h4>
                  <StatusSelect status={api.progress[selected]?.status ?? 'PENDIENTE'} disabled={busy}
                    onChange={status => api.saveStatus(selected, status)} />
                  {stepActions(selectedStep)}
                  <MarkdownContent>{selectedStep.description}</MarkdownContent>
                  <section className="space-y-3 border-t border-white/10 pt-4">
                    <h4 className="flex items-center gap-2 font-semibold"><GitBranch className="size-4 text-indigo-300" />Siguientes pasos</h4>
                    {links.filter(link => String(link.sourceId) === selected).map(link => <div key={link.targetId} className="flex items-center justify-between gap-2 rounded-lg bg-white/5 p-2">
                      <button type="button" className="min-w-0 text-left text-indigo-200 hover:underline" onClick={() => { setSelected(String(link.targetId)); setNextStep(""); }}>{roadmap.steps.find(step => step.id === link.targetId)?.title}</button>
                      {owned && <button type="button" className="rounded p-1 text-rose-300 hover:bg-rose-500/20" disabled={busy}
                        aria-label={`Quitar conexion a ${roadmap.steps.find(step => step.id === link.targetId)?.title}`}
                        onClick={() => api.saveConnections(roadmap.id, links.filter(item => item !== link))}><X className="size-4" /></button>}
                    </div>)}
                    {!links.some(link => String(link.sourceId) === selected) && <p className="text-xs text-slate-400">Este paso no tiene conexiones de salida.</p>}
                    {owned && <div className="space-y-2">
                      <label className="block">Conectar con<select value={nextStep} disabled={busy} onChange={event => setNextStep(event.target.value)} className={`${input} mt-1`}>
                        <option value="">Selecciona otro paso</option>
                        {roadmap.steps.filter(step => validConnection(selected, step.id)).map(step => <option key={step.id} value={step.id}>{step.title}</option>)}
                      </select></label>
                      <button type="button" className={`${button} inline-flex items-center gap-2`} disabled={busy || !nextStep} onClick={() => { connect(selected, nextStep); setNextStep(""); }}><GitBranch className="size-4" />Agregar conexion</button>
                    </div>}
                  </section>
                </div> : <p className="p-4 text-sm leading-6 text-slate-400">Selecciona un paso del mapa para ver su contenido, editarlo y administrar sus conexiones.</p>}
              </aside>
            </div>
          </div>
        )}
      {owned && <details className="border-t border-white/10 pt-3 text-sm text-slate-300">
        <summary className="cursor-pointer">Agregar paso</summary>
        <form ref={formRef} onSubmit={addStep} className="mt-3 space-y-3">
          <label className="block">Título<input className={`${input} mt-1`} name="title" required pattern=".*\S.*" /></label>
          <label className="block">Descripción<textarea className={`${input} mt-1`} name="description" required /></label>
          <button className={button} disabled={busy}>Guardar paso</button>
        </form>
      </details>}
    </article>
  );
}

export default function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const focusedId = searchParams.get("roadmap");
  const [tab, setTab] = useState('mis');
  const [creating, setCreating] = useState(false);
  const api = useRoadmaps(tab);
  const busy = Object.values(api.pending).some(Boolean);
  const orderedRoadmaps = [...api.roadmaps].sort((a, b) => Number(String(b.id) === focusedId) - Number(String(a.id) === focusedId));

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
        <Link className={button} to="/agent?mode=roadmap">Crear roadmap con IA</Link>
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
        : orderedRoadmaps.map(roadmap => <RoadmapCard key={`${tab}:${roadmap.id}:${api.revision}`} roadmap={roadmap} api={api} />)}
    </main>
  );
}
