import { Plus } from "lucide-react";
import ConversationListSkeleton from "./ConversationListSkeleton";

function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

function getConversationName(conversation, currentUserId) {
  if (conversation.type === "AI_AGENT") return "Agente IA";
  return conversation.participants?.find((participant) => participant.id !== currentUserId)?.name
    || conversation.otherUser?.name
    || `Conversación #${conversation.id}`;
}

export default function ChatSidebar({
  conversations,
  currentUserId,
  selectedId,
  unreadCounts,
  loading,
  error,
  onSelect,
  onNewChat,
  onRetry,
}) {
  return (
    <aside
      className={`${selectedId ? "hidden" : "flex"} h-full flex-col border-b border-white/10 p-4 md:flex md:border-b-0 md:border-r md:p-5`}
      style={{ background: "rgba(9, 13, 22, 0.38)" }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Chats</h2>
        <button
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-100 transition hover:bg-white/10"
        >
          <Plus className="h-4 w-4" /> Nuevo
        </button>
      </div>

      {loading ? (
        <ConversationListSkeleton />
      ) : error ? (
        <div className="space-y-3 text-sm text-rose-200">
          <p>{error}</p>
          <button type="button" onClick={onRetry} className="underline">Reintentar</button>
        </div>
      ) : conversations.length ? (
        <div className="space-y-2 overflow-y-auto">
          {conversations.map((conversation) => {
            const name = getConversationName(conversation, currentUserId);
            const unreadCount = unreadCounts[conversation.id] ?? 0;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                className="flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all"
                style={{
                  background: selectedId === conversation.id
                    ? "linear-gradient(135deg, rgba(76, 110, 255, 0.18), rgba(12, 18, 28, 0.7))"
                    : "rgba(10, 15, 24, 0.26)",
                  borderColor: selectedId === conversation.id ? "rgba(124, 156, 255, 0.38)" : "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-xs font-bold text-white">
                  {getInitials(name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{name}</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-slate-300">
                      {conversation.type === "AI_AGENT" ? "Asistente" : "Mensaje directo"}
                    </p>
                    {unreadCount > 0 && (
                      <span
                        aria-label={`${unreadCount} ${unreadCount === 1 ? "mensaje no leído" : "mensajes no leídos"}`}
                        className="shrink-0 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white"
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Aún no tienes conversaciones.</p>
          <button type="button" onClick={onNewChat} className="text-sky-200 underline">Iniciar un chat</button>
        </div>
      )}
    </aside>
  );
}
