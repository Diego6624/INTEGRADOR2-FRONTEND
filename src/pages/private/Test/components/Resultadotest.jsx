import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResultadoTest({ resultado }) {
  const ranking = resultado.ranking ?? [];
  const tied = ranking.filter(item => item.percentage > 0 && item.percentage === ranking[0]?.percentage);
  return <div className="space-y-6 text-white">
    <div className="flex items-start gap-4">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300"><Sparkles /></div>
      <div className="min-w-0 space-y-2"><p className="text-sm text-slate-400">Tu carrera sugerida</p><h1 className="text-2xl font-semibold sm:text-3xl">{resultado.suggestedCareer}</h1></div>
    </div>
    <p role="status" className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={16} />Resultado guardado{resultado.completedAt ? ` el ${new Date(resultado.completedAt).toLocaleDateString('es-PE')}` : ''}</p>
    {ranking.length > 0 ? <section className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="space-y-2"><h2 className="font-semibold">Afinidad por carrera</h2><p className="text-xs leading-5 text-slate-400">Puntos obtenidos / máximo posible de cada carrera. El porcentaje expresa interés relativo, no probabilidad de éxito.</p></div>
      <ol className="space-y-5">{ranking.map(item => <li key={item.career} className="space-y-2">
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm"><span>{item.career}</span><span className="text-blue-300">{item.score}/{item.maxScore} puntos · {item.percentage}%</span></div>
        <div role="progressbar" aria-label={`Afinidad con ${item.career}`} aria-valuenow={item.percentage} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-500" style={{ width: `${item.percentage}%` }} /></div>
      </li>)}</ol>
      {tied.length > 1 && <p className="text-sm leading-6 text-blue-200">Hay un empate entre {tied.map(item => item.career).join(', ')}. La primera se muestra por orden alfabético; explora todas las opciones empatadas.</p>}
      {ranking.every(item => item.score === 0) && <p className="text-sm text-slate-300">Tus respuestas no muestran una preferencia entre estas carreras. Puedes explorar otras áreas de interés.</p>}
    </section> : <p className="text-sm text-slate-400">Este resultado anterior no tiene un desglose de puntajes guardado.</p>}
    {(resultado.vocacionalOptions ?? []).length > 0 && <details className="rounded-2xl border border-white/10 p-4 text-sm text-slate-300">
      <summary className="cursor-pointer font-medium text-white">Ver mis respuestas guardadas</summary>
      <ol className="mt-4 list-inside list-decimal space-y-3">{resultado.vocacionalOptions.map(option => <li key={option.id}>Pregunta {option.questionId}: {option.text}</li>)}</ol>
    </details>}
    <p className="text-xs leading-6 text-slate-400">Este cuestionario es orientativo y no es una evaluación psicométrica validada. Considera tus habilidades, experiencias y otras carreras antes de tomar una decisión.</p>
    <Link to="/roadmap" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-600">Explorar mis roadmaps</Link>
  </div>;
}
