import { ArrowUpRight, BookOpen, CircleHelp, MessagesSquare, Wrench } from "lucide-react";

const Information = () => {
    const supportTopics = [
        { icon: CircleHelp, title: "Orientación", description: "Resuelve tus dudas sobre cómo usar Journet." },
        { icon: BookOpen, title: "Tu experiencia de estudio", description: "Cuéntanos sobre tus roadmaps y recursos de aprendizaje." },
        { icon: Wrench, title: "Ayuda técnica", description: "Reporta un problema para que podamos revisarlo." },
    ];

    return (
        <section className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-black/70 text-white shadow-xl backdrop-blur-md">
            <header className="relative overflow-hidden bg-blue-500/10 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
                <div className="absolute -right-12 -top-16 size-56 rounded-full border-[32px] border-blue-400/15 sm:right-8 sm:top-[-6rem] sm:size-80" aria-hidden="true" />
                <div className="relative z-10 flex max-w-2xl flex-col items-start gap-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-3 py-1.5 text-xs font-bold uppercase text-blue-300">
                        <MessagesSquare className="size-4" aria-hidden="true" />
                        Comunidad Journet
                    </span>
                    <h1 className="max-w-xl font-fraunces text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                        Estamos aquí para ayudarte a avanzar.
                    </h1>
                    <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                        ¿Tienes una duda, encontraste un problema o quieres compartir una idea? Cuéntanos y te ayudaremos a encontrar el camino.
                    </p>
                </div>
            </header>

            <div className="grid items-start gap-8 border-t border-white/10 px-6 py-8 sm:gap-10 sm:px-8 sm:py-10 xl:grid-cols-2 xl:gap-12 lg:px-10">
                <div className="flex flex-col items-start gap-4">
                    <span className="text-sm font-semibold text-blue-300">Contacto y soporte</span>
                    <h2 className="font-fraunces text-2xl font-bold text-white sm:text-3xl">
                        ¿En qué podemos acompañarte?
                    </h2>
                    <p className="max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                        Entra al portal de soporte para registrar tu consulta. Así podremos conocer los detalles y darle seguimiento.
                    </p>
                    <a
                        href="https://pedrodavidsworkspace-40174552.atlassian.net/servicedesk/customer/portals"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex min-h-12 items-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                    >
                        Ir al portal de consultas
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                    <p className="text-xs text-slate-400">Se abrirá en una pestaña nueva.</p>
                </div>

                <div className="min-w-0 border-t border-white/10 pt-8 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
                    <h2 className="text-sm font-bold uppercase text-blue-300">Puedes consultarnos sobre</h2>
                    <ul className="mt-6 divide-y divide-white/10">
                        {supportTopics.map(({ icon: Icon, title, description }) => (
                            <li key={title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                                    <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <div className="min-w-0 space-y-2">
                                    <h3 className="font-semibold text-white">{title}</h3>
                                    <p className="text-sm leading-6 text-slate-300">{description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default Information;