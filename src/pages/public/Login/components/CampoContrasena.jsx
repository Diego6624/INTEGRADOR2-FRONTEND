import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'

export default function CampoContrasena({
  valor,
  cambiarValor,
}) {
  const [mostrar, setMostrar] = useState(false)

  return (
    <div>
      <label htmlFor="contrasena" className="mb-2 block text-sm text-[#aaa5b0]">
        Contraseña
      </label>

      <div className="flex h-16 items-center gap-3 rounded-lg bg-[#f1f1f3] px-4">
        <LockKeyhole className="text-[#77747b]" size={19} />

        <input id="contrasena" type={mostrar ? 'text' : 'password'} value={valor}
          onChange={(evento) =>
            cambiarValor(evento.target.value)
          }
          placeholder="Ingresa tu contraseña" className="w-full bg-transparent text-[#555] outline-none placeholder:text-[#888]" required
        />

        <button type="button"
          onClick={() => setMostrar(!mostrar)}
          className="text-[#555]"
          aria-label={
            mostrar
              ? 'Ocultar contraseña'
              : 'Mostrar contraseña'
          }
        >
          {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  )
}