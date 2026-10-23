import CategorySearch from "./CategorySearch";
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
  onCategoryCreated,
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
          <CategorySearch key={`${mode}:${open}`} tags={tags} selectedIds={draft.tagIds} onToggle={onToggleTag}
            onCreated={onCategoryCreated} disabled={saving} />
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
