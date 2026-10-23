import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";

const button = "rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-50";
const input = "mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-white";

export default function StepActions({ step, busy, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description);

  async function save(event) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || busy) return;
    if (await onSave({ title: title.trim(), description: description.trim() })) setEditing(false);
  }

  if (editing) return <form onSubmit={save} className="w-full space-y-3 rounded-xl border border-indigo-400/30 p-3">
    <label className="block text-sm">Título del paso<input value={title} onChange={event => setTitle(event.target.value)} required maxLength={255} className={input} /></label>
    <label className="block text-sm">Descripción<textarea rows={6} value={description} onChange={event => setDescription(event.target.value)} required className={input} /></label>
    <div className="flex gap-2">
      <button className={button} disabled={busy || !title.trim() || !description.trim()}>Guardar cambios</button>
      <button type="button" className={button} disabled={busy} onClick={() => setEditing(false)}>Cancelar</button>
    </div>
  </form>;
  if (confirming) return <div role="alert" className="w-full space-y-2 rounded-xl border border-rose-400/30 p-3">
    <p>¿Eliminar el paso "{step.title}" y su progreso? Esta acción es permanente.</p>
    <div className="flex gap-2">
      <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/25 disabled:opacity-50" disabled={busy} onClick={onDelete}><Trash2 className="size-4" aria-hidden="true" />Eliminar paso</button>
      <button type="button" className={button} disabled={busy} onClick={() => setConfirming(false)}>Cancelar</button>
    </div>
  </div>;
  return <div className="flex flex-wrap gap-2">
    <button type="button" className={button} disabled={busy} onClick={() => { setTitle(step.title); setDescription(step.description); setEditing(true); }}><Pencil className="mr-1 inline size-4" aria-hidden="true" />Editar paso</button>
    <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/25 disabled:opacity-50" disabled={busy} onClick={() => setConfirming(true)}><Trash2 className="size-4" aria-hidden="true" />Eliminar paso</button>
  </div>;
}
