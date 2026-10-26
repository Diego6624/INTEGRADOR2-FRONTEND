import { useState } from 'react';
import AdminModal from './AdminModal';
import { prepareBody } from './adminModel';

const input = 'mt-2 w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-400 disabled:opacity-70';
const button = 'rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-50';
export default function AdminEditor({ editor, users, tags, busy, error, onSave, onClose }) {
  const { kind, item, readOnly } = editor;
  const [draft, setDraft] = useState(() => ({ name: '', email: '', role: 'ESTUDIANTE', active: true, university: '', biography: '', title: '', description: '', category: '', isPublic: false, userId: '', content: '', text: '', ...item,
    tagIds: item?.tags?.map(tag => tag.id) ?? [], password: '',
    scores: Object.entries(item?.careerScore ?? {}).map(([career, score]) => ({ career, score })),
  }));
  const [validation, setValidation] = useState('');
  const change = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  function field(label, key, { type = 'text', required = true, multiline = false, ...extra } = {}) {
    return <label className="block text-sm text-slate-300" key={key}>{label}{multiline
      ? <textarea rows={5} className={input} value={draft[key] ?? ''} onChange={event => change(key, event.target.value)} required={required} {...extra} />
      : <input className={input} type={type} value={draft[key] ?? ''} onChange={event => change(key, event.target.value)} required={required} {...extra} />}</label>;
  }
  async function submit(event) {
    event.preventDefault(); setValidation('');
    try { await onSave(prepareBody(kind, draft)); } catch (saveError) { setValidation(saveError.message); }
  }
  const title = { users: 'usuario', roadmaps: 'roadmap', posts: 'publicación', questions: 'pregunta', options: 'alternativa' }[kind];
  return <AdminModal titleId="admin-editor-title" busy={busy} onClose={onClose}>
      <div className="mb-6 flex items-center justify-between gap-4"><h2 id="admin-editor-title" className="text-2xl">{readOnly ? 'Detalle de' : item ? 'Editar' : 'Crear'} {title}</h2><button type="button" className={button} disabled={busy} onClick={onClose}>Cerrar</button></div>
      <form onSubmit={submit} className="space-y-5"><fieldset disabled={busy || readOnly} className="space-y-5">
        {kind === 'users' && <>
          {field('Nombre', 'name', { maxLength: 255 })}{field('Correo', 'email', { type: 'email' })}
          <label className="block text-sm text-slate-300">Rol<select className={input} value={draft.role} onChange={event => change('role', event.target.value)}><option value="ESTUDIANTE">Estudiante</option><option value="ADMINISTRADOR">Administrador</option></select></label>
          {!readOnly && field(item ? 'Nueva contraseña (dejar vacío para conservar)' : 'Contraseña', 'password', { type: 'password', required: !item, minLength: 8, autoComplete: 'new-password' })}
          {!readOnly && <p className="text-xs text-slate-400">Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo (@ # $ % ^ & + = ! - _).</p>}
          {field('Universidad', 'university', { required: false })}{field('Biografía', 'biography', { multiline: true, required: false })}
          <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.active} onChange={event => change('active', event.target.checked)} />Cuenta activa</label>
        </>}
        {(kind === 'roadmaps' || kind === 'posts') && <>
          {field('Título', 'title', { maxLength: 255 })}
          <label className="block text-sm text-slate-300">Autor<select className={input} value={draft.userId} required disabled={Boolean(item)} onChange={event => change('userId', event.target.value)}><option value="">Selecciona un usuario</option>{users.map(user => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}</select></label>
          {kind === 'roadmaps' ? <>{field('Descripción', 'description', { multiline: true })}{field('Categoría', 'category', { maxLength: 255 })}
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.isPublic} onChange={event => change('isPublic', event.target.checked)} />Roadmap público</label></>
            : <>{field('Contenido de la publicación', 'content', { multiline: true })}<div className="space-y-2"><p className="text-sm text-slate-300">Categorías</p><div className="flex flex-wrap gap-3">{tags.map(tag => <label key={tag.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.tagIds.includes(tag.id)} onChange={event => change('tagIds', event.target.checked ? [...draft.tagIds, tag.id] : draft.tagIds.filter(id => id !== tag.id))} />{tag.name}</label>)}</div></div></>}
        </>}
        {(kind === 'questions' || kind === 'options') && field(kind === 'questions' ? 'Pregunta' : 'Alternativa', 'text', { multiline: true, maxLength: 255 })}
        {kind === 'options' && <div className="space-y-3"><p className="text-sm text-slate-300">Puntajes por carrera</p>{draft.scores.map((score, index) => <div key={index} className="flex flex-wrap items-end gap-2">
          <label className="min-w-40 flex-1 text-xs">Carrera<input className={input} value={score.career} required onChange={event => change('scores', draft.scores.map((item, i) => i === index ? { ...item, career: event.target.value } : item))} /></label>
          <label className="w-24 text-xs">Puntaje<input type="number" min="0" max="100" step="1" required className={input} value={score.score} onChange={event => change('scores', draft.scores.map((item, i) => i === index ? { ...item, score: event.target.value } : item))} /></label>
          {!readOnly && <button type="button" className={button} onClick={() => change('scores', draft.scores.filter((_, i) => i !== index))}>Quitar</button>}
        </div>)}{!readOnly && <button type="button" className={button} onClick={() => change('scores', [...draft.scores, { career: '', score: 0 }])}>Agregar carrera</button>}</div>}
      </fieldset>
      {(validation || error) && <p role="alert" className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200">{validation || error}</p>}
      {!readOnly && <div className="flex justify-end gap-3 border-t border-white/10 pt-4"><button type="button" className={button} disabled={busy} onClick={onClose}>Cancelar</button><button className={`${button} bg-indigo-500 text-white`} disabled={busy}>{busy ? 'Guardando...' : 'Guardar'}</button></div>}
      </form>
  </AdminModal>;
}
