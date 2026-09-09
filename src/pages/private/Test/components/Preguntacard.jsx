export default function PreguntaCard({ pregunta, seleccionActual, onSeleccionar }) {
  return (
    <div>
      <h2 className="text-xl font-semibold leading-snug text-white sm:text-2xl">
        {pregunta.texto}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pregunta.opciones.map((opcion, indice) => {
          const seleccionada = seleccionActual === indice

          return (
            <button
              key={indice}
              type="button"
              onClick={() => onSeleccionar(indice, opcion.area)}
              className={`group flex items-start gap-3 rounded-xl px-4 py-4 text-left transition-all duration-200 ${
                seleccionada
                  ? 'bg-gradient-to-br from-[#40a9e6] to-[#3d7de3] text-white shadow-lg shadow-[#3d7de3]/20'
                  : 'bg-[#f1f1f3] text-[#4a4750] hover:-translate-y-0.5 hover:shadow-md'
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  seleccionada
                    ? 'bg-white text-[#3d7de3]'
                    : 'bg-white text-[#9490a0] group-hover:text-[#3d7de3]'
                }`}
              >
                {String.fromCharCode(65 + indice)}
              </span>
              <span className="text-sm leading-snug sm:text-base">{opcion.texto}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}