const HeroHome = () => {
    return(<>
        <section className="relative w-full h-screen md:h-[110vh] bg-[url(/images/heroImage.png)] bg-cover bg-center bg-no-repeat overflow-hidden">
            {/* Overlay solo sobre la imagen */}
            <div className="absolute inset-0 bg-black/25" />
            
            {/* Contenido encima del overlay */}
            <div className="relative z-10 w-full h-screen flex flex-col justify-center items-center gap-2 px-8 md:px-40">
                <h1 className="text-4xl md:text-7xl font-bold text-white text-center font-fraunces">
                    Tu camino Universitario guiado desde el inicio
                </h1>
                <p className="text-lg md:text-2xl text-white text-center mt-4 font-roboto">
                    Desde elegir tu carrera hasta graduarte, Journet te acompaña con roadmaps inteligentes, 
                    foros de comunidad y un agente IA que entiende tu trayectoria académica.
                </p>
            </div>
        </section>
    </>);
};

export default HeroHome;