import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "@/components/ui/item";
import { ChevronDown, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForumHeader({ tags, selectedTag, setSelectedTag, sort, setSort, onCreate, loading }) {
  return (
    <Item variant="outline" className="border border-white/10 bg-black/70 backdrop-blur-md">
      <ItemContent>
        <ItemTitle className="text-xl font-semibold sm:text-2xl lg:text-3xl">Foro de la comunidad</ItemTitle>
        <ItemDescription className="text-sm sm:text-base lg:text-lg">
          Comparte, aprende y conecta con la comunidad universitaria
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" onClick={onCreate} className=" cursor-pointer rounded-3xl bg-blue-500" aria-label="Crear publicación">
          <Plus className="text-white" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">{sort === "votesCount,desc" ? "Popular" : "Recientes"} <ChevronDown /></Button>} />
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => setSort("createdAt,desc")}>Recientes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("votesCount,desc")}>Popular</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
      <ItemFooter className="flex flex-wrap gap-2 justify-start scroll-x-auto overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedTag(null)}
          className={`rounded-full border px-3 py-1 text-sm ${selectedTag === null ? "border-blue-400 bg-[#1C2D6E] text-white" : "border-white/10 bg-white/5 text-slate-200"}`}
        >
          Todos
        </button>
        {loading ? Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} aria-hidden="true" className="h-7 w-20 rounded-full bg-white/10" />
        )) : tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setSelectedTag((current) => current === tag.id ? null : tag.id)}
            className={`rounded-full border px-3 py-1 text-sm ${selectedTag === tag.id ? "border-blue-400 bg-[#1C2D6E] text-white" : "border-white/10 bg-white/5 text-slate-200"}`}
          >
            {tag.name}
          </button>
        ))}
      </ItemFooter>
    </Item>
  );
}
