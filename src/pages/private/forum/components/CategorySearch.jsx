import { useState } from "react";
import { createCategory, normalizeCategory } from "../categoryApi";

export default function CategorySearch({ tags, selectedIds, onToggle, onCreated, disabled = false, compact = false, leadingAction }) {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const normalized = normalizeCategory(query);
  const matches = tags.filter(tag => normalizeCategory(tag.name).includes(normalized));
  const exact = tags.some(tag => normalizeCategory(tag.name) === normalized);

  async function create() {
    if (creating || disabled) return;
    setCreating(true);
    setError("");
    try {
      const tag = await createCategory(query);
      onCreated(tag);
      setQuery("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No se pudo crear la categoría. Inténtalo nuevamente.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="w-full min-w-0 space-y-4">
      <label className={`block text-sm text-slate-300 ${compact ? "max-w-sm" : ""}`}>
        Buscar categorías
        <input type="search" value={query} disabled={disabled || creating} maxLength={255}
          onChange={event => { setQuery(event.target.value); setError(""); }}
          placeholder="Escribe una categoría..."
          className="mt-2 h-10 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 text-sm text-white outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20" />
      </label>
      <div className="flex max-h-40 flex-wrap items-center gap-2.5 overflow-y-auto p-0.5" aria-busy={creating}>
        {leadingAction}
        {matches.map(tag => <button key={tag.id} type="button" disabled={disabled || creating}
          aria-pressed={selectedIds.includes(tag.id)} onClick={() => onToggle(tag.id)}
          className={`min-h-9 rounded-full border px-4 py-1.5 text-sm transition hover:border-violet-400/60 hover:bg-violet-500/10 focus-visible:outline-2 focus-visible:outline-violet-400 ${selectedIds.includes(tag.id) ? "border-violet-400 bg-violet-500/20 text-white" : "border-white/15 text-slate-200"}`}>
          {tag.name}
        </button>)}
        {!matches.length && <p className="text-sm text-slate-400">No se encontraron categorías.</p>}
      </div>
      {!compact && selectedIds.length > 0 && <p className="text-xs text-slate-300">Seleccionadas: {tags.filter(tag => selectedIds.includes(tag.id)).map(tag => tag.name).join(", ")}</p>}
      {onCreated && normalized && !exact && <button type="button" onClick={create} disabled={disabled || creating}
        className="rounded-lg border border-violet-400/50 px-3 py-2 text-sm text-violet-200 disabled:opacity-50">
        {creating ? "Verificando y creando..." : `Crear categoría "${query.trim()}"`}
      </button>}
      {error && <p role="alert" className="text-sm text-rose-200">{error}</p>}
    </div>
  );
}
