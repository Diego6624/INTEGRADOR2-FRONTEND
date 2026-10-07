import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationSkeleton() {
  return (
    <section aria-label="Cargando conversación" aria-busy="true" className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-white/10 px-4 py-4 md:px-5">
        <Skeleton className="size-10 rounded-xl bg-white/10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-3 w-24 bg-white/10" />
        </div>
      </header>
      <div className="flex-1 space-y-5 overflow-hidden px-4 py-5 md:px-6">
        <div className="flex justify-start">
          <div className="w-2/3 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Skeleton className="h-3 w-full bg-white/10" />
            <Skeleton className="h-3 w-4/5 bg-white/10" />
            <Skeleton className="h-2 w-12 bg-white/10" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-1/2 space-y-2 rounded-2xl border border-white/10 bg-blue-500/10 p-4">
            <Skeleton className="h-3 w-full bg-white/10" />
            <Skeleton className="h-2 w-12 bg-white/10" />
          </div>
        </div>
        <div className="flex justify-start">
          <div className="w-3/5 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Skeleton className="h-3 w-full bg-white/10" />
            <Skeleton className="h-3 w-2/3 bg-white/10" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 p-4 md:p-5">
        <Skeleton className="h-12 w-full rounded-2xl bg-white/10" />
      </div>
    </section>
  );
}
