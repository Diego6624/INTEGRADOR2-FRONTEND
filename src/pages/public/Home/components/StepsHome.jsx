const steps = [
    {
        number: "01",
        title: "Elige tu camino",
        description: "Selecciona tu carrera o completa el test vocacional para descubrir cuál es la tuya.",
    },
    {
        number: "02",
        title: "Crea tu perfil",
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
        <section id="como-funciona" className="scroll-mt-20 w-full min-h-fit bg-[#FAFAFA] flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-28">
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
                {/* Header */}
                <div className="text-center flex flex-col gap-2 sm:gap-3 max-w-2xl px-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-fraunces text-gray-900 leading-tight">
                        Empieza en cuatro pasos
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg font-roboto mt-1">
                        Sigue estos sencillos pasos para iniciar tu nuevo viaje universitario lleno de retos y objetivos.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 mt-10 sm:mt-14">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="flex flex-col items-center text-center gap-3 sm:gap-4 p-5 sm:p-4 rounded-2xl bg-white sm:bg-transparent shadow-sm sm:shadow-none border sm:border-none border-gray-100 group transition-all duration-300"
                        >
                            {/* Número */}
                            <span className="text-6xl sm:text-7xl md:text-8xl font-bold font-fraunces text-[#3E54A0] group-hover:text-[#4D88F4] transition-colors duration-300 cursor-default select-none">
                                {step.number}
                            </span>

                            {/* Línea conectora (visible en desktop) y punto */}
                            <div className="relative w-full flex items-center justify-center my-1">
                                <div className="hidden md:block absolute w-full h-px bg-[#C5C5E8]" />
                                <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-[#3E54A0]/60 group-hover:bg-[#4D88F4] group-hover:scale-125 transition-all duration-300" />
                            </div>

                            {/* Texto */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <h3 className="font-bold font-roboto text-gray-900 text-lg sm:text-base md:text-lg cursor-default">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-sm font-roboto leading-relaxed cursor-default">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StepsHome;