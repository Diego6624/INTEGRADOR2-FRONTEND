import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TypingIndicator from "./TypingIndicator";

function formatTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function MessageList({
  messages,
  currentUserId,
  activeName,
  typingUser,
  loading,
  conversationId,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversationId, typingUser]);

  if (loading) {
    return (
      <div aria-label="Cargando mensajes" aria-busy="true" className="flex-1 space-y-5 overflow-y-auto px-4 py-5 md:px-6">
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
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
      {messages.length ? messages.map((message) => {
        const isMine = message.user_id === currentUserId;
        const isAgent = message.isFromAgent || message.user_id == null;
        return (
          <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg"
              style={{
                background: isMine ? "linear-gradient(135deg, rgba(70,112,255,0.9), rgba(46,154,255,0.82))" : "rgba(146, 162, 204, 0.10)",
                border: isMine ? "1px solid rgba(163, 191, 255, 0.38)" : "1px solid rgba(255,255,255,0.08)",
                color: "#edf5ff",
              }}
            >
              <p>{message.content}</p>
              <div className="mt-1 flex items-center justify-between gap-4 text-[10px] text-sky-100/70">
                <span>{isMine ? "Tú" : isAgent ? "Agente IA" : activeName}</span>
                <time>{formatTime(message.createdAt)}</time>
              </div>
            </div>
          </div>
        );
      }) : (
        <p className="text-sm text-slate-300">Esta conversación aún no tiene mensajes. ¡Envía el primero!</p>
      )}
      <TypingIndicator userName={typingUser} />
      <div ref={bottomRef} />
    </div>
  );
}
