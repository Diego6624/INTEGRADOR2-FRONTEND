import { useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Link } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";

export default function GeneratedRoadmapPreview({ roadmap, saving, savedId, onSave, onRegenerate }) {
  const [view, setView] = useState("map");
  const [selected, setSelected] = useState(0);
  const nodes = roadmap.steps.map((step, index) => ({ id: String(index),
    position: { x: step.x, y: step.y }, data: { label: step.title },
    style: { width: 260, background: index === selected ? '#312e81' : '#0f172a', color: '#fff', border: '1px solid #818cf8', borderRadius: 12 },
  }));
  const edges = roadmap.connections.map(({ source, target }) => ({ id: `${source}-${target}`, source: String(source), target: String(target), type: 'smoothstep', markerEnd: { type: 'arrowclosed', color: '#818cf8' }, style: { stroke: '#818cf8', strokeWidth: 2 } }));
  return <section className="mt-5 space-y-4 rounded-2xl border border-white/15 bg-slate-950/80 p-5">
    <h2 className="text-xl font-semibold">{roadmap.title}</h2>
    <MarkdownContent>{roadmap.description}</MarkdownContent>
    <div className="flex flex-wrap gap-2">
      {[['map', 'Mapa'], ['list', 'Lista']].map(([value, label]) => <button key={value} type="button" aria-pressed={view === value}
        onClick={() => setView(value)} className="rounded-lg border border-white/20 px-3 py-2">{label}</button>)}
      {!savedId && <button type="button" disabled={saving} onClick={onSave} className="rounded-lg bg-indigo-600 px-3 py-2 disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar roadmap'}</button>}
      {savedId && <Link className="rounded-lg bg-emerald-700 px-3 py-2" to={`/roadmap?roadmap=${savedId}`}>Ver roadmap guardado</Link>}
      <button type="button" disabled={saving} onClick={onRegenerate} className="rounded-lg border border-white/20 px-3 py-2">Generar otro</button>
    </div>
    {savedId && <p role="status" className="text-sm text-emerald-300">Roadmap y pasos guardados en Mis Roadmaps.</p>}
    {view === 'map' ? <>
      <div className="h-[480px] overflow-hidden rounded-xl border border-white/10">
        <ReactFlow nodes={nodes} edges={edges} nodesDraggable={false} nodesConnectable={false} edgesReconnectable={false}
          deleteKeyCode={null} onNodeClick={(_, node) => setSelected(Number(node.id))} fitView minZoom={0.2} colorMode="dark">
          <Background /><Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <h3 className="font-semibold">{roadmap.steps[selected].title}</h3>
      <MarkdownContent>{roadmap.steps[selected].description}</MarkdownContent>
    </> : <ol className="space-y-4">{roadmap.steps.map((step, index) => <li key={index} className="rounded-xl bg-white/5 p-4">
      <h3 className="font-semibold">{index + 1}. {step.title}</h3><MarkdownContent>{step.description}</MarkdownContent>
    </li>)}</ol>}
  </section>;
}
