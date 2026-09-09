import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
import { useState } from "react";

const NavbarComponent = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: "Características", id: "caracteristicas" },
        { name: "Como Funciona", id: "como-funciona" },
        { name: "Comunidad", id: "comunidad" },
    ];

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setOpen(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-2 pt-2 md:px-4 md:pt-3">
            {/* ============================= */}
            {/* CONTENEDOR PRINCIPAL */}
            {/* ============================= */}
            <div className="mx-auto flex items-center justify-between w-full max-w-7xl h-20 px-5 md:px-8 rounded-full bg-black/70 md:backdrop-blur-md">
                {/* ============================= */}
                {/* MOBILE */}
                {/* ============================= */}
                <div className="flex w-full items-center justify-between md:hidden">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="text-2xl font-bold tracking-tight text-white"
                    >
                        JourNet
                    </Link>

                    {/* Botón menú */}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                        aria-label="Abrir menú"
                    >
                        {open ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* ============================= */}
                {/* DESKTOP */}
                {/* ============================= */}
                <div className="hidden md:flex w-full items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl md:text-3xl font-bold font-barlow tracking-tight text-white transition-opacity hover:opacity-80"
                    >
                        JourNet
                    </Link>

                    {/* Navegación */}
                    <nav className="flex items-center gap-5 lg:gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => scrollToSection(item.id)}
                                className="relative text-sm md:text-lg font-medium font-poppins text-white transition-all duration-300
                                    hover:bg-[linear-gradient(to_right,#3DAAED,#437DE8)] hover:bg-clip-text hover:text-transparent py-2 bg-clip-text cursor-pointer"
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Botón Login */}
                    <Link
                        to="/login"
                        className=" flex items-center gap-2 rounded-full bg-[linear-gradient(to_right,#3DAAED,#437DE8)] hover:bg-[#437DE8] 
                            px-4 py-2.5 text-sm md:text-lg font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    >
                        <UserRound className="h-4 w-4" strokeWidth={2.5} />
                        <span>
                            Iniciar sesión
                        </span>
                    </Link>
                </div>
            </div>


            {/* ============================= */}
            {/* MOBILE DROPDOWN */}
            {/* ============================= */}
            <div className="md:hidden">
                {open && (
                    <>
                        {/* Overlay */}
                        <div className="fixed inset-0 z-40 bg-black/20" />

                        {/* Dropdown */}
                        <div className="absolute top-[74px] left-2 right-2 z-50 overflow-hidden rounded-3xl bg-[#292929] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                            {/* Links */}
                            <nav className="flex flex-col px-4 py-3">
                                {navItems.map((item) => {
                                    const isActive =
                                        location.hash ===
                                        item.path.split("#")[1];

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setOpen(false)}
                                            className={`rounded-xl px-4 py-4 text-center text-sm font-medium transition-colors duration-200
                                                ${isActive
                                                    ? "text-[#4285D4] bg-white/5"
                                                    : "text-white hover:bg-white/10"
                                                }
                                            `}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}

                                {/* Login */}
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="
                                        mt-2 flex items-center justify-center gap-2 rounded-full 
                                        bg-[linear-gradient(to_right,#3DAAED,#437DE8)]/74
                                        hover:bg-[linear-gradient(to_right,#3DAAED,#437DE8)]
                                        px-4 py-3 text-sm md:text-lg font-semibold text-white transition-all duration-300
                                    "
                                >
                                    <UserRound className="h-4 w-4" />
                                    Iniciar sesión
                                </Link>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default NavbarComponent;