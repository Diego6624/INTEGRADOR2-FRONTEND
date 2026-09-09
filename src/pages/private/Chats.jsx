import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

const contacts = [
  { id: 1, name: "Pedro Suárez", role: "Ing. de sistemas", avatar: "PS", status: "online", lastSeen: "En línea" },
  { id: 2, name: "Carlos Ramos", role: "Ing. de sistemas", avatar: "CR", status: "busy", lastSeen: "Hace 10 min" },
  { id: 3, name: "Equipo de soporte", role: "Atención", avatar: "SO", status: "online", lastSeen: "Responde rápido" },
];

const initialMessages = {
  1: [
    { role: "ai", text: "¡Hola! ¿Quieres revisar tu plan de estudios para este ciclo?" },
    { role: "user", text: "Sí, necesito ideas para organizar mejor mi tiempo." },
    { role: "ai", text: "Perfecto. Te recomiendo priorizar materias con más carga y dejar 2 horas semanales para proyectos." },
  ],
  2: [
    { role: "ai", text: "Revisé tu roadmap y te sugerí reforzar lógica algorítmica." },
    { role: "user", text: "Gracias, ¿qué recursos me recomiendas?" },
    { role: "ai", text: "Puedes empezar con Coursera, freeCodeCamp y una práctica semanal con ejercicios." },
  ],
  3: [
    { role: "ai", text: "¿En qué te puedo ayudar hoy?" },
    { role: "user", text: "Necesito ayuda con acceso al portal y mi perfil." },
    { role: "ai", text: "Claro, te ayudo a verificar tu cuenta y permisos de acceso." },
  ],
};

const aiReplies = [
  "Te puedo ayudar con eso. Revisemos tus prioridades y te propongo un plan claro.",
  "Según tu contexto académico, lo ideal es enfocarte en las materias de mayor peso y mantener rutinas pequeñas cada semana.",
  "He revisado tu progreso. Te recomiendo avanzar con un bloque de estudio de 45 minutos y descansar 10 minutos entre tareas.",
  "Si quieres, puedo ayudarte a armar un plan más personalizado según tu carrera y semestre.",
];

export default function ChatsPage() {
  const [selectedContact, setSelectedContact] = useState(1);
  const [showChat, setShowChat] = useState(false); // mobile: false = lista, true = chat
  const [draft, setDraft] = useState("");
  const [messagesByContact, setMessagesByContact] = useState(initialMessages);
  const bottomRef = useRef(null);

  const activeContact = contacts.find((c) => c.id === selectedContact) ?? contacts[0];
  const activeMessages = messagesByContact[selectedContact] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact, activeMessages]);

  const handleSelectContact = (id) => {
    setSelectedContact(id);
    setShowChat(true); // en mobile, al seleccionar abre el chat
  };

  const sendMessage = () => {
    const value = draft.trim();
    if (!value) return;
    setMessagesByContact((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] ?? []), { role: "user", text: value }],
    }));
    setDraft("");
    window.setTimeout(() => {
      setMessagesByContact((prev) => ({
        ...prev,
        [selectedContact]: [
          ...(prev[selectedContact] ?? []),
          { role: "ai", text: aiReplies[Math.floor(Math.random() * aiReplies.length)] },
        ],
      }));
    }, 700);
  };

  return (
    <div
      className="relative h-[74vh] w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_25px_80px_rgba(3,8,18,0.76)]"
      style={{
        background: "rgba(6, 10, 18, 0.74)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 0%, rgba(80, 122, 255, 0.12), transparent 28%), radial-gradient(circle at 100% 100%, rgba(51, 172, 255, 0.08), transparent 26%)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full md:grid md:grid-cols-[290px_minmax(0,1fr)]">

        {/* ========================= */}
        {/* SIDEBAR — Lista contactos */}
        {/* ========================= */}
        <aside
          className={`
                        ${showChat ? "hidden" : "flex"} flex-col
                        md:flex
                        border-b border-white/10 p-4 md:border-b-0 md:border-r md:p-5 h-full
                    `}
          style={{ background: "rgba(9, 13, 22, 0.38)" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Chats</h2>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-sky-100 transition hover:bg-white/10"
            >
              Nuevo
            </button>
          </div>

          <div className="space-y-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => handleSelectContact(contact.id)}
                className="flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200"
                style={{
                  background: selectedContact === contact.id
                    ? "linear-gradient(135deg, rgba(76, 110, 255, 0.18), rgba(12, 18, 28, 0.7))"
                    : "rgba(10, 15, 24, 0.26)",
                  borderColor: selectedContact === contact.id
                    ? "rgba(124, 156, 255, 0.38)"
                    : "rgba(255,255,255,0.07)",
                  boxShadow: selectedContact === contact.id
                    ? "0 12px 26px rgba(34, 53, 95, 0.2)"
                    : "none",
                }}
              >
                <div className="relative">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #5b7cff, #2ec5ff)" }}
                  >
                    {contact.avatar}
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950"
                    style={{
                      background: contact.status === "online" ? "#3ade7a"
                        : contact.status === "busy" ? "#ffb454" : "#7b8bb0",
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">{contact.name}</p>
                    <span className="text-[10px] text-slate-300">9:41</span>
                  </div>
                  <p className="truncate text-xs text-slate-300">{contact.role}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ========================= */}
        {/* MAIN — Chat activo        */}
        {/* ========================= */}
        <section
          className={`
        ${showChat ? "flex" : "hidden"} flex-col min-h-0 h-full
        md:flex
    `}
        >
          {/* Header del chat */}
          <header
            className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-5"
            style={{ background: "rgba(9, 13, 22, 0.26)" }}
          >
            <div className="flex items-center gap-3">
              {/* Botón volver — solo mobile */}
              <button
                type="button"
                onClick={() => setShowChat(false)}
                className="md:hidden rounded-full p-1.5 text-white hover:bg-white/10 transition-colors"
                aria-label="Volver a contactos"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, #5b7cff, #2ec5ff)" }}
              >
                {activeContact.avatar}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{activeContact.name}</h3>
                <p className="text-xs text-sky-100/80">{activeContact.lastSeen}</p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-sky-100 transition hover:bg-white/10"
            >
              Ver perfil
            </button>
          </header>

          {/* Mensajes */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            {activeMessages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg"
                  style={{
                    background: msg.role === "user"
                      ? "linear-gradient(135deg, rgba(70,112,255,0.9), rgba(46,154,255,0.82))"
                      : "rgba(146, 162, 204, 0.10)",
                    border: msg.role === "user"
                      ? "1px solid rgba(163, 191, 255, 0.38)"
                      : "1px solid rgba(255,255,255,0.08)",
                    color: msg.role === "user" ? "#f5f9ff" : "#edf5ff",
                    boxShadow: msg.role === "user"
                      ? "0 18px 28px rgba(49, 86, 199, 0.24)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.02)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="border-t border-white/10 p-4 md:p-5"
            style={{ background: "rgba(7, 11, 18, 0.34)" }}
          >
            <div
              className="flex items-center gap-3 rounded-2xl border border-white/10 px-3 py-3 backdrop-blur-xl"
              style={{ background: "rgba(9, 14, 22, 0.7)" }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #4162ff, #2ca3ff)" }}
              >
                Enviar
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}