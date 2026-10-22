import { ArrowUpRight, BookOpen, CircleHelp, MessagesSquare, Wrench } from "lucide-react";

const Information = () => {
    const supportTopics = [
        { icon: CircleHelp, title: "Orientación", description: "Resuelve tus dudas sobre cómo usar Journet." },
        { icon: BookOpen, title: "Tu experiencia de estudio", description: "Cuéntanos sobre tus roadmaps y recursos de aprendizaje." },
        { icon: Wrench, title: "Ayuda técnica", description: "Reporta un problema para que podamos revisarlo." },
    ];

    return (
        <section className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl">
            <header className="relative overflow-hidden bg-[#e8f4f7] px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
                <div className="absolute -right-12 -top-16 size-56 rounded-full border-[32px] border-[#b8dce4]/50 sm:right-8 sm:top-[-6rem] sm:size-80" aria-hidden="true" />
                <div className="relative z-10 max-w-2xl">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold uppercase text-[#315f70]">
                        <MessagesSquare className="size-4" aria-hidden="true" />
                        Comunidad Journet
                    </span>
                    <h1 className="max-w-xl font-fraunces text-3xl font-bold leading-tight text-[#173b4a] sm:text-5xl">
                        Estamos aquí para ayudarte a avanzar.
                    </h1>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-[#42616c] sm:text-base sm:leading-7">
                        ¿Tienes una duda, encontraste un problema o quieres compartir una idea? Cuéntanos y te ayudaremos a encontrar el camino.
                    </p>
                </div>
            </header>

            <div className="grid gap-10 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-16">
                <div className="flex flex-col items-start justify-center">
                    <span className="text-sm font-semibold text-[#397889]">Contacto y soporte</span>
                    <h2 className="mt-2 font-fraunces text-2xl font-bold text-[#193744] sm:text-3xl">
                        ¿En qué podemos acompañarte?
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
                        Entra al portal de soporte para registrar tu consulta. Así podremos conocer los detalles y darle seguimiento.
                    </p>
                    <a
                        href="https://pedrodavidsworkspace-40174552.atlassian.net/servicedesk/customer/portals"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#245d73] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#19495d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245d73]"
                    >
                        Ir al portal de consultas
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                    <p className="mt-3 text-xs text-slate-500">Se abrirá en una pestaña nueva.</p>
                </div>

                <div className="border-t border-slate-200 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    <h2 className="text-sm font-bold uppercase text-[#397889]">Puedes consultarnos sobre</h2>
                    <ul className="mt-4 divide-y divide-slate-200">
                        {supportTopics.map(({ icon: Icon, title, description }) => (
                            <li key={title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f4f7] text-[#245d73]">
                                    <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="font-semibold text-[#193744]">{title}</h3>
                                    <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
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