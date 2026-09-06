import { useState } from 'react'
import { ChevronLeft, ClipboardCheck, Clock3, ListChecks } from 'lucide-react'
import BarraProgreso from './components/BarraProgreso'
import PreguntaCard from './components/PreguntaCard'
import ResultadoTest from './components/ResultadoTest'

const AREAS = {
  ciencias: {
    nombre: 'Ciencias e Investigación',
    descripcion:
      'Te motiva entender cómo funcionan las cosas, resolver problemas con lógica y método, y explorar preguntas complejas.',
    carreras: ['Biología', 'Física', 'Química', 'Matemáticas', 'Medicina'],
  },
  tecnologia: {
    nombre: 'Tecnología e Ingeniería',
    descripcion:
      'Disfrutas construir, programar y diseñar soluciones prácticas. Te atraen los sistemas, la lógica y la innovación.',
    carreras: [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Ciencia de Datos',
      'Ingeniería Civil',
      'Ciberseguridad',
    ],
  },
  artes: {
    nombre: 'Artes y Diseño',
    descripcion:
      'Tienes una fuerte sensibilidad estética y disfrutas crear, expresar ideas y comunicar visualmente.',
    carreras: [
      'Diseño Gráfico',
      'Arquitectura',
      'Artes Visuales',
      'Diseño de Producto',
      'Cine y Audiovisual',
    ],
  },
  salud: {
    nombre: 'Salud y Bienestar',
    descripcion:
      'Te importa el cuidado de las personas y sientes vocación por ayudar, sanar y mejorar la calidad de vida de otros.',
    carreras: ['Enfermería', 'Psicología', 'Nutrición', 'Odontología', 'Terapia Física'],
  },
  negocios: {
    nombre: 'Negocios y Liderazgo',
    descripcion:
      'Tienes visión estratégica, te gusta organizar equipos, tomar decisiones y hacer crecer proyectos.',
    carreras: [
      'Administración de Empresas',
      'Marketing',
      'Economía',
      'Comercio Internacional',
      'Contabilidad',
    ],
  },
  humanidades: {
    nombre: 'Humanidades y Comunicación',
    descripcion:
      'Te interesan las personas, la cultura y las ideas. Disfrutas leer, escribir, debatir y entender distintas perspectivas.',
    carreras: [
      'Derecho',
      'Periodismo',
      'Ciencias Políticas',
      'Educación',
      'Comunicación Social',
    ],
  },
}

const PREGUNTAS = [
  {
    id: 1,
    texto: '¿Qué actividad disfrutas más en tu tiempo libre?',
    opciones: [
      { texto: 'Leer sobre descubrimientos científicos', area: 'ciencias' },
      { texto: 'Armar o programar algo desde cero', area: 'tecnologia' },
      { texto: 'Dibujar, pintar o diseñar', area: 'artes' },
      { texto: 'Escuchar y ayudar a un amigo con un problema', area: 'salud' },
    ],
  },
  {
    id: 2,
    texto: 'En un trabajo en equipo, normalmente terminas siendo...',
    opciones: [
      { texto: 'El que organiza y reparte tareas', area: 'negocios' },
      { texto: 'El que investiga y verifica los datos', area: 'ciencias' },
      { texto: 'El que propone ideas creativas', area: 'artes' },
      { texto: 'El que redacta o presenta el resultado', area: 'humanidades' },
    ],
  },
  {
    id: 3,
    texto: '¿Qué tipo de problema te resulta más interesante resolver?',
    opciones: [
      { texto: 'Un experimento que no da los resultados esperados', area: 'ciencias' },
      { texto: 'Un sistema o app que no funciona bien', area: 'tecnologia' },
      { texto: 'Un conflicto entre personas', area: 'humanidades' },
      { texto: 'Cómo hacer crecer un negocio', area: 'negocios' },
    ],
  },
  {
    id: 4,
    texto: '¿Qué materia del colegio disfrutabas (o disfrutas) más?',
    opciones: [
      { texto: 'Biología o Química', area: 'ciencias' },
      { texto: 'Arte o Educación Visual', area: 'artes' },
      { texto: 'Matemáticas aplicadas a tecnología', area: 'tecnologia' },
      { texto: 'Historia, Filosofía o Literatura', area: 'humanidades' },
    ],
  },
  {
    id: 5,
    texto: '¿Cómo prefieres pasar un fin de semana productivo?',
    opciones: [
      { texto: 'Haciendo voluntariado o ayudando a alguien', area: 'salud' },
      { texto: 'Armando un plan de negocio o proyecto', area: 'negocios' },
      { texto: 'Explorando una nueva herramienta o app', area: 'tecnologia' },
      { texto: 'Visitando una exposición o museo', area: 'artes' },
    ],
  },
  {
    id: 6,
    texto: '¿Qué te describe mejor?',
    opciones: [
      { texto: 'Curioso, me gusta entender el "por qué" de todo', area: 'ciencias' },
      { texto: 'Empático, me afecta lo que le pasa a otros', area: 'salud' },
      { texto: 'Persuasivo, me gusta convencer y negociar', area: 'negocios' },
      { texto: 'Expresivo, necesito crear para sentirme bien', area: 'artes' },
    ],
  },
  {
    id: 7,
    texto: 'Si tuvieras que dar una charla, ¿sobre qué tema sería?',
    opciones: [
      { texto: 'Un avance tecnológico reciente', area: 'tecnologia' },
      { texto: 'Un tema social o político actual', area: 'humanidades' },
      { texto: 'Cómo emprender un negocio propio', area: 'negocios' },
      { texto: 'La importancia de la salud mental', area: 'salud' },
    ],
  },
  {
    id: 8,
    texto: '¿Qué logro te haría sentir más orgulloso?',
    opciones: [
      { texto: 'Publicar una investigación', area: 'ciencias' },
      { texto: 'Crear una app o sistema usado por muchos', area: 'tecnologia' },
      { texto: 'Que tu diseño sea reconocido públicamente', area: 'artes' },
      { texto: 'Ver que tu negocio crece cada año', area: 'negocios' },
    ],
  },
  {
    id: 9,
    texto: '¿Qué rol tomarías en un proyecto de ayuda comunitaria?',
    opciones: [
      { texto: 'Atender directamente a las personas', area: 'salud' },
      { texto: 'Escribir y difundir el mensaje del proyecto', area: 'humanidades' },
      { texto: 'Diseñar el material visual de campaña', area: 'artes' },
      { texto: 'Gestionar los recursos y el presupuesto', area: 'negocios' },
    ],
  },
  {
    id: 10,
    texto: '¿Qué frase te representa mejor?',
    opciones: [
      { texto: '"Todo tiene una explicación lógica"', area: 'ciencias' },
      { texto: '"Construyo soluciones con lo que tengo"', area: 'tecnologia' },
      { texto: '"Las palabras y las ideas mueven el mundo"', area: 'humanidades' },
      { texto: '"Cuidar de otros me da propósito"', area: 'salud' },
    ],
  },
]

