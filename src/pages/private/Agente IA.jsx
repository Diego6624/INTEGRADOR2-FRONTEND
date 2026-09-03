import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const mockResponses = {
  default:
    "Basándome en la información del foro y la comunidad de Journet, te puedo dar una recomendación personalizada. ¿Puedes contarme más sobre tu contexto específico? Por ejemplo: ¿en qué semestre estás, cuál es tu carrera y qué área te interesa desarrollar?",
  curso:
    "Para cursos online en 2026, las mejores opciones según nuestra comunidad son:\n\n🏆 **Top recomendados:**\n• Platzi - Contenido en español de alta calidad, especialmente para desarrollo web y data science\n• Coursera (con auditoría gratuita) - Cursos de universidades top como Stanford y MIT\n• freeCodeCamp - Completamente gratuito, excelente para desarrollo web\n• The Odin Project - Full-stack, enfocado en práctica real\n\n¿Tienes alguna área específica en mente?",
  profesor:
    "Según las reseñas de la comunidad para tu carrera:\n\n⭐ **Profesores más valorados en el foro:**\n• Para Algoritmos: Prof. Martínez (97% recomendación)\n• Para Bases de Datos: Prof. González (94% recomendación)\n• Para Redes: Prof. López (91% recomendación)\n\nEstos datos se basan en comentarios reales de estudiantes de semestres anteriores. ¿Quieres más detalles sobre algún área?",
  roadmap:
    "¡Excelente! Puedo ayudarte a crear un roadmap personalizado. Para hacerlo necesito saber:\n\n1. ¿Tu carrera y semestre actual?\n2. ¿Cuál es tu objetivo principal (empleo, maestría, emprendimiento)?\n3. ¿Cuánto tiempo semanal puedes dedicar?\n\nCon esa info genero un roadmap detallado con recursos específicos para ti.",
};

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes("curso") || lower.includes("plataforma") || lower.includes("aprender"))
    return mockResponses.curso;
  if (lower.includes("profesor") || lower.includes("docente") || lower.includes("materia"))
    return mockResponses.profesor;
  if (lower.includes("roadmap") || lower.includes("ruta") || lower.includes("plan"))
    return mockResponses.roadmap;
  return mockResponses.default;
}

const roadmapAreas = [
  "Desarrollo Frontend",
  "Desarrollo Backend",
  "Machine Learning / IA",
  "DevOps / Cloud",
  "Bases de Datos",
  "Seguridad Informática",
  "Mobile Development",
  "Data Science",
];

function generateRoadmap(career, goal, areas) {
  return [
    {
      phase: "Fase 1 · Fundamentos (Meses 1-2)",
      items: [
        { name: "Bases de " + (career || "tu carrera"), type: "teoría" },
        { name: "Lógica y pensamiento computacional", type: "práctica" },
        { name: "Git y control de versiones", type: "herramienta" },
      ],
    },
    {
      phase: "Fase 2 · Núcleo técnico (Meses 3-5)",
      items: areas
        .slice(0, 2)
        .map((area) => ({
          name: area,
          type: "especialización",
        }))
        .concat([{ name: "Proyecto integrador pequeño", type: "proyecto" }]),
    },
    {
      phase: "Fase 3 · Profundización (Meses 6-8)",
      items: [
        { name: areas[2] || "Área avanzada de tu elección", type: "especialización" },
        { name: "Contribuir a open source", type: "práctica" },
        {
          name: goal === "empleo" ? "Preparación de CV y portfolio" : "Preparación para postgrado",
          type: "meta",
        },
      ],
    },
    {
      phase: "Fase 4 · Consolidación (" + (goal === "empleo" ? "Meses 9-12" : "Mes 9+") + ")",
      items: [
        { name: "Proyecto final de portfolio", type: "proyecto" },
        {
          name: goal === "empleo" ? "Entrevistas técnicas y networking" : "Aplicación a programas académicos",
          type: "meta",
        },
        { name: "Comunidad y mentorías activas", type: "soft skill" },
      ],
    },
  ];
}

const typeColors = {
  teoría: "#7c6dff",
  práctica: "#00e5b8",
  herramienta: "#f0a500",
  especialización: "#7c6dff",
  proyecto: "#ff5f6d",
  meta: "#00e5b8",
  "soft skill": "#b8b5d0",
};

