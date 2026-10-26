import CategorySearch from "./CategorySearch";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForumHeader({ tags, selectedTag, setSelectedTag, sort, setSort, onCreate, loading }) {
  return (
    <section aria-label="Foro de la comunidad" className="space-y-6 rounded-2xl border border-white/10 bg-slate-950/80 p-5 backdrop-blur-md sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Foro de la comunidad</h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Comparte, aprende y conecta con la comunidad universitaria
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Button onClick={onCreate} className="h-10 cursor-pointer gap-2 rounded-xl bg-blue-500 px-4 text-white hover:bg-blue-600">
            <Plus className="size-4" aria-hidden="true" /> Nueva publicación
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" className="h-10 gap-2 rounded-xl border-white/15 px-4" aria-label="Ordenar publicaciones">{sort === "votesCount,desc" ? "Popular" : "Recientes"} <ChevronDown className="size-4" /></Button>} />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setSort("createdAt,desc")}>Recientes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("votesCount,desc")}>Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="border-t border-white/10 pt-5">
        {loading ? <Skeleton className="h-24 w-full max-w-sm rounded-xl bg-white/10" /> : <CategorySearch
          compact tags={tags} selectedIds={selectedTag === null ? [] : [selectedTag]}
          onToggle={id => setSelectedTag(current => current === id ? null : id)}
          leadingAction={<button type="button" onClick={() => setSelectedTag(null)} aria-pressed={selectedTag === null}
            className={`min-h-9 rounded-full border px-4 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-blue-400 ${selectedTag === null ? "border-blue-400/70 bg-blue-500/20 text-blue-100" : "border-white/15 text-slate-300 hover:bg-white/5"}`}>
            Todos
          </button>} />}
      </div>
    </section>
  );
}
