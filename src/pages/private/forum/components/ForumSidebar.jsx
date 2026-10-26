import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, MapIcon } from "lucide-react";
import { Link } from "react-router-dom";
import apiFetch from "@/lib/apiClient";

const panel = "flex shrink-0 flex-col gap-3 rounded-3xl border border-white/10 bg-black/70 p-4 backdrop-blur-md";
function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";
}

export default function ForumSidebar({ fillHeight = false }) {
  const [ranking, setRanking] = useState({ creators: [], roadmaps: [], loading: true, error: false });
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      apiFetch.get("/roadmap/top-creators", { signal: controller.signal }),
      apiFetch.get("/roadmap/popular", { signal: controller.signal }),
    ]).then(([creators, roadmaps]) => {
      if (!controller.signal.aborted) setRanking({ creators: creators.data, roadmaps: roadmaps.data, loading: false, error: false });
    }).catch(() => {
      if (!controller.signal.aborted) setRanking({ creators: [], roadmaps: [], loading: false, error: true });
    });
    return () => controller.abort();
  }, [reload]);
  const status = ranking.loading ? <p role="status" className="text-sm text-muted-foreground">Cargando rankings…</p>
    : ranking.error ? <div role="alert" className="text-sm"><p>No se pudieron cargar los rankings.</p><button type="button" className="text-indigo-300" onClick={() => { setRanking(current => ({ ...current, loading: true, error: false })); setReload(value => value + 1); }}>Reintentar</button></div> : null;
  return (
    <aside className={fillHeight ? "flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto p-2" : "flex w-full flex-col gap-4"}>
      <section className={panel}>
        <h2 className="text-base font-bold sm:text-lg">Creadores más gustados</h2>
        <p className="text-xs text-muted-foreground">Me gusta recibidos en sus roadmaps públicos</p>
        {status}
        {ranking.creators.map(creator => <div key={creator.userId} className="flex min-w-0 items-center gap-3 rounded-xl bg-white/[0.03] p-2">
          <Avatar className="size-9 shrink-0"><AvatarFallback className="bg-indigo-500 text-white">{getInitials(creator.name)}</AvatarFallback></Avatar>
          <h3 className="min-w-0 flex-1 truncate text-sm font-bold">{creator.name}</h3>
          <span className="shrink-0 text-sm text-indigo-300">{creator.likesCount} me gusta</span>
        </div>)}
        {!ranking.loading && !ranking.error && !ranking.creators.length && <p className="text-sm text-muted-foreground">Aún no hay creadores con me gusta.</p>}
      </section>
      <section className={panel}>
        <h2 className="text-base font-bold sm:text-lg">Roadmaps populares</h2>
        {status}
        {ranking.roadmaps.map(roadmap => <Link key={roadmap.id} to={`/roadmap?roadmap=${roadmap.id}`} className="flex min-w-0 items-center gap-3 rounded-xl bg-white/[0.03] p-2 hover:bg-white/10">
          <MapIcon className="size-9 shrink-0 text-indigo-300" />
          <div className="min-w-0"><h3 className="truncate text-sm font-bold">{roadmap.title}</h3><p className="text-xs text-muted-foreground">{roadmap.likesCount} me gusta</p></div>
        </Link>)}
        {!ranking.loading && !ranking.error && !ranking.roadmaps.length && <p className="text-sm text-muted-foreground">Aún no hay roadmaps con me gusta.</p>}
        <Link to="/roadmap" className="flex items-center text-sm text-indigo-300">Ver todos los roadmaps <ChevronRight className="size-4" /></Link>
      </section>
    </aside>
  );
}
