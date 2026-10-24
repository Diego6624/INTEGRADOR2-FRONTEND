import { careerGroups, customAreas } from "./roadmap/careerOptions";
import { useSearchParams } from "react-router-dom";
import MarkdownContent from "@/components/MarkdownContent";
import GeneratedRoadmapPreview from "./roadmap/GeneratedRoadmapPreview";
import { parseGeneratedRoadmap, formatAgentReply } from "./roadmap/generatedRoadmap";
import { createRoadmapApi, fetchAllPages } from "./roadmap/roadmapApi";
import VocationalTestGate from "@/components/VocationalTestGate";
import useVocationalAccess from "@/hooks/useVocationalAccess";
import { useConversationSocket } from "@/hooks/useConversationSocket";
import apiFetch from "@/lib/apiClient";
import { useState, useRef, useEffect } from "react";
import { requireVocationalTest } from "@/lib/vocationalAccess";
import { errorMessage } from "./roadmap/roadmapApi";


function displayContent(content, fromAgent) {
  if (fromAgent) return formatAgentReply(content);
  if (content.startsWith('Genera un roadmap completo y concreto.')) {
    return 'Crear mi roadmap personalizado\n' + content.split('\n').slice(2).join('\n');
  }
  return content;
}

export default function AIAgent() {
  const vocationalAccess = useVocationalAccess();
  const [requestError, setRequestError] = useState("");
  const requestLock = useRef(false);
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(() => searchParams.get("mode") === "roadmap" ? "roadmap" : "consultar");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "¡Hola! Soy tu agente universitario. Puedo ayudarte a encontrar cursos, recomendarte profesores basándome en el foro, o ayudarte a planificar tu semestre. ¿En qué te ayudo hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [conversationId, setConversationId] = useState(null)
  const messagesRef = useRef(null);


  useEffect(() => {

    async function obtenerConversacionPorIa() {
      try {
        const response = await apiFetch.post("/conversation", {
          type: 'AI_AGENT'
        })

        setConversationId(response.data.id)
        const history = await fetchAllPages(`/message/conversation/${response.data.id}`, { params: { sort: 'id,asc' } }, apiFetch);
        if (history.length) setMessages(history.map(message => ({ id: message.id, role: message.isFromAgent ? 'ai' : 'user', text: displayContent(message.content, message.isFromAgent) })));
      } catch (err) {
        setRequestError("No se pudo iniciar la conversacion con el agente. Recarga la pagina.");
        console.error("No se pudo iniciar la conversación con el agente: ", err)
      }
    }

    obtenerConversacionPorIa()

  }, [])


  const [rmForm, setRmForm] = useState({
    career: "Ingeniería en Sistemas",
    semester: "5",
    goal: "empleo",
    hours: "10",
    areas: [],
  });
  const roadmapAreas = careerGroups.find(group => group.careers.includes(rmForm.career))?.areas ?? customAreas;
  const [generated, setGenerated] = useState(null);
  const [savingRoadmap, setSavingRoadmap] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const saveLock = useRef(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const container = messagesRef.current;
    if (mode === "consultar" && container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, thinking, mode]);

  async function submitMessage(content) {
    if (!content.trim() || !conversationId || requestLock.current) return false;
    requestLock.current = true;
    setRequestError("");
    setThinking(true);
    try {
      const { data: user } = await apiFetch.get("/me");
      await requireVocationalTest(apiFetch, user.id);
      const { data: sent } = await apiFetch.post("/message", { content, conversation_id: conversationId });
      const history = await fetchAllPages(`/message/conversation/${conversationId}`, { params: { sort: 'id,asc' } }, apiFetch);
      setMessages(history.map(message => ({ id: message.id, role: message.isFromAgent ? 'ai' : 'user', text: displayContent(message.content, message.isFromAgent) })));
      const reply = history.find(message => message.isFromAgent && Number(message.id) > Number(sent.id));
      return { reply };
    } catch (error) {
      setRequestError(errorMessage(error, "No se pudo contactar al agente. Intenta nuevamente."));
      return false;
    } finally {
      requestLock.current = false;
      setThinking(false);
    }
  }

  async function sendMessage() {
    const content = input.trim();
    if (await submitMessage(content)) setInput("");
  }

  useConversationSocket(conversationId, (newMessage) => {
    setMessages((prev) => prev.some(message => message.id === newMessage.id) ? prev : [...prev, {
      id: newMessage.id,
      role: newMessage.isFromAgent ? 'ai' : 'user',
      text: displayContent(newMessage.content, newMessage.isFromAgent)
    }])
    if (newMessage.isFromAgent) {
      setThinking(false)
    } else {
      setThinking(true)
    }
  })

  async function generateRM() {
    if (!vocationalAccess.allowed || !rmForm.career.trim() || !rmForm.areas.length || generating || !conversationId) return;
    setGenerating(true);
    try {
      const result = await submitMessage([
        'Genera un roadmap completo y concreto. Devuelve solo un objeto JSON valido, sin bloques de codigo: {"title":"Titulo", "description":"Resumen", "category":"Area", "steps":[{"title":"Nombre del paso", "description":"Objetivo, temas, duracion y recursos en Markdown"}],"connections":[{"source":0,"target":1}]}.',
        'Incluye conexiones usando indices de steps desde cero. Permite ramas y convergencias cuando tenga sentido y nunca ciclos ni conexiones repetidas. Incluye entre 4 y 7 pasos. title y category no deben exceder 255 caracteres. Si faltan detalles menores asume un nivel inicial y recursos gratuitos. No hagas preguntas en esta respuesta.',
        "Adapta las alternativas, recursos y oportunidades al contexto del Perú y a la carrera seleccionada.",
        `Carrera: ${rmForm.career}. Semestre: ${rmForm.semester}.`,
        `Objetivo: ${rmForm.goal}. Disponibilidad: ${rmForm.hours} horas por semana.`,
        `Areas de interes: ${rmForm.areas.join(", ")}.`,
        `Contexto adicional: ${rmForm.description || "Sin detalles adicionales"}.`,
      ].join("\n"));
      if (!result) return;
      if (!result.reply) throw new Error('No se recibió el roadmap del agente. Intenta nuevamente.');
      setGenerated(parseGeneratedRoadmap(result.reply.content, rmForm));
      setSavedId(null);
    } catch (error) {
      setRequestError(error.message || 'No se pudo generar el roadmap.');
    } finally {
      setGenerating(false);
    }
  }

  async function saveGenerated() {
    if (!generated || savedId || saveLock.current) return;
    saveLock.current = true;
    setSavingRoadmap(true);
    setRequestError("");
    try {
      const { data } = await createRoadmapApi(apiFetch).createGeneratedRoadmap(generated);
      setSavedId(data.id);
    } catch (error) {
      setRequestError(errorMessage(error, 'No se pudo guardar el roadmap. Puedes reintentar sin volver a generarlo.'));
    } finally {
      saveLock.current = false;
      setSavingRoadmap(false);
    }
  }

  function toggleArea(area) {
    setRmForm((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((item) => item !== area)
        : [...prev.areas, area],
    }));
  }

  return (
    <div
      className="h-[calc(100dvh-11rem)] min-h-80 flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      style={{
        background: "rgba(8, 12, 22, 0.56)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "#edf4ff",
      }}
    >
      {requestError && <p role="alert" className="max-h-24 flex-shrink-0 overflow-y-auto p-4 text-sm text-rose-200">{requestError}</p>}
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-xl font-bold"
              style={{
                fontFamily: "'Fraunces', serif",
                color: "#f5f8ff",
              }}
            >
              Agente IA Universitario
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(232, 239, 255, 0.82)" }}>
              Consulta recomendaciones o genera un roadmap personalizado.
            </p>
          </div>
          <div className="flex items-center rounded-xl p-1 w-fit" style={{ background: "rgba(13, 20, 33, 0.42)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { key: "consultar", label: "Consultar" },
              { key: "roadmap", label: "Crear Roadmap" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setMode(option.key)}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={
                  mode === option.key
                    ? {
                      background: "linear-gradient(135deg, #5a7cff, #4a69d8)",
                      color: "#ffffff",
                      boxShadow: "0 8px 18px rgba(90, 124, 255, 0.25)",
                    }
                    : {
                      color: "rgba(220, 230, 255, 0.82)",
                    }
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "consultar" && (
        <div className="min-h-0 flex-1 flex flex-col overflow-hidden">
          <div ref={messagesRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {msg.role === "ai" && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #7c6dff, #00e5b8)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "ai" ? "border" : "bg-primary text-white"
                    }`}
                  style={
                    msg.role === "ai"
                      ? {
                        background: "rgba(79, 95, 145, 0.34)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#f4f7ff",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
                      }
                      : {
                        background: "linear-gradient(135deg, #5c7efb, #4a6ee5)",
                        color: "#ffffff",
                      }
                  }
                >
                  {msg.role === 'ai' ? <MarkdownContent>{msg.text}</MarkdownContent>
                    : <p className="whitespace-pre-wrap">{msg.text}</p>}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c6dff, #00e5b8)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="bg-surface border border-dim rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((dotIndex) => (
                    <span
                      key={dotIndex}
                      className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce"
                      style={{ animationDelay: `${dotIndex * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 px-4 md:px-6 mb-2 flex gap-2 overflow-x-auto">
            {[
              "¿Qué cursos me recomiendas?",
              "¿Cómo están los profesores de Algoritmos?",
              // "Dame un roadmap para backend",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  submitMessage(suggestion);
                }}
                className="flex-shrink-0 rounded-xl px-3 py-1.5 text-xs transition-all"
                style={{
                  background: "rgba(91, 124, 255, 0.74)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#ffffff",
                  boxShadow: "0 6px 16px rgba(80, 106, 228, 0.18)",
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex-shrink-0 p-4 md:p-6 border-t border-white/10" style={{ background: "rgba(7, 12, 20, 0.18)" }}>
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                placeholder="Pregunta sobre cursos, profesores, horarios..."
                className="flex-1 rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
                style={{
                  background: "rgba(11, 18, 31, 0.44)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "#f5f8ff",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
                }}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || thinking || !conversationId}
                className="disabled:opacity-40 px-4 py-3 rounded-xl transition-all flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #5b7cff, #4b68d8)",
                  color: "#ffffff",
                  boxShadow: "0 8px 18px rgba(80, 107, 223, 0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "roadmap" && (
        <VocationalTestGate access={vocationalAccess} action="generar roadmaps"><div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">

            <div className="max-w-3xl mx-auto space-y-5">
              <div
                className="rounded-2xl p-6 md:p-7"
                style={{
                  background: "rgba(12, 18, 30, 0.52)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 20px 40px rgba(2, 8, 22, 0.35)",
                }}
              >
                <h2
                  className="text-base font-bold mb-5"
                  style={{ fontFamily: "'Fraunces', serif", color: "#f5f8ff" }}
                >
                  Configurar mi roadmap
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]" style={{ color: "rgba(224, 232, 255, 0.72)" }}>
                        Carrera
                      </label>
                      <select
                        aria-label="Carrera"
                        value={rmForm.career}
                        onChange={(event) => setRmForm(previous => ({ ...previous, career: event.target.value, areas: [] }))}
                        className="w-full rounded-xl px-3 py-2.5 text-sm transition-all"
                        style={{
                          background: "#172033",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#f2f7ff",
                        }}
                      >
                        {careerGroups.map(group => (
                          <optgroup key={group.group} label={group.group}>
                            {group.careers.map(career => (
                              <option key={career} value={career}>{career}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]" style={{ color: "rgba(224, 232, 255, 0.72)" }}>
                        Semestre actual
                      </label>
                      <select
                        value={rmForm.semester}
                        onChange={(event) => setRmForm({ ...rmForm, semester: event.target.value })}
                        className="w-full rounded-xl px-3 py-2.5 text-sm transition-all"
                        style={{
                          background: "rgba(86, 103, 146, 0.22)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#f2f7ff",
                        }}
                      >
                        {Array.from({ length: 12 }, (_, index) => (
                          <option key={index + 1} value={String(index + 1)} style={{ color: "#111827" }}>
                            {index + 1}° semestre
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]" style={{ color: "rgba(224, 232, 255, 0.72)" }}>
                        Objetivo principal
                      </label>
                      <select
                        value={rmForm.goal}
                        onChange={(event) => setRmForm({ ...rmForm, goal: event.target.value })}
                        className="w-full rounded-xl px-3 py-2.5 text-sm transition-all"
                        style={{
                          background: "rgba(86, 103, 146, 0.22)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#f2f7ff",
                        }}
                      >
                        <option value="empleo" style={{ color: "#111827" }}>Conseguir empleo</option>
                        <option value="maestria" style={{ color: "#111827" }}>Hacer maestría</option>
                        <option value="emprendimiento" style={{ color: "#111827" }}>Emprender</option>
                        <option value="investigacion" style={{ color: "#111827" }}>Investigación</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium mb-1.5 uppercase tracking-[0.18em]" style={{ color: "rgba(224, 232, 255, 0.72)" }}>
                        Horas / semana
                      </label>
                      <select
                        value={rmForm.hours}
                        onChange={(event) => setRmForm({ ...rmForm, hours: event.target.value })}
                        className="w-full rounded-xl px-3 py-2.5 text-sm transition-all"
                        style={{
                          background: "rgba(86, 103, 146, 0.22)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#f2f7ff",
                        }}
                      >
                        {["5", "10", "15", "20", "25+"].map((hours) => (
                          <option key={hours} value={hours} style={{ color: "#111827" }}>
                            {hours} horas
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-sm text-slate-200">Áreas de interés</legend>
                    <div className="flex flex-wrap gap-2">
                      {roadmapAreas.map(area => <label key={area} className="flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm">
                        <input type="checkbox" checked={rmForm.areas.includes(area)} onChange={() => toggleArea(area)} />
                        {area}
                      </label>)}
                    </div>
                  </fieldset>
                  <div>
                    <label className="block text-[10px] font-medium mb-2 uppercase tracking-[0.18em]" style={{ color: "rgba(224, 232, 255, 0.72)" }}>
                      Describe como quieres tu roadmap
                    </label>
                    <textarea
                      rows={6}
                      value={rmForm.description || ""}
                      onChange={(event) => setRmForm({ ...rmForm, description: event.target.value })}
                      placeholder="Quisiera que te enfoques en el backend..."
                      className="w-full rounded-xl px-3 py-3 text-sm transition-all resize-none"
                      style={{
                        background: "rgba(86, 103, 146, 0.22)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#f2f7ff",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={generateRM}
                  disabled={rmForm.areas.length < 1 || !rmForm.career.trim() || generating || thinking || savingRoadmap || !conversationId}
                  className="w-full mt-5 rounded-xl text-sm font-semibold py-3 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #58a7ff, #4a7ae7)",
                    color: "#ffffff",
                    boxShadow: "0 10px 24px rgba(74, 122, 231, 0.35)",
                    opacity: rmForm.areas.length < 1 || generating ? 0.55 : 1,
                  }}
                >
                  {generating ? "Generando tu roadmap con IA..." : "Generar roadmap personalizado →"}
                </button>
              </div>
            </div>
          {generated && <GeneratedRoadmapPreview key={JSON.stringify(generated)} roadmap={generated}
            saving={savingRoadmap} savedId={savedId} onSave={saveGenerated}
            onRegenerate={() => { setGenerated(null); setSavedId(null); setRequestError(""); }} />}
        </div></VocationalTestGate>
      )}
    </div>
  );
}
