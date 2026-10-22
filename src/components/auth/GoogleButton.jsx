export default function GoogleButton({ register = false }) {
  return <div className="space-y-3">
    <div className="flex items-center gap-4 text-xs text-slate-500"><span className="h-px flex-1 bg-white/10" />O CONTINÚA CON<span className="h-px flex-1 bg-white/10" /></div>
    <button type="button" disabled aria-describedby="google-status" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 disabled:cursor-not-allowed">
      <span aria-hidden="true" className="text-lg font-bold">G</span>{register ? "Registrarme" : "Ingresar"} con Google
    </button>
    <p id="google-status" className="text-center text-xs leading-5 text-slate-500">Google aún no está disponible. Usa tu correo y contraseña.</p>
  </div>;
}
