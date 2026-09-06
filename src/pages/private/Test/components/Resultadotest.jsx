import { Sparkles, RotateCcw } from 'lucide-react'

export default function ResultadoTest({ areaPrincipal, areaSecundaria, onReiniciar }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#40a9e6] to-[#3d7de3] shadow-lg shadow-[#3d7de3]/30 sm:h-16 sm:w-16">
        <Sparkles className="text-white" size={26} />
      </div>

      <p className="mt-5 text-sm text-[#aaa5b0]">Tu perfil vocacional es</p>

      <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
        {areaPrincipal.nombre}
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#aaa5b0] sm:text-base">
        {areaPrincipal.descripcion}
      </p>

      <div className="mt-6 w-full rounded-2xl bg-[#f1f1f3] p-5 text-left sm:p-6">
        <p className="mb-4 text-sm font-semibold text-[#4a4750]">
          Carreras que podrían interesarte
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {areaPrincipal.carreras.map((carrera) => (
            <span
              key={carrera}
              className="rounded-lg bg-white px-3 py-2 text-center text-xs font-medium text-[#3d7de3] shadow-sm sm:text-sm"
            >
              {carrera}
            </span>
          ))}
        </div>
      </div>

      {areaSecundaria && (
        <div className="mt-4 w-full rounded-2xl border border-white/10 p-4 text-left">
          <p className="text-xs text-[#aaa5b0] sm:text-sm">
            También muestras afinidad con{' '}
            <span className="font-semibold text-white">{areaSecundaria.nombre}</span>
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onReiniciar}
        className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white/10 font-semibold text-white transition hover:bg-white/20"
      >
        <RotateCcw size={18} />
        Repetir test
      </button>
    </div>
  )
}