export default function AIAgent() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("consultar");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "¡Hola, Sebastián! Soy tu agente universitario. Puedo ayudarte a encontrar cursos, recomendarte profesores basándome en el foro, o ayudarte a planificar tu semestre. ¿En qué te ayudo hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  const [rmForm, setRmForm] = useState({
    career: "Ingeniería en Sistemas",
    semester: "5",
    goal: "empleo",
    hours: "10",
    areas: [],
  });
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [...prev, { role: "ai", text: getAIResponse(userMsg) }]);
    }, 1200 + Math.random() * 600);
  }

  function generateRM() {
    if (rmForm.areas.length === 0) return;
    setGenerating(true);
    setTimeout(() => {
      setGeneratedRoadmap(generateRoadmap(rmForm.career, rmForm.goal, rmForm.areas));
      setGenerating(false);
    }, 1500);
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
      className="h-full flex flex-col rounded-2xl border border-white/10 shadow-2xl"
      style={{
        background: "rgba(8, 12, 22, 0.56)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: "#edf4ff",
      }}
    >
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
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
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
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "ai" ? "border" : "bg-primary text-white"
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
                  {msg.text.split("\n").map((line, lineIndex) => (
                    <p key={lineIndex} className={line === "" ? "mt-2" : ""}>
                      {line.startsWith("🏆") || line.startsWith("⭐") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") ? (
                        <span style={{ color: "#f6f9ff" }}>{line}</span>
                      ) : line.startsWith("•") ? (
                        <span className="block pl-2" style={{ color: "#f6f9ff" }}>{line}</span>
                      ) : line.startsWith("**") && line.endsWith("**") ? (
                        <strong className="font-semibold" style={{ color: "#ffffff" }}>{line.replace(/\*\*/g, "")}</strong>
                      ) : (
                        <span style={{ color: "#f2f6ff" }}>{line}</span>
                      )}
                    </p>
                  ))}
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
            <div ref={bottomRef} />
          </div>

          <div className="px-4 md:px-6 mb-2 flex gap-2 overflow-x-auto">
            {[
              "¿Qué cursos me recomiendas?",
              "¿Cómo están los profesores de Algoritmos?",
              "Dame un roadmap para backend",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setInput(suggestion);
                  setTimeout(sendMessage, 50);
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
                disabled={!input.trim() || thinking}
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
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!generatedRoadmap ? (
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
                      <input
                        type="text"
                        value={rmForm.career}
                        onChange={(event) => setRmForm({ ...rmForm, career: event.target.value })}
                        className="w-full rounded-xl px-3 py-2.5 text-sm transition-all"
                        style={{
                          background: "rgba(86, 103, 146, 0.22)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#f2f7ff",
                        }}
                      />
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
                  disabled={rmForm.areas.length < 1 || generating}
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
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-ink" style={{ fontFamily: "'Fraunces', serif" }}>
                    Tu roadmap: {rmForm.career}
                  </h2>
                  <p className="text-soft text-xs mt-0.5">
                    Generado para {rmForm.hours}h/semana · Objetivo: {rmForm.goal}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedRoadmap(null);
                      setSaved(false);
                    }}
                    className="border border-dim hover:border-primary/40 text-muted hover:text-ink px-3 py-2 rounded-xl text-xs transition-all"
                  >
                    Regenerar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSaved(true);
                      setTimeout(() => navigate("/roadmap"), 800);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      saved
                        ? "bg-accent/10 border border-accent/30 text-accent"
                        : "bg-primary hover:bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/25"
                    }`}
                  >
                    {saved ? "✓ Guardado" : "Guardar roadmap"}
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-5 top-6 bottom-6 w-px bg-dim" />
                <div className="space-y-5">
                  {generatedRoadmap.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="relative pl-12">
                      <div
                        className="absolute left-3 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold"
                        style={{
                          borderColor: "#7c6dff",
                          background: "#080d1a",
                          color: "#7c6dff",
                        }}
                      >
                        {phaseIndex + 1}
                      </div>
                      <div className="bg-surface border border-dim rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-ink mb-3">{phase.phase}</h3>
                        <div className="space-y-2">
                          {phase.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center gap-3 py-2 px-3 bg-raised rounded-xl border border-dim"
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: typeColors[item.type] || "#7b8ab0" }}
                              />
                              <span className="text-sm text-soft flex-1">{item.name}</span>
                              <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                  color: typeColors[item.type] || "#7b8ab0",
                                  background: (typeColors[item.type] || "#7b8ab0") + "15",
                                }}
                              >
                                {item.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