export default function Test() {
  const [iniciado, setIniciado] = useState(false)
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [finalizado, setFinalizado] = useState(false)

  const preguntaActual = PREGUNTAS[indicePregunta]
  const esUltimaPregunta = indicePregunta === PREGUNTAS.length - 1
  const respuestaSeleccionada = respuestas[preguntaActual?.id]?.indiceOpcion ?? null

  function manejarSeleccion(indiceOpcion, area) {
    setRespuestas((previas) => ({
      ...previas,
      [preguntaActual.id]: { indiceOpcion, area },
    }))
  }

  function irSiguiente() {
    if (esUltimaPregunta) {
      setFinalizado(true)
      return
    }
    setIndicePregunta((previo) => previo + 1)
  }

  function irAnterior() {
    if (indicePregunta === 0) return
    setIndicePregunta((previo) => previo - 1)
  }

  function reiniciarTest() {
    setRespuestas({})
    setIndicePregunta(0)
    setFinalizado(false)
    setIniciado(false)
  }

  let contenido

  if (!iniciado) {
    contenido = (
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#40a9e6] to-[#3d7de3] shadow-lg shadow-[#3d7de3]/30 sm:h-16 sm:w-16">
          <ClipboardCheck className="text-white" size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">Descubre tu vocación</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#aaa5b0] sm:text-base">
          Responde {PREGUNTAS.length} preguntas rápidas sobre tus intereses y te
          mostraremos el área y las carreras que más encajan contigo.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left">
            <ListChecks className="shrink-0 text-[#40a9e6]" size={20} />
            <span className="text-sm text-[#aaa5b0]"> {PREGUNTAS.length} preguntas</span>
          </div>

          <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left">
            <Clock3 className="shrink-0 text-[#40a9e6]" size={20} />
            <span className="text-sm text-[#aaa5b0]">Toma ~3 minutos</span>
          </div>
        </div>

        <button type="button" onClick={() => setIniciado(true)}
          className="mt-8 h-12 w-full rounded-xl bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] font-bold text-white transition hover:brightness-110">
          Comenzar test
        </button>
      </div>
    )
  } else if (finalizado) {
    const conteo = {}
    Object.values(respuestas).forEach(({ area }) => {
      conteo[area] = (conteo[area] || 0) + 1
    })

    const areasOrdenadas = Object.entries(conteo).sort((a, b) => b[1] - a[1])
    const areaPrincipal = AREAS[areasOrdenadas[0][0]]
    const areaSecundaria =
      areasOrdenadas[1]?.[1] > 0 ? AREAS[areasOrdenadas[1][0]] : null

    contenido = (
      <ResultadoTest
        areaPrincipal={areaPrincipal}
        areaSecundaria={areaSecundaria}
        onReiniciar={reiniciarTest}
      />
    )
  } else {
    contenido = (
      <>
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          {indicePregunta > 0 && (
            <button type="button" onClick={irAnterior} className="shrink-0 text-[#aaa5b0] transition hover:text-white" aria-label="Pregunta anterior">
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="flex-1">
            <BarraProgreso actual={indicePregunta + 1} total={PREGUNTAS.length} />
          </div>
        </div>

        <PreguntaCard 
          pregunta={preguntaActual} 
          seleccionActual={respuestaSeleccionada}
          onSeleccionar={manejarSeleccion}
        />

        <button type="button" disabled={respuestaSeleccionada === null} onClick={irSiguiente}
          className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 sm:mt-8">
          {esUltimaPregunta ? 'Ver resultado' : 'Siguiente'}
        </button>
      </>
    )
  }

  return (
    <main className="flex min-h-screen items-start justify-center px-4 pt-10 pb-6 sm:px-6 sm:pt-16 sm:pb-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-md sm:max-w-lg sm:rounded-3xl sm:p-8 md:max-w-xl">
        {contenido}
      </div>
    </main>
  )
}