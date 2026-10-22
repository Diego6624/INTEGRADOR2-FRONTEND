import { useState } from 'react'
import { ChevronLeft, ClipboardCheck, Clock3, ListChecks } from 'lucide-react'
import BarraProgreso from './components/Barraprogreso'
import PreguntaCard from './components/Preguntacard'
import ResultadoTest from './components/Resultadotest'
import useVocationalTest from './useVocationalTest'

export default function Test() {
  const test = useVocationalTest()
  const PREGUNTAS = test.questions
  const [iniciado, setIniciado] = useState(false)
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [respuestas, setRespuestas] = useState({})

  const preguntaActual = PREGUNTAS[indicePregunta]
  const esUltimaPregunta = indicePregunta === PREGUNTAS.length - 1
  const respuestaSeleccionada = preguntaActual?.opciones.findIndex(opcion => opcion.id === respuestas[preguntaActual.id]) ?? -1

  function manejarSeleccion(indiceOpcion) {
    if (test.saving) return
    setRespuestas((previas) => ({
      ...previas,
      [preguntaActual.id]: preguntaActual.opciones[indiceOpcion].id,
    }))
  }

  function irSiguiente() {
    if (test.saving || respuestaSeleccionada < 0) return
    if (esUltimaPregunta) {
      test.submit(respuestas)
      return
    }
    setIndicePregunta((previo) => previo + 1)
  }

  function irAnterior() {
    if (indicePregunta === 0) return
    setIndicePregunta((previo) => previo - 1)
  }

  let contenido

  if (test.loading) {
    contenido = <p role="status" className="text-center text-slate-300">Cargando test vocacional...</p>
  } else if (test.error) {
    contenido = <div role="alert" className="space-y-4 text-center text-rose-200"><p>{test.error}</p>
      <button type="button" onClick={test.retry} className="rounded-xl bg-white/10 px-4 py-2 text-white">Reintentar</button></div>
  } else if (test.result) {
    contenido = <ResultadoTest resultado={test.result} />
  } else if (!PREGUNTAS.length) {
    contenido = <div className="space-y-4 text-center text-slate-300"><p>No hay preguntas disponibles en este momento.</p>
      <button type="button" onClick={test.retry} className="rounded-xl bg-white/10 px-4 py-2 text-white">Actualizar</button></div>
  } else if (!iniciado) {
    contenido = (
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#40a9e6] to-[#3d7de3] shadow-lg shadow-[#3d7de3]/30 sm:h-16 sm:w-16">
          <ClipboardCheck className="text-white" size={26} />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">Descubre tu vocación</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#aaa5b0] sm:text-base">
          Responde {PREGUNTAS.length} preguntas rápidas sobre tus intereses y te
          mostraremos las carreras con mayor puntaje según tus respuestas.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left">
            <ListChecks className="shrink-0 text-[#40a9e6]" size={20} />
            <span className="text-sm text-[#aaa5b0]"> {PREGUNTAS.length} preguntas</span>
          </div>

          <div className="flex flex-1 items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left">
            <Clock3 className="shrink-0 text-[#40a9e6]" size={20} />
            <span className="text-sm text-[#aaa5b0]">A tu ritmo</span>
          </div>
        </div>

        <button type="button" onClick={() => setIniciado(true)}
          className="mt-8 h-12 w-full rounded-xl bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] font-bold text-white transition hover:brightness-110">
          Comenzar test
        </button>
      </div>
    )
  } else {
    contenido = (
      <>
        <div className="mb-6 flex items-center gap-3 sm:mb-8">
          {indicePregunta > 0 && (
            <button type="button" onClick={irAnterior} disabled={test.saving} className="shrink-0 text-[#aaa5b0] transition hover:text-white" aria-label="Pregunta anterior">
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
          disabled={test.saving}
          onSeleccionar={manejarSeleccion}
        />

        <button type="button" disabled={respuestaSeleccionada < 0 || test.saving} onClick={irSiguiente}
          className="mt-6 h-12 w-full rounded-xl bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 sm:mt-8">
          {test.saving ? 'Guardando resultado...' : esUltimaPregunta ? 'Guardar y ver resultado' : 'Siguiente'}
        </button>
      </>
    )
  }

  return (
    <main className="flex min-h-screen items-start justify-center px-4 pt-10 pb-6 sm:px-6 sm:pt-16 sm:pb-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-5 shadow-2xl shadow-black/40 backdrop-blur-md sm:max-w-lg sm:rounded-3xl sm:p-8 md:max-w-xl">
        {test.saveError && <p role="alert" className="mb-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-200">{test.saveError}</p>}
        {contenido}
      </div>
    </main>
  )
}