import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoContrasena from '../../Login/components/CampoContrasena';
import GoogleButton from '@/components/auth/GoogleButton';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { validateRegistration } from '@/lib/registrationValidation';
import apiFetch from '@/lib/apiClient';

export default function FormularioRegistro() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmation: '', accepted: false });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);
  const navigate = useNavigate();
  const errors = validateRegistration(form);
  const fieldError = field => (submitted || touched[field]) ? errors[field] : undefined;
  function change(field, value) { setForm(previous => ({ ...previous, [field]: value })); setError(''); }
  function blur(field) { setTouched(previous => ({ ...previous, [field]: true })); }
  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setSubmitted(true); setError('');
    if (Object.keys(errors).length) {
      document.getElementById(Object.keys(errors)[0])?.focus();
      return;
    }
    setLoading(true);
    try {
      await apiFetch.post('/register', { name: form.name.trim().replace(/\s+/g, ' '), email: form.email.trim(), password: form.password });
      navigate('/login?registered=1', { replace: true });
    } catch (err) {
      setError(err.response?.status === 409 ? 'Este correo ya tiene una cuenta. Inicia sesión.' : 'No se pudo crear la cuenta. Verifica tus datos e intenta nuevamente.');
    } finally { setLoading(false); }
  }
  return <>
    <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-busy={loading}>
      {[{ id: 'name', label: 'Nombre completo', type: 'text', autoComplete: 'name', placeholder: 'Tu nombre completo', max: 100 },
        { id: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email', placeholder: 'nombre@correo.com', max: 254 }].map(field => <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block text-sm font-medium text-slate-200">{field.label}</label>
        <input id={field.id} name={field.id} type={field.type} autoComplete={field.autoComplete} maxLength={field.max} required value={form[field.id]} onChange={event => change(field.id, event.target.value)} onBlur={() => blur(field.id)} placeholder={field.placeholder}
          aria-invalid={!!fieldError(field.id)} aria-describedby={fieldError(field.id) ? `${field.id}-error` : undefined}
          className={`min-h-12 w-full rounded-xl border bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 ${fieldError(field.id) ? 'border-red-400/70' : 'border-white/15'}`} />
        {fieldError(field.id) && <p id={`${field.id}-error`} className="text-xs leading-5 text-red-300">{fieldError(field.id)}</p>}
      </div>)}
      <CampoContrasena id="password" valor={form.password} cambiarValor={value => change('password', value)} autoComplete="new-password" maxLength={128} onBlur={() => blur('password')} error={fieldError('password')} hint="Mínimo 8 caracteres: mayúscula, minúscula, número y símbolo (@#$%^&+=!_-)." />
      <CampoContrasena id="confirmation" label="Confirmar contraseña" placeholder="Repite tu contraseña" valor={form.confirmation} cambiarValor={value => change('confirmation', value)} autoComplete="new-password" maxLength={128} onBlur={() => blur('confirmation')} error={fieldError('confirmation')} />
      <div className="space-y-2">
        <div className="flex items-start gap-3 text-sm leading-6 text-slate-300">
          <input id="accepted" type="checkbox" checked={form.accepted} onChange={event => { if (event.target.checked) setTermsOpen(true); else change('accepted', false); }} aria-label="Aceptar términos y condiciones" aria-invalid={!!fieldError('accepted')} aria-describedby={fieldError('accepted') ? 'accepted-error' : undefined} className="mt-1 size-4 shrink-0 accent-blue-500" />
          <span>Acepto los <button type="button" onClick={() => setTermsOpen(true)} className="text-blue-400 underline underline-offset-4">términos y condiciones</button>.</span>
        </div>
        {fieldError('accepted') && <p id="accepted-error" className="text-xs text-red-300">{fieldError('accepted')}</p>}
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading} className="min-h-12 rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Creando cuenta...' : 'Crear cuenta'}</button>
      <GoogleButton register />
      <p className="text-center text-sm text-slate-400">¿Ya tienes cuenta? <Link to="/login" className="font-medium text-blue-400 hover:underline">Inicia sesión</Link></p>
    </form>
    <Sheet open={termsOpen} onOpenChange={setTermsOpen}>
      <SheetContent className="overflow-y-auto border-white/10 bg-[#111827] p-6 text-white sm:max-w-lg">
        <SheetTitle className="pr-8 text-xl text-white">Términos y condiciones</SheetTitle>
        <SheetDescription className="text-slate-400">Texto provisional. El contenido definitivo se completará posteriormente.</SheetDescription>
        <div className="space-y-5 py-4 text-sm leading-7 text-slate-300">
          <p>Bienvenido a Journet. Al crear una cuenta, te comprometes a usar la plataforma con respeto y a proporcionar información veraz.</p>
          <p>Cuida tus credenciales y evita compartir contenido ofensivo, ilícito o que vulnere los derechos de otras personas. Los recursos de la comunidad tienen fines orientativos y educativos.</p>
          <p>La información de tu cuenta se utilizará para ofrecer las funciones de la plataforma. Las condiciones de uso y la política de privacidad definitivas se incorporarán en una próxima actualización.</p>
        </div>
        <button type="button" onClick={() => { change('accepted', true); setTermsOpen(false); }} className="min-h-12 rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white hover:bg-blue-600">He leído y acepto</button>
        <button type="button" onClick={() => setTermsOpen(false)} className="min-h-11 rounded-xl border border-white/15 px-4 text-slate-300 hover:bg-white/5">Volver</button>
      </SheetContent>
    </Sheet>
  </>;
}
