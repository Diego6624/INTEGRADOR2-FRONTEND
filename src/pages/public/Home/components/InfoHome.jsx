const InfoHome = () => {
    const values = [
        {
            description: "Conecta con estudiantes de tu carrera, aprende de mentores y comparte conocimiento con quienes van en tu camino."
        },
        {
            description: "¿Aún no sabes qué estudiar? Nuestro test inteligente analiza tus intereses y habilidades para orientarte."
        },
        {
            description: "Crea rutas de aprendizaje adaptadas a tu carrera, objetivos y ritmo de vida. Compártelos con la comunidad."
        },
        {
            description: "Consulta recomendaciones de cursos, profesores y recursos. Genera roadmaps automáticos con inteligencia artificial."
        }
    ];

    return (
        <section id="caracteristicas" className="scroll-mt-20 w-full min-h-fit bg-white flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-36 py-16 sm:py-20 md:py-28">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
                {/* Content */}
                <div className="flex flex-col gap-6 sm:gap-8">
                    {/* Título unificado */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-fraunces text-gray-900 leading-tight">
                            Todo lo que necesitas, en un solo lugar
                        </h2>
                    </div>

                    {/* Lista de Valores */}
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-center group cursor-default"
                            >
                                {/* Borde izquierdo azul */}
                                <div
                                    className="w-1 bg-black transition duration-400 group-hover:bg-[#3E54A0] rounded-full shrink-0"
                                    style={{ minHeight: '70px' }}
                                >
                                </div>

                                {/* Contenido del valor */}
                                <div className="flex group-hover:-translate-x-2 transition-transform duration-400">
                                    <p className="text-base md:text-lg text-gray-700 font-semibold">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image */}
                <div className="w-full flex justify-center items-center">
                    <div className="relative w-full max-w-md lg:max-w-lg">
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#3DAAED]/20 to-[#3E54A0]/20 rounded-3xl blur-xl" />
                        <img
                            src="/images/infoHomeImage.png"
                            alt="image"
                            className="relative z-10 w-full h-full md:h-[450px] object-cover shadow-lg bg-center"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoHome;