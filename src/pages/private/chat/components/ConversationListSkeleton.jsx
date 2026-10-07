import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationListSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
          <Skeleton className="size-11 shrink-0 rounded-xl bg-white/10" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/5 bg-white/10" />
            <Skeleton className="h-3 w-2/5 bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
