const reviews = [
    { name: "Pedro", role: "Ing. de sistemas", stars: 5, text: "Deberás completar esta serie de pasos para comenzar tu nuevo viaje universitario lleno de retos y objetivos" },
    { name: "María", role: "Ing. de sistemas", stars: 4, text: "Deberás completar esta serie de pasos para comenzar tu nuevo viaje universitario lleno de retos y objetivos" },
    { name: "Carlos", role: "Ing. de sistemas", stars: 5, text: "Deberás completar esta serie de pasos para comenzar tu nuevo viaje universitario lleno de retos y objetivos" },
    { name: "Lucía", role: "Ing. de sistemas", stars: 4, text: "Deberás completar esta serie de pasos para comenzar tu nuevo viaje universitario lleno de retos y objetivos" },
    { name: "Juan", role: "Ing. de sistemas", stars: 5, text: "Deberás completar esta serie de pasos para comenzar tu nuevo viaje universitario lleno de retos y objetivos" },
    { name: "Sofía", role: "Ing. de sistemas", stars: 5, text: "Deberás completar esta serie de pasos para comenzar tu nuevo viaje universitario lleno de retos y objetivos" },
];

const ReviewCard = ({ name, role, stars, text }) => (
    <div className="flex flex-col justify-between bg-[#3A3A3A] rounded-2xl p-6 min-w-[300px] max-w-[300px] gap-6">
        {/* Bubble tail */}
        <p className="text-white text-sm font-poppins leading-relaxed">{text}</p>
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xl ${i < stars ? "text-[#3DAAED]" : "text-gray-600"}`}>★</span>
            ))}
        </div>
        {/* Triangle tail */}
        <div className="flex items-center gap-3 relative">
            <div className="absolute -top-9 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-[#3A3A3A]" />
            <img
                src="https://i.pravatar.cc/40?u=${name}"
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <p className="text-white font-semibold text-sm font-poppins">{name}</p>
                <p className="text-gray-400 text-xs font-poppins">{role}</p>
            </div>
        </div>
    </div>
);

const ReviewsHome = () => {
    return (
        <section id="comunidad" className="scroll-mt-20 w-full h-[90vh] bg-white flex flex-col justify-center items-center gap-12 py-20 overflow-hidden">
            {/* Header */}
            <div className="text-center flex flex-col gap-3 px-8">
                <h2 className="text-4xl md:text-6xl font-bold font-fraunces text-gray-900">
                    Empieza en cuatro pasos.
                </h2>
                <p className="text-gray-500 text-sm md:text-lg max-w-lg mx-auto">
                    Deberás completar esta serie de pasos para comenzar tu nuevo viaje
                    universitario lleno de retos y objetivos
                </p>
            </div>

            {/* Carousel loop */}
            <div className="relative w-full overflow-hidden">
                <div className="flex gap-6 animate-marquee w-max">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} {...review} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsHome;