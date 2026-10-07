import { Button } from "@/components/ui/button";

export default function ForumComposerDialog({
  open,
  mode = "create",
  error,
  saving,
  tags,
  draft,
  onDraftChange,
  onToggleTag,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <form onSubmit={onSubmit} role="dialog" aria-modal="true" aria-labelledby="new-post-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-post-title" className="text-lg font-semibold text-white">
            {mode === "edit" ? "Editar publicación" : "Nueva publicación"}
          </h2>
        </div>
        {error && <p role="alert" className="mb-3 text-sm text-rose-200">{error}</p>}
        <label className="mb-3 block text-sm text-slate-200">
          Título
          <input required maxLength={255} value={draft.title} onChange={(event) => onDraftChange((current) => ({ ...current, title: event.target.value }))} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none" />
        </label>
        <label className="mb-4 block text-sm text-slate-200">
          Contenido
          <textarea required rows={5} value={draft.content} onChange={(event) => onDraftChange((current) => ({ ...current, content: event.target.value }))} className="mt-1 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none" />
        </label>
        <fieldset className="mb-5">
          <legend className="mb-2 text-sm text-slate-200">Categorías relacionadas</legend>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${draft.tagIds.includes(tag.id) ? "border-violet-400/70 bg-violet-500/15 text-white" : "border-white/10 text-slate-200 hover:bg-white/5"}`}>
                  <input type="checkbox" checked={draft.tagIds.includes(tag.id)} onChange={() => onToggleTag(tag.id)} />
                  {tag.name}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No hay categorías disponibles por el momento.</p>
          )}
        </fieldset>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="cursor-pointer">
            {saving
              ? (mode === "edit" ? "Guardando..." : "Publicando...")
              : (mode === "edit" ? "Guardar cambios" : "Publicar")}
          </Button>
        </div>
      </form>
    </div>
  );
}
