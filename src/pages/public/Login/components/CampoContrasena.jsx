import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';

export default function CampoContrasena({ valor, cambiarValor, id = "contrasena", label = "Contraseña", placeholder = "Ingresa tu contraseña", autoComplete = "current-password", error, hint, onBlur, maxLength }) {
  const [mostrar, setMostrar] = useState(false);
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-slate-200">{label}</label>
    <div className={`flex min-h-12 items-center gap-3 rounded-xl border bg-white/5 px-4 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 ${error ? "border-red-400/70" : "border-white/15"}`}>
      <LockKeyhole className="shrink-0 text-slate-400" size={18} aria-hidden="true" />
      <input id={id} name={id} type={mostrar ? 'text' : 'password'} value={valor} autoComplete={autoComplete} onBlur={onBlur} maxLength={maxLength}
        onChange={event => cambiarValor(event.target.value)} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error || hint ? `${id}-help` : undefined}
        className="min-w-0 w-full bg-transparent py-3 text-base text-white outline-none placeholder:text-slate-500" required />
      <button type="button" onClick={() => setMostrar(!mostrar)} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-blue-400" aria-label={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={mostrar}>
        {mostrar ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
    {(error || hint) && <p id={`${id}-help`} className={`text-xs leading-5 ${error ? "text-red-300" : "text-slate-400"}`}>{error || hint}</p>}
  </div>;
}
