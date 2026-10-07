import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, MapIcon } from "lucide-react";
import { Link } from "react-router-dom";

const MENTORS = [
  { name: "Ana Lucía Vargas", career: "Ing. Sistemas", points: 874 },
  { name: "Carlos Mendoza", career: "Economía", points: 723 },
  { name: "Sofía Bermúdez", career: "Medicina", points: 612 },
  { name: "Diego Amaya", career: "Derecho", points: 589 },
  { name: "Valeria Torres", career: "Psicología", points: 445 },
];

const POPULAR_ROADMAPS = [
  { name: "Full-Stack para Ing. Sistemas", followers: "1.2K seguidores" },
  { name: "Medicina: Años preclínicos", followers: "987 seguidores" },
  { name: "Emprendimiento universitario", followers: "756 seguidores" },
];

function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

function MentorPanel() {
  return (
    <section className="flex shrink-0 flex-col gap-3 rounded-3xl border border-white/10 bg-black/70 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 sm:gap-8">
        <h2 className="text-base font-bold sm:text-lg">Top mentores</h2>
        <span className="text-sm sm:text-base">Puntos</span>
      </div>
      <div className="flex flex-col gap-2">
        {MENTORS.map((mentor) => (
          <div key={mentor.name} className="flex min-w-0 items-center gap-3 rounded-xl bg-white/[0.03] p-2">
            <Avatar className="size-8 shrink-0 bg-indigo-500 text-white sm:size-10">
              <AvatarFallback className="bg-indigo-500 text-white">{getInitials(mentor.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold sm:text-md">{mentor.name}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{mentor.career}</p>
            </div>
            <span className="shrink-0 text-sm text-[#7C6DFF] sm:text-base">{mentor.points}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PopularRoadmapsPanel() {
  return (
    <section className="flex shrink-0 flex-col gap-3 rounded-3xl border border-white/10 bg-black/70 p-4 backdrop-blur-md">
      <h2 className="text-base font-bold sm:text-lg">Roadmaps Populares</h2>
      <div className="flex flex-col gap-2">
        {POPULAR_ROADMAPS.map((roadmap) => (
          <div key={roadmap.name} className="flex min-w-0 items-center gap-3 rounded-xl bg-white/[0.03] p-2">
            <div className="shrink-0 rounded-xl bg-[#1A2540] p-2">
              <MapIcon className="size-8 sm:size-10" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold sm:text-md">{roadmap.name}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{roadmap.followers}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-2">
        <hr className="mb-3 w-full border-white/10" />
        <Link to="/roadmap" className="flex flex-row items-center text-sm text-[#7C6DFF] sm:text-base">
          Ver todos los roadmaps <ChevronRight className="size-4 sm:size-5" />
        </Link>
      </div>
    </section>
  );
}

export default function ForumSidebar({ fillHeight = false }) {
  return (
    <aside className={fillHeight
      ? "flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto p-2"
      : "flex w-full flex-col gap-4"
    }>
      <MentorPanel />
      <PopularRoadmapsPanel />
    </aside>
  );
}
