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
        <section id="caracteristicas" className="scroll-mt-20 w-full h-[90vh] bg-white flex flex-col justify-center items-center gap-8 px-8 md:px-40 py-20 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center justify-center">
                {/* Content */}
                <div className="flex flex-col gap-6">
                    {/* Título */}
                    <div
                        className="text-5xl font-bold text-gray-900 md:flex hidden"
                    >
                        Todo lo que necesitas, en un solo lugar
                    </div>

                    {/* Lista de Valores */}
                    <div className="flex flex-col gap-6">
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

                {/* Text Responsive */}
                <div className="text-3xl font-bold text-gray-900 md:hidden flex justify-center">
                    Todo lo que necesitas, en un solo lugar
                </div>

                {/* Image */}
                <div className="w-full h-full flex justify-center">
                    <div className="relative w-full max-w-lg">
                        {/* IMAGEN */}
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