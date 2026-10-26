export const SECTIONS = {
  users: { title: 'Usuarios', singular: 'usuario', metrics: [['postsCount', 'Publicaciones'], ['roadmapsCount', 'Roadmaps']], statuses: [['active', 'Activos'], ['inactive', 'Inactivos']] },
  roadmaps: { title: 'Roadmaps', singular: 'roadmap', metrics: [['likesCount', 'Me gusta'], ['stepsCount', 'Bloques']], statuses: [['public', 'Publicos'], ['private', 'Privados']] },
  posts: { title: 'Publicaciones', singular: 'publicacion', metrics: [['votesCount', 'Me gusta'], ['views', 'Vistas']], statuses: [] },
  questions: { title: 'Test vocacional', singular: 'pregunta', metrics: [['optionsCount', 'Alternativas']], statuses: [['with', 'Con alternativas'], ['without', 'Sin alternativas'], ['incomplete', 'Menos de 2 alternativas']] },
};
export const emptyFilters = { query: '', author: '', status: '', role: '', category: '', metric: '', min: '', max: '', from: '', to: '', order: 'id:desc' };
const text = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function filterRows(rows, filters, _section, users = []) {
  const authors = new Map(users.map(user => [String(user.id), `${user.id} ${user.name} ${user.email}`]));
  const result = rows.filter(row => {
    if (filters.query && !text([row.id, row.name, row.email, row.title, row.text, row.content, row.description, ...(row.vocacionalOptions ?? []).map(option => `${option.text} ${Object.keys(option.careerScore ?? {}).join(" ")}`)].join(' ')).includes(text(filters.query))) return false;
    if (filters.author && !text(authors.get(String(row.userId)) ?? `${row.userId} ${row.authorName}`).includes(text(filters.author))) return false;
    if (filters.role && row.role !== filters.role) return false;
    if (filters.category && row.category !== filters.category) return false;
    if (filters.status === 'active' && !row.active || filters.status === 'inactive' && row.active) return false;
    if (filters.status === 'public' && !row.isPublic || filters.status === 'private' && row.isPublic) return false;
    if (filters.status === 'with' && !row.optionsCount || filters.status === 'without' && row.optionsCount > 0) return false;
    if (filters.status === 'incomplete' && row.optionsCount >= 2) return false;
    if (filters.metric && filters.min !== '' && Number(row[filters.metric] ?? 0) < Number(filters.min)) return false;
    if (filters.metric && filters.max !== '' && Number(row[filters.metric] ?? 0) > Number(filters.max)) return false;
    const day = row.createdAt?.slice(0, 10);
    if (filters.from && (!day || day < filters.from) || filters.to && (!day || day > filters.to)) return false;
    return true;
  });
  const [field, direction] = filters.order.split(':');
  return result.sort((a, b) => {
    const first = a[field] ?? '', second = b[field] ?? '';
    const compared = typeof first === 'number' ? first - second : String(first).localeCompare(String(second), 'es');
    return compared * (direction === 'asc' ? 1 : -1) || a.id - b.id;
  });
}
export function prepareBody(kind, draft) {
  if (kind === 'users') { const { name, email, role, university, biography, active } = draft; return { name: name.trim(), email: email.trim(), role, university, biography, active, password: draft.password || null }; }
  if (kind === 'roadmaps') { const { title, description, category, isPublic } = draft; return { title: title.trim(), description: description.trim(), category: category.trim(), isPublic, userId: Number(draft.userId) }; }
  if (kind === 'posts') return { title: draft.title.trim(), content: draft.content.trim(), tagIds: draft.tagIds, userId: Number(draft.userId) };
  if (kind === 'options') {
    const entries = draft.scores.map(item => [item.career.trim(), Number(item.score)]);
    if (!entries.length || entries.some(([name, score]) => !name || !Number.isInteger(score) || score < 0 || score > 100)) throw new Error('Agrega al menos una carrera con un puntaje entero entre 0 y 100.');
    if (new Set(entries.map(([name]) => text(name))).size !== entries.length) throw new Error('No repitas las carreras.');
    return { text: draft.text.trim(), careerScore: Object.fromEntries(entries) };
  }
  return { text: draft.text.trim() };
}
