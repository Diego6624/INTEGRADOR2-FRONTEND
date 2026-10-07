import { Skeleton } from "@/components/ui/skeleton";

function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

export default function NewChatDialog({
  open,
  users,
  search,
  loading,
  error,
  onSearchChange,
  onSelectUser,
  onClose,
}) {
  if (!open) return null;

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-labelledby="new-chat-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-chat-title" className="text-lg font-semibold text-white">Iniciar conversación</h2>
          <button type="button" onClick={onClose} className="text-sm text-slate-300 hover:text-white">Cerrar</button>
        </div>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar usuario..."
          aria-label="Buscar usuario"
          className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400"
        />
        {error && <p role="alert" className="mb-3 text-sm text-rose-200">{error}</p>}
        <div className="max-h-72 space-y-2 overflow-y-auto">
          {loading ? Array.from({ length: 5 }, (_, index) => (
            <div key={index} aria-hidden="true" className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
              <Skeleton className="size-9 rounded-lg bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5 bg-white/10" />
                <Skeleton className="h-3 w-3/5 bg-white/10" />
              </div>
            </div>
          )) : filteredUsers.length ? filteredUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => onSelectUser(user)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-3 text-left text-white transition hover:bg-white/5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold">{getInitials(user.name)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{user.name}</span>
                <span className="block truncate text-xs text-slate-400">{user.email}</span>
              </span>
            </button>
          )) : <p className="text-sm text-slate-300">No se encontraron usuarios.</p>}
        </div>
      </section>
    </div>
  );
}
