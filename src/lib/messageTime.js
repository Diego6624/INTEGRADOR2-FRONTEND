// Legacy LocalDateTime values are assumed UTC. Set VITE_MESSAGE_TIME_OFFSET=-05:00
// only if the server stores Peru local time. Prefer ISO timestamps with Z/offset.
export function messageDate(value) {
  if (!value) return null;
  const raw = String(value);
  const explicit = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw);
  const date = new Date(explicit ? raw : raw + (import.meta.env?.VITE_MESSAGE_TIME_OFFSET || 'Z'));
  return Number.isNaN(date.getTime()) ? null : date;
}
export function formatMessageTime(value, full = false) {
  const date = messageDate(value);
  return date ? new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima', hour: '2-digit', minute: '2-digit',
    ...(full ? { year: 'numeric', month: '2-digit', day: '2-digit' } : {}),
  }).format(date) : '';
}
