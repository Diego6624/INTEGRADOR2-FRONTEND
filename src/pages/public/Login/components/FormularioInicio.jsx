import { useContext, useState } from 'react'
import { Mail } from 'lucide-react'
import CampoContrasena from './CampoContrasena'
import { useNavigate } from 'react-router-dom'
import apiFetch from '@/lib/apiClient'
import { AuthContext } from '@/context/AuthContext'

export default function FormularioInicio() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [recordarme, setRecordarme] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const {verificarSesion} = useContext(AuthContext)

  async function manejarEnvio(evento) {

    evento.preventDefault()

    setError('')
    setLoading(true)

    try {
      await apiFetch.post("/login", {
        email: correo,
        password: contrasena
      })

      await verificarSesion()

      navigate('/forum')

    } catch (err) {

      console.log(err)
      if (err.response?.status === 401) {
        setError('Correo o contraseña incorrectos')
      } else {
        setError('No se pudo iniciar sesión. Intentalo nuevamente')
      }

    } finally {
      setLoading(false)
    }



    console.log({
      recordarme,
    })
  }

  return (
    <form
      onSubmit={manejarEnvio}
      className="mt-8 flex flex-col gap-5"
    >
      <div>
        <label htmlFor="correo" className="mb-2 block text-sm text-[#aaa5b0]">
          Correo
        </label>

        <div className="flex h-16 items-center gap-3 rounded-lg bg-[#f1f1f3] px-4">
          <Mail className="text-[#77747b]" size={19} />

          <input id="correo" type="email" value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            placeholder="Ingresa tu Correo"
            className="w-full bg-transparent text-[#555] outline-none placeholder:text-[#888]" required
          />
        </div>
      </div>

      <CampoContrasena valor={contrasena}
        cambiarValor={setContrasena}
      />

      <div className="flex items-center gap-3 text-sm text-[#aaa5b0]">
        <div
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${recordarme ? 'bg-blue-500' : 'bg-white/20'
            }`}
        >
          <button type="button"
            onClick={() => setRecordarme(!recordarme)}
            className={`absolute top-0.5 left-0.5 h-5 w-5 cursor-pointer rounded-full bg-white shadow-md transition-transform duration-300 ${recordarme ? 'translate-x-5' : 'translate-x-0'
              }`}
          />
        </div>
        Recuérdame
      </div>

      {
        error && (
          <p className='text-center text-sm text-red-400'>
            {error}
          </p>
        )
      }

      <button type="submit" disabled={loading} className="disabled:cursor-not-allowed  h-12 w-full rounded-lg bg-gradient-to-r from-[#40a9e6] to-[#3d7de3] font-bold text-white transition hover:brightness-110">
        {loading ? 'Ingresando ...': 'Ingresar'}
      </button>


      <div className="border-t border-white/40" />

      <button type="button" className="flex h-12 items-center justify-center gap-3 rounded-lg bg-[#505052] text-white hover:brightness-110">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
        Ingresar con Google
      </button>

      <p className="text-center text-sm text-[#aaa5b0]">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-[#3da3ee] hover:underline">
          Regístrate
        </a>
      </p>
    </form>
  )
}