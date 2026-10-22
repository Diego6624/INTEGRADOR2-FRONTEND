import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CampoContrasena from './CampoContrasena';
import GoogleButton from '@/components/auth/GoogleButton';
import apiFetch from '@/lib/apiClient';
import { useAuth } from '@/hooks/useAuth';

export default function FormularioInicio() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verificarSesion } = useAuth();
  async function manejarEnvio(event) {
    event.preventDefault();
    if (loading) return;
    setError(''); setLoading(true);
    try {
      await apiFetch.post('/login', { email: correo.trim(), password: contrasena, rememberMe: recordarme });
      const user = await verificarSesion();
      if (!user) { setError('No se pudo verificar la sesión. Revisa que tu navegador permita las cookies.'); return; }
      navigate('/forum', { replace: true });
    } catch (err) {
      setError([401, 403].includes(err.response?.status) ? 'Correo o contraseña incorrectos.' : 'No se pudo iniciar sesión. Intenta nuevamente.');
    } finally { setLoading(false); }
  }
  return <form onSubmit={manejarEnvio} className="flex flex-col gap-6" aria-busy={loading}>
    {searchParams.get("registered") === "1" && <p role="status" className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-3 text-sm text-blue-200">Cuenta creada. Ya puedes iniciar sesión.</p>}
    <div className="space-y-2">
      <label htmlFor="correo" className="block text-sm font-medium text-slate-200">Correo electrónico</label>
      <input id="correo" name="email" type="email" autoComplete="username" value={correo} onChange={event => setCorreo(event.target.value)} placeholder="nombre@correo.com" required maxLength={254}
        className="min-h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20" />
    </div>
    <CampoContrasena valor={contrasena} cambiarValor={setContrasena} />
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-200"><input type="checkbox" checked={recordarme} onChange={event => setRecordarme(event.target.checked)} aria-describedby="remember-help" className="size-4 shrink-0 accent-blue-500" />Recuérdame</label>
      <p id="remember-help" className="text-xs leading-5 text-slate-400">Mantén tu sesión durante 7 días en este dispositivo.</p>
    </div>
    {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
    <button type="submit" disabled={loading} className="min-h-12 w-full rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Ingresando...' : 'Ingresar'}</button>
    <GoogleButton />
    <p className="text-center text-sm text-slate-400">¿No tienes cuenta? <Link to="/register" className="font-medium text-blue-400 hover:underline">Regístrate</Link></p>
  </form>;
}
