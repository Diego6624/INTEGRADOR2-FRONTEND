const reviews = [
    {
        name: "Pedro",
        role: "Ing. de Sistemas",
        stars: 5,
        text: "Gracias a JourNet pude ver mi ruta académica de forma clara. La simulación de los ciclos me ayudó muchísimo a organizar mis horarios y cursos."
    },
    {
        name: "María",
        role: "Psicología",
        stars: 4,
        text: "El test vocacional fue muy preciso. Me sentía bastante perdida, pero las recomendaciones de carreras encajaron perfectamente con mis habilidades."
    },
    {
        name: "Carlos",
        role: "Administración",
        stars: 5,
        text: "La comunidad en los foros es increíble. Pude hablar con estudiantes de ciclos superiores que me guiaron con excelentes consejos prácticos."
    },
    {
        name: "Lucía",
        role: "Arquitectura",
        stars: 4,
        text: "Me encanta el agente de Inteligencia Artificial. Me resolvió dudas al instante cuando no sabía en qué consistían ciertos cursos de mi malla."
    },
    {
        name: "Juan",
        role: "Estudiante de Secundaria",
        stars: 5,
        text: "Aún no sabía qué estudiar, pero esta plataforma me dio una visión clara de mis opciones y me conectó con universitarios reales para orientarme."
    },
    {
        name: "Sofía",
        role: "Medicina",
        stars: 5,
        text: "El sistema de insignias por responder dudas en el foro me motiva a seguir compartiendo mis apuntes y ayudando a los cachimbos. ¡Súper útil!"
    },
];

const ReviewCard = ({ name, role, stars, text }) => (
    <div className="flex flex-col justify-between bg-[#262626] rounded-2xl p-5 sm:p-6 min-w-[260px] max-w-[260px] sm:min-w-[320px] sm:max-w-[320px] gap-5 shadow-lg border border-white/5">
        <p className="text-gray-200 text-xs sm:text-sm font-poppins leading-relaxed line-clamp-4">
            "{text}"
        </p>
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-base sm:text-lg ${i < stars ? "text-[#3DAAED]" : "text-gray-600"}`}>
                    ★
                </span>
            ))}
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <img
                src={`https://i.pravatar.cc/100?u=${encodeURIComponent(name)}`}
                alt={name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-white/20"
                loading="lazy"
            />
            <div>
                <p className="text-white font-semibold text-xs sm:text-sm font-poppins">{name}</p>
                <p className="text-gray-400 text-[11px] sm:text-xs font-poppins">{role}</p>
            </div>
        </div>
    </div>
);

const ReviewsHome = () => {
    return (
        <section id="comunidad" className="scroll-mt-20 w-full min-h-fit bg-white flex flex-col justify-center items-center gap-8 sm:gap-12 py-16 sm:py-20 md:py-28 overflow-hidden">
            {/* Header */}
            <div className="text-center flex flex-col gap-2 sm:gap-3 px-4 max-w-2xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-fraunces text-gray-900 leading-tight">
                    Experiencias de nuestra comunidad
                </h2>
                <p className="text-gray-600 text-sm sm:text-lg font-roboto mt-1">
                    Descubre cómo JourNet ha guiado a otros jóvenes a encontrar su camino vocacional.
                </p>
            </div>

            {/* Carousel loop */}
            <div className="relative w-full overflow-hidden">
                {/* Gradientes laterales para difuminar */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

                <div className="flex gap-4 sm:gap-6 animate-marquee w-max hover:[animation-play-state:paused] py-2 px-4">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} {...review} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsHome;