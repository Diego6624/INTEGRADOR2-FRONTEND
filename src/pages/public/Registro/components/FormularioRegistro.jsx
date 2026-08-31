import { useState } from 'react'
import { Mail, User } from 'lucide-react'
import CampoContrasena from '../../Inicio/components/CampoContrasena'
import { Link } from 'react-router-dom'

export default function FormularioRegistro() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  function manejarEnvio(evento) {
    evento.preventDefault()

    if (contrasena !== confirmarContrasena) {
      console.log('Las contraseñas no coinciden')
      return
    }

    console.log({
      nombre,
      correo,
      contrasena,
      aceptaTerminos,
    })
  }

  return (
    <form onSubmit={manejarEnvio} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="mb-2 block text-sm text-[#aaa5b0]">
          Nombre
        </label>
        <div className="flex h-14 items-center gap-3 rounded-lg bg-[#f1f1f3] px-4">
          <User className="text-[#77747b]" size={19} />
          <input id="nombre" type="text" value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
            placeholder="Ingresa tu nombre" className="w-full bg-transparent text-[#555] outline-none placeholder:text-[#888]" required />
        </div>
      </div>
      <div>
        <label htmlFor="correo" className="mb-2 block text-sm text-[#aaa5b0]">
          Correo
        </label>
        <div className="flex h-14 items-center gap-3 rounded-lg bg-[#f1f1f3] px-4">
          <Mail className="text-[#77747b]" size={19} />
          <input id="correo" type="email" value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="Ingresa tu Correo" className="w-full bg-transparent text-[#555] outline-none placeholder:text-[#888]" required />
        </div>
      </div>

      <CampoContrasena valor={contrasena} cambiarValor={setContrasena} id="contrasena" label="Contraseña" placeholder="Ingresa tu contraseña" />
      <CampoContrasena valor={confirmarContrasena} cambiarValor={setConfirmarContrasena} id="confirmarContrasena" label="Confirmar contraseña" placeholder="Confirma tu contraseña" />

      <label className="flex items-center gap-3 text-sm text-[#aaa5b0]">
        <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${aceptaTerminos ? 'bg-blue-500' : 'bg-white/20'
          }`}>
          <button type="button"
            onClick={() => setAceptaTerminos(!aceptaTerminos)}
            className={`absolute top-0.5 left-0.5 h-5 w-5 cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ${aceptaTerminos ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </div>
        Acepto los términos y condiciones
      </label>

      <Link to={"/login"} className='flex w-full'>
        <button type="submit" className="h-11 w-full rounded-lg bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] font-bold text-white transition hover:brightness-110">
          Crear cuenta
        </button>
      </Link>

      <div className="border-t border-white/40" />
      <button type="button" className="flex h-11 items-center justify-center gap-3 rounded-lg bg-[#505052] text-white hover:brightness-110">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
        Registrarme con Google
      </button>
      <p className="text-center text-sm text-[#aaa5b0]">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-[#3da3ee] hover:underline">
          Inicia sesión
        </a>
      </p>
    </form>
  )
}