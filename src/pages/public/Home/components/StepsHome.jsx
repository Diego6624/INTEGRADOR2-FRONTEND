const steps = [
    {
        number: "01",
        title: "Elige tu camino",
        description: "Selecciona tu carrera o completa el test vocacional para descubrir cuál es la tuya.",
    },
    {
        number: "02",
        title: "Crear tu perfil",
        description: "Regístrate e ingresa tus datos universitarios para personalizar tu experiencia.",
    },
    {
        number: "03",
        title: "Traza tu ruta",
        description: "Genera un roadmap personalizado con IA o adopta uno de la comunidad.",
    },
    {
        number: "04",
        title: "Crece con otros",
        description: "Participa en foros, chatea con pares y aprende de los mejores mentores.",
    },
];

const StepsHome = () => {
    return (
        <section id="como-funciona" className="scroll-mt-20 w-full h-[90vh] bg-white flex flex-col justify-center items-center gap-8 px-8 md:px-40 py-20 overflow-hidden">
            {/* Header */}
            <div className="text-center flex flex-col gap-3">
                <h2 className="text-4xl md:text-6xl font-bold font-fraunces text-gray-900">
                    Empieza en cuatro pasos.
                </h2>
                <p className="text-gray-500 text-sm md:text-lg max-w-lg mx-auto font-roboto">
                    Deberás completar esta serie de pasos para comenzar tu nuevo viaje
                    universitario lleno de retos y objetivos
                </p>
            </div>

            {/* Steps */}
            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center text-center gap-5 group">
                        {/* Número */}
                        <span className="text-7xl md:text-8xl font-bold font-fraunces text-[#3E54A0] group-hover:text-[#4D88F4] transition duration-300 cursor-default">
                            {step.number}
                        </span>

                        {/* Línea con punto */}
                        <div className="relative w-full flex items-center justify-center">
                            <div className="absolute w-full h-px bg-[#C5C5E8]" />
                            <div className="relative z-10 w-3 h-3 rounded-full bg-[#051AE2]/47 group-hover:bg-[#4D88F4] transition duration-300" />
                        </div>

                        {/* Texto */}
                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold font-roboto text-gray-900 text-base cursor-default">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 text-sm font-roboto leading-relaxed cursor-default">
                                {step.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StepsHome;