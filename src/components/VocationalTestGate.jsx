import { Link } from 'react-router-dom';

export default function VocationalTestGate({ access, children, action = 'continuar' }) {
  if (access.loading) return <p role="status" className="rounded-xl border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-300">Verificando tu test vocacional...</p>;
  if (access.allowed) return children;
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-slate-200">
      {access.error ? <p role="alert">{access.error}</p> : <>
        <h2 className="text-lg font-semibold text-white">Completa tu test vocacional</h2>
        <p className="text-sm">Para {action}, primero debes completar y guardar el test vocacional.</p>
      </>}
      <div className="flex flex-wrap gap-3">
        <Link to="/test" className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white">Ir al test vocacional</Link>
        <button type="button" onClick={access.retry} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Volver a verificar</button>
      </div>
    </section>
  );
}
