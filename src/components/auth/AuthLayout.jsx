import { Link } from "react-router-dom";
import background from "@/assets/background.jpg";

export default function AuthLayout({ title, description, children }) {
  return <main className="min-h-svh bg-[#0b101c] text-white lg:grid lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden border-r border-white/10 bg-cover bg-center lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16" style={{ backgroundImage: `linear-gradient(180deg, rgba(11,16,28,.35), rgba(11,16,28,.95)), url(${background})` }}>
      <Link to="/" className="relative text-3xl font-bold tracking-tight">Journet<span className="text-blue-400">.</span></Link>
      <div className="relative max-w-lg space-y-6 py-16">
        <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm text-blue-200">Tu futuro empieza contigo</span>
        <h2 className="font-fraunces text-4xl leading-tight xl:text-5xl">Encuentra tu camino.<br />Construye tu futuro.</h2>
        <p className="max-w-md leading-7 text-slate-300">Descubre tus intereses, organiza tu aprendizaje y conecta con una comunidad que avanza contigo.</p>
      </div>
      <p className="relative text-sm text-slate-400">Orientación, aprendizaje y comunidad.</p>
    </aside>
    <section className="flex min-w-0 items-center justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-12">
      <div className="w-full max-w-md space-y-8">
        <Link to="/" className="inline-block text-2xl font-bold tracking-tight lg:hidden">Journet<span className="text-blue-400">.</span></Link>
        <div className="space-y-3"><h1 className="text-3xl font-semibold tracking-tight">{title}</h1><p className="text-sm leading-6 text-slate-400">{description}</p></div>
        {children}
      </div>
    </section>
  </main>;
}
