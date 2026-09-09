import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroHome = () => {
    const scrollToFeatures = () => {
        const el = document.getElementById("caracteristicas");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative w-full min-h-[110dvh] bg-[url(/images/heroImage.png)] bg-cover bg-center bg-no-repeat overflow-hidden flex flex-col justify-center items-center">
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            {/* Contenido encima del overlay */}
            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col justify-center items-center text-center px-4 sm:px-8 md:px-12 pt-28 pb-20 md:pt-24 md:pb-24">
                

                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-fraunces leading-tight tracking-tight">
                    Tu camino Universitario guiado desde el inicio
                </h1>

                <p className="text-base sm:text-lg md:text-2xl text-gray-200/95 mt-4 sm:mt-6 font-roboto max-w-3xl leading-relaxed">
                    Desde elegir tu carrera hasta graduarte, Journet te acompaña con roadmaps inteligentes, 
                    foros de comunidad y un agente IA que entiende tu trayectoria académica.
                </p>

                
            </div>
        </section>
    );
};

export default HeroHome;