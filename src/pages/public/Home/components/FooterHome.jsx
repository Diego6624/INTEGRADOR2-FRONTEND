import { Link } from "react-router-dom";

const FooterHome = () => {
    return (
        <footer className="w-full bg-[#1A1A2E] text-white py-16 px-8 md:px-40 flex flex-col mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
                    <h3 className="text-2xl font-bold font-fraunces">Journet</h3>
                    <p className="text-gray-400 text-sm font-poppins leading-relaxed">
                        Tu camino universitario guiado desde el inicio. Roadmaps, comunidad e IA para estudiantes.
                    </p>
                </div>

                {/* Plataforma */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold font-poppins text-sm text-gray-300 uppercase tracking-widest">
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
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold font-poppins text-sm text-gray-300 uppercase tracking-widest">
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
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold font-poppins text-sm text-gray-300 uppercase tracking-widest">
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
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-xs font-poppins">
                    © {new Date().getFullYear()} Journet. Todos los derechos reservados.
                </p>
                <p className="text-gray-500 text-xs font-poppins">
                    Desarrollado para apoyo vocacional.
                </p>
            </div>
        </footer>
    );
};

export default FooterHome;