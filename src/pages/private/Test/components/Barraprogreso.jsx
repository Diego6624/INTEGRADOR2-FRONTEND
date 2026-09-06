export default function BarraProgreso({ actual, total }) {
  const porcentaje = Math.round((actual / total) * 100)

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs text-[#aaa5b0] sm:text-sm">
        <span>
          Pregunta {actual} de {total}
        </span>
        <span className="font-medium text-white">{porcentaje}%</span>
      </div>

      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, indice) => (
          <div key={indice} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] transition-all duration-500 ease-out" style={{ width: indice < actual ? '100%' : '0%' }}/>
          </div>
        ))}
      </div>
    </div>
  )
}