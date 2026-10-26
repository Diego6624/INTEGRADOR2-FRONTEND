import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Eye, Pencil, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import apiFetch from '@/lib/apiClient';
import { fetchAllPages, errorMessage } from '../roadmap/roadmapApi';
import { useAuth } from '@/hooks/useAuth';
import AdminEditor from './AdminEditor';
import AdminModal from './AdminModal';
import { SECTIONS, emptyFilters, filterRows } from './adminModel';

const panel = 'rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-6';
const button = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-indigo-400 disabled:opacity-40';
const input = 'mt-2 h-10 w-full rounded-xl border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-indigo-400';
const date = value => value ? new Date(value).toLocaleDateString('es-PE') : '-';
export default function AdminPage() {
  const { section = 'users' } = useParams();
  if (!SECTIONS[section]) return <Navigate to="/admin/users" replace />;
  return <AdminSection key={section} section={section} />;
}

function AdminSection({ section }) {
  const config = SECTIONS[section];
  const { usuario, verificarSesion } = useAuth();
  const [data, setData] = useState({ rows: [], users: [], tags: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(0);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [questionId, setQuestionId] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError('');
      try {
        const options = { signal: controller.signal };
        const [users, rows, tags] = await Promise.all([
          fetchAllPages('/admin/users', options, apiFetch),
          section === 'users' ? Promise.resolve(null) : fetchAllPages(`/admin/${section}`, options, apiFetch),
          section === 'posts' ? fetchAllPages('/tag', options, apiFetch) : Promise.resolve([]),
        ]);
        if (!controller.signal.aborted) setData({ users, tags, rows: (rows ?? users).map(item => ({ ...item, optionsCount: item.vocacionalOptions?.length ?? 0 })) });
      } catch (requestError) {
        if (!controller.signal.aborted) setError(errorMessage(requestError, 'No se pudo cargar el panel.'));
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load(); return () => controller.abort();
  }, [section, reload]);
  const visible = filterRows(data.rows, filters, section, data.users);
  const pages = Math.max(1, Math.ceil(visible.length / 10));
  const currentPage = Math.min(page, pages - 1);
  const rows = visible.slice(currentPage * 10, currentPage * 10 + 10);
  const selectedQuestion = data.rows.find(item => item.id === questionId);
  const changeFilter = (key, value) => { setFilters(current => ({ ...current, [key]: value })); setPage(0); };
  function open(kind, item = null, extra = {}) { setActionError(''); setEditor({ kind, item, ...extra }); }
  async function save(body) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setActionError('');
    try {
      const path = editor.kind === 'options' && !editor.item ? `/admin/questions/${editor.questionId}/options` : `/admin/${editor.kind}${editor.item ? `/${editor.item.id}` : ''}`;
      if (editor.item) await apiFetch.put(path, body); else await apiFetch.post(path, body);
      if (editor.kind === 'users' && editor.item?.id === usuario.id) await verificarSesion();
      setEditor(null); setNotice('Cambios guardados.'); setReload(value => value + 1);
    } catch (requestError) { setActionError(errorMessage(requestError, 'No se pudo guardar.')); }
    finally { lock.current = false; setBusy(false); }
  }
  async function remove() {
    if (lock.current) return;
    lock.current = true; setBusy(true); setActionError('');
    try {
      await apiFetch.delete(`/admin/${deleting.kind}/${deleting.item.id}`);
      setDeleting(null); setNotice(section === 'users' ? 'Cuenta desactivada.' : 'Elemento eliminado.'); setReload(value => value + 1);
    } catch (requestError) { setActionError(errorMessage(requestError, 'No se pudo eliminar.')); }
    finally { lock.current = false; setBusy(false); }
  }
  function askDelete(kind, item) { setActionError(''); setDeleting({ kind, item }); }
  function filter(label, key, children) {
    return <label className="block min-w-0 text-xs text-slate-400">{label}{children ?? <input className={input} value={filters[key]} onChange={event => changeFilter(key, event.target.value)} />}</label>;
  }
  const ownerSection = section === 'posts' || section === 'roadmaps';
  return <main className="space-y-5">
    <header className={`${panel} space-y-5`}>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-300"><ShieldCheck className="size-4" />Panel de administrador</p><h1 className="text-3xl">{config.title}</h1></div>
        <div className="flex gap-2"><button type="button" className={button} disabled={loading || busy} onClick={() => setReload(value => value + 1)}><RefreshCw className="size-4" />Actualizar</button><button type="button" className={`${button} bg-indigo-500/30`} disabled={loading || busy || Boolean(error)} onClick={() => open(section)}><Plus className="size-4" />Crear {config.singular}</button></div></div>
      <nav aria-label="Administración" className="flex flex-wrap gap-2">{Object.entries(SECTIONS).map(([key, item]) => <Link key={key} to={`/admin/${key}`} aria-current={key === section ? 'page' : undefined} className={`${button} ${section === key ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-100' : 'text-slate-400'}`}>{item.title}</Link>)}</nav>
      <p className="text-sm text-slate-400">{section === 'users' ? 'Gestiona cuentas, roles y estado de acceso. Eliminar desactiva la cuenta; puedes reactivarla desde Editar.' : section === 'posts' ? 'Administra las publicaciones y busca por su autor. Las respuestas no se muestran en este panel.' : section === 'questions' ? 'Gestiona las preguntas, sus alternativas y los puntajes por carrera.' : 'Administra los roadmaps de todos los usuarios y su visibilidad.'}</p>
    </header>
    <section className={`${panel} space-y-5`} aria-label="Filtros">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filter(section === 'users' ? 'Buscar nombre, correo o ID' : 'Buscar contenido o ID', 'query')}
        {ownerSection && filter('Buscar por usuario (nombre, correo o ID)', 'author')}
        {config.statuses.length > 0 && filter('Estado', 'status', <select className={input} value={filters.status} onChange={event => changeFilter('status', event.target.value)}><option value="">Todos</option>{config.statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>)}
        {section === 'users' && filter('Rol', 'role', <select className={input} value={filters.role} onChange={event => changeFilter('role', event.target.value)}><option value="">Todos</option><option value="ADMINISTRADOR">Administrador</option><option value="ESTUDIANTE">Estudiante</option></select>)}
        {section === 'roadmaps' && filter('Categoría', 'category', <select className={input} value={filters.category} onChange={event => changeFilter('category', event.target.value)}><option value="">Todas</option>{[...new Set(data.rows.map(row => row.category))].filter(Boolean).sort().map(category => <option key={category}>{category}</option>)}</select>)}
        {filter('Ordenar por', 'order', <select className={input} value={filters.order} onChange={event => changeFilter('order', event.target.value)}><option value="id:desc">Más nuevos</option><option value="id:asc">Más antiguos</option>{section !== 'questions' && <option value="createdAt:desc">Fecha de creación</option>}{config.metrics.flatMap(([key, label]) => [<option key={`${key}:desc`} value={`${key}:desc`}>{label}: mayor a menor</option>, <option key={`${key}:asc`} value={`${key}:asc`}>{label}: menor a mayor</option>])}</select>)}
        {filter('Filtrar por métrica', 'metric', <select className={input} value={filters.metric} onChange={event => changeFilter('metric', event.target.value)}><option value="">Sin límite</option>{config.metrics.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>)}
        {['min', 'max'].map(key => <label key={key} className="text-xs text-slate-400">{key === 'min' ? 'Mínimo' : 'Máximo'}<input className={input} type="number" min="0" step="1" disabled={!filters.metric} value={filters[key]} onChange={event => changeFilter(key, event.target.value)} /></label>)}
        {section !== 'questions' && ['from', 'to'].map(key => <label key={key} className="text-xs text-slate-400">{key === 'from' ? 'Creado desde' : 'Creado hasta'}<input className={input} type="date" value={filters[key]} onChange={event => changeFilter(key, event.target.value)} /></label>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-400">{visible.length} de {data.rows.length} registros</p><button type="button" className={button} onClick={() => { setFilters(emptyFilters); setPage(0); }}>Limpiar filtros</button></div>
    </section>
    {section === 'questions' && !loading && !error && <p role="status" className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4 text-sm text-indigo-200">
      Banco de preguntas: {data.rows.length} preguntas, {data.rows.filter(row => row.optionsCount < 2).length} con menos de dos alternativas.
      El test requiere entre 20 y 40 preguntas, al menos dos alternativas por pregunta y puntajes de 0 a 100. Cada carrera debe tener un puntaje máximo positivo.
    </p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
    <section className={panel} aria-label={`Listado de ${config.title}`}>
      {loading ? <p role="status">Cargando registros...</p> : error ? <div role="alert"><p className="text-rose-200">{error}</p><button className={`${button} mt-3`} onClick={() => setReload(value => value + 1)}>Reintentar</button></div> : <>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-slate-400"><tr><th scope="col" className="p-3">ID</th><th scope="col" className="min-w-56 p-3">{section === 'users' ? 'Usuario' : section === 'questions' ? 'Pregunta' : 'Contenido'}</th><th scope="col" className="min-w-40 p-3">{ownerSection ? 'Autor' : 'Estado'}</th>{config.metrics.map(([key, label]) => <th scope="col" className="p-3" key={key}>{label}</th>)}{section !== 'questions' && <th scope="col" className="p-3">Creado</th>}<th scope="col" className="p-3">Acciones</th></tr></thead>
          <tbody>{rows.map(row => <tr key={row.id} className="border-b border-white/5 align-top hover:bg-white/[0.02]"><td className="p-3 text-slate-500">#{row.id}</td><td className="max-w-sm p-3"><p className="line-clamp-2 font-medium">{row.name ?? row.title ?? row.text}</p><p className="mt-1 text-xs text-slate-400">{section === 'users' ? row.email : section === 'roadmaps' ? `${row.category} / ${row.isPublic ? 'Público' : 'Privado'}` : ''}</p></td><td className="p-3 text-slate-300">{ownerSection ? <><p>{row.authorName}</p><p className="mt-1 text-xs text-slate-500">Usuario #{row.userId}</p></> : section === 'users' ? <><p>{row.active ? 'Activo' : 'Inactivo'}</p><p className="mt-1 text-xs text-indigo-300">{row.role}</p></> : row.optionsCount ? 'Con alternativas' : 'Sin alternativas'}</td>
            {config.metrics.map(([key]) => <td className="p-3 tabular-nums" key={key}>{row[key] ?? 0}</td>)}{section !== 'questions' && <td className="whitespace-nowrap p-3 text-slate-400">{date(row.createdAt)}</td>}
            <td className="p-3"><div className="flex flex-wrap gap-2"><button type="button" className={button} aria-label={`Ver ${config.singular} ${row.id}`} onClick={() => open(section, row, { readOnly: true })}><Eye className="size-4" /></button><button type="button" className={button} aria-label={`Editar ${config.singular} ${row.id}`} onClick={() => open(section, row)}><Pencil className="size-4" /></button><button type="button" className={`${button} text-rose-300`} disabled={section === 'users' && (row.id === usuario.id || !row.active)} aria-label={`${section === 'users' ? 'Desactivar' : 'Eliminar'} ${config.singular} ${row.id}`} onClick={() => askDelete(section, row)}><Trash2 className="size-4" /></button>{section === 'questions' && <button type="button" className={button} onClick={() => setQuestionId(row.id)}>Alternativas ({row.optionsCount})</button>}</div></td></tr>)}</tbody>
        </table></div>
        {!rows.length && <p className="py-8 text-center text-slate-400">No hay registros que coincidan con los filtros.</p>}
        <div className="mt-5 flex items-center justify-between gap-3"><button className={button} disabled={!currentPage} onClick={() => setPage(currentPage - 1)}>Anterior</button><span className="text-xs text-slate-400">Página {currentPage + 1} de {pages}</span><button className={button} disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>Siguiente</button></div>
      </>}
    </section>
    {section === 'questions' && selectedQuestion && <section className={`${panel} space-y-4`} aria-label="Alternativas de la pregunta"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-indigo-300">Pregunta #{selectedQuestion.id}</p><h2 className="mt-2 text-xl">{selectedQuestion.text}</h2></div><button className={button} disabled={loading || busy} onClick={() => open('options', null, { questionId: selectedQuestion.id })}><Plus className="size-4" />Agregar alternativa</button></div>
      {selectedQuestion.vocacionalOptions.map(option => <article key={option.id} className="space-y-3 rounded-xl border border-white/10 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><p className="min-w-0 flex-1 text-sm">#{option.id} / {option.text}</p><div className="flex gap-2"><button className={button} aria-label={`Editar alternativa ${option.id}`} onClick={() => open('options', option)}><Pencil className="size-4" /></button><button className={`${button} text-rose-300`} aria-label={`Eliminar alternativa ${option.id}`} onClick={() => askDelete('options', option)}><Trash2 className="size-4" /></button></div></div><div className="flex flex-wrap gap-2">{Object.entries(option.careerScore ?? {}).map(([career, score]) => <span key={career} className="rounded-lg bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">{career}: {score}</span>)}</div></article>)}
      {!selectedQuestion.optionsCount && <p className="text-sm text-slate-400">Agrega alternativas para que esta pregunta pueda usarse en el test.</p>}
    </section>}
    {editor && <AdminEditor key={`${editor.kind}:${editor.item?.id ?? 'new'}:${editor.readOnly}`} editor={editor} users={data.users} tags={data.tags} busy={busy} error={actionError} onSave={save} onClose={() => setEditor(null)} />}
    {deleting && <AdminModal titleId="admin-delete-title" alert busy={busy} onClose={() => setDeleting(null)}><h2 id="admin-delete-title" className="text-2xl">{deleting.kind === 'users' ? 'Desactivar cuenta' : 'Eliminar elemento'}</h2><p className="break-words text-sm text-slate-300">{deleting.item.name ?? deleting.item.title ?? deleting.item.text}</p><p className="text-sm text-slate-400">{deleting.kind === 'users' ? 'La cuenta perderá el acceso. Puedes reactivarla desde Editar.' : deleting.kind === 'questions' ? 'Se eliminarán la pregunta y todas sus alternativas. Los resultados ya calculados se conservan.' : deleting.kind === 'roadmaps' ? 'Se eliminarán también los bloques, enlaces, me gusta y progreso.' : deleting.kind === 'posts' ? 'Eliminar la publicación también elimina sus respuestas, votos y vistas registrados.' : 'La alternativa se retirará del test. Los resultados ya calculados se conservan.'}</p>{actionError && <p role="alert" className="text-sm text-rose-300">{actionError}</p>}<div className="flex justify-end gap-3"><button className={button} disabled={busy} onClick={() => setDeleting(null)}>Cancelar</button><button className={`${button} bg-rose-500/20 text-rose-200`} disabled={busy} onClick={remove}>{busy ? 'Procesando...' : 'Confirmar'}</button></div></AdminModal>}
  </main>;
}
