import { ArrowLeft, Send } from "lucide-react";
import MessageList from "./MessageList";
import ConversationSkeleton from "./ConversationSkeleton";

function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

export default function ConversationPanel({
  conversationId,
  conversationsLoading,
  conversationType,
  activeName,
  currentUserId,
  messages,
  typingUser,
  loadingMessages,
  actionError,
  draft,
  sending,
  onBack,
  onDraftChange,
  onStopTyping,
  onSend,
}) {
  if (!conversationId && conversationsLoading) return <ConversationSkeleton />;

  if (!conversationId) {
    return (
      <section className="hidden h-full min-h-0 flex-col md:flex">
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-300">
          Selecciona una conversación o inicia un chat nuevo.
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-5" style={{ background: "rgba(9, 13, 22, 0.26)" }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Volver a conversaciones"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400 text-xs font-bold text-white">
            {getInitials(activeName)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{activeName}</h3>
            <p className="text-xs text-sky-100/80">{conversationType === "AI_AGENT" ? "Agente de Journet" : "Conversación directa"}</p>
          </div>
        </div>
      </header>

      {actionError && <p role="alert" className="px-5 pt-3 text-sm text-rose-200">{actionError}</p>}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        activeName={activeName}
        typingUser={typingUser}
        loading={loadingMessages}
        conversationId={conversationId}
      />

      <form onSubmit={onSend} className="border-t border-white/10 p-4 md:p-5" style={{ background: "rgba(7, 11, 18, 0.34)" }}>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3 backdrop-blur-xl" style={{ background: "rgba(9, 14, 22, 0.7)" }}>
          <input
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onBlur={onStopTyping}
            placeholder="Escribe tu mensaje..."
            aria-label="Escribe tu mensaje"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #4162ff, #2ca3ff)" }}
          >
            <Send className="h-4 w-4" /> {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </section>
  );
}
