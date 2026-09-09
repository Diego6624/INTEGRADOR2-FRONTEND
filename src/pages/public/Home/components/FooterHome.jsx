import { Link } from "react-router-dom";

const FooterHome = () => {
    return (
        <footer className="w-full bg-[#121222] text-white py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-20 mt-auto border-t border-white/5">
            <div className="max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
                        <Link
                            to="/"
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="text-2xl font-bold font-barlow tracking-tight text-white inline-block"
                        >
                            JourNet
                        </Link>
                        <p className="text-gray-400 text-sm font-poppins leading-relaxed max-w-sm">
                            Tu camino universitario guiado desde el inicio. Roadmaps, comunidad e inteligencia artificial para estudiantes.
                        </p>
                    </div>

                    {/* Plataforma */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold font-poppins text-xs sm:text-sm text-gray-200 uppercase tracking-wider">
                            Plataforma
                        </h4>
                        <ul className="flex flex-col gap-2">
                            {["Roadmaps", "Foros", "Agente IA", "Comunidad"].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-400 text-sm font-poppins hover:text-white transition-colors duration-200">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compañía */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold font-poppins text-xs sm:text-sm text-gray-200 uppercase tracking-wider">
                            Compañía
                        </h4>
                        <ul className="flex flex-col gap-2">
                            {["Sobre nosotros", "Blog", "Carreras", "Contacto"].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-400 text-sm font-poppins hover:text-white transition-colors duration-200">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-3">
                        <h4 className="font-semibold font-poppins text-xs sm:text-sm text-gray-200 uppercase tracking-wider">
                            Legal
                        </h4>
                        <ul className="flex flex-col gap-2">
                            {["Términos de uso", "Privacidad", "Cookies"].map((item) => (
                                <li key={item}>
                                    <Link to="#" className="text-gray-400 text-sm font-poppins hover:text-white transition-colors duration-200">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider + Copyright */}
                <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-3">
                    <p className="text-gray-400 text-xs font-poppins">
                        © {new Date().getFullYear()} JourNet. Todos los derechos reservados.
                    </p>
                    <p className="text-gray-400 text-xs font-poppins">
                        Desarrollado para orientación académica universitaria.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterHome;