import { Sparkles, CheckCircle2 } from 'lucide-react'
import { rankCareers } from '../vocationalApi'

export default function ResultadoTest({ resultado }) {
  const opciones = resultado.vocacionalOptions ?? []
  const ranking = rankCareers(opciones)
  const tied = ranking.length > 1 && ranking[0].score === ranking[1].score

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#40a9e6] to-[#3d7de3] shadow-lg shadow-[#3d7de3]/30 sm:h-16 sm:w-16">
        <Sparkles className="text-white" size={26} />
      </div>
      <p className="mt-5 text-sm text-[#aaa5b0]">Tu carrera sugerida es</p>
      <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{resultado.suggestedCareer}</h1>
      <p role="status" className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
        <CheckCircle2 size={16} /> Resultado guardado
      </p>
      {ranking.length > 0 && <div className="mt-6 w-full rounded-2xl bg-[#f1f1f3] p-5 text-left sm:p-6">
        <h2 className="mb-4 text-sm font-semibold text-[#4a4750]">Puntajes por carrera</h2>
        <ol className="space-y-2">
          {ranking.map(item => <li key={item.career} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm text-[#4a4750]">
            <span>{item.career}</span><span className="shrink-0 font-semibold text-[#3d7de3]">{item.score} puntos</span>
          </li>)}
        </ol>
        {tied && <p className="mt-4 text-xs text-[#4a4750]">Hay carreras con el mismo puntaje máximo.</p>}
      </div>}
      {opciones.length > 0 && <details className="mt-5 w-full rounded-2xl border border-white/10 p-4 text-left text-sm text-slate-300">
        <summary className="cursor-pointer font-medium text-white">Ver mis respuestas guardadas</summary>
        <ol className="mt-3 list-inside list-decimal space-y-2">
          {opciones.map(option => <li key={option.id}>{option.text}</li>)}
        </ol>
      </details>}
      <p className="mt-5 text-xs text-[#aaa5b0]">Tu resultado queda disponible para consultarlo cuando vuelvas.</p>
    </div>
  )
}
