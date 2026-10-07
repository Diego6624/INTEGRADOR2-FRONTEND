import { Item, ItemContent, ItemMedia } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForumPostSkeleton() {
  return (
    <Item aria-hidden="true" className="items-start border border-white/10 bg-black/70 p-4">
      <ItemMedia className="pt-1">
        <Skeleton className="size-8 rounded-full bg-white/10" />
      </ItemMedia>
      <ItemContent className="gap-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
        </div>
        <Skeleton className="h-5 w-4/5 bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full bg-white/10" />
          <Skeleton className="h-3.5 w-11/12 bg-white/10" />
          <Skeleton className="h-3.5 w-3/5 bg-white/10" />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="size-9 rounded-full bg-white/10" />
          <Skeleton className="h-3.5 w-28 bg-white/10" />
          <Skeleton className="h-3.5 w-24 bg-white/10" />
        </div>
      </ItemContent>
    </Item>
  );
}
