import { Link } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
import { useState, useEffect } from "react";

const NavbarComponent = () => {
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: "Características", id: "caracteristicas" },
        { name: "¿Cómo Funciona?", id: "como-funciona" },
        { name: "Comunidad", id: "comunidad" },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === "Escape") setOpen(false); };
        const handleResize = () => { if (window.innerWidth >= 768) setOpen(false); };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setOpen(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-8 md:pt-4">
            {/* NAVBAR PRINCIPAL */}
            <div className="mx-auto flex items-center justify-between w-full max-w-7xl h-16 md:h-18 px-4 md:px-8 rounded-full bg-black/75 backdrop-blur-md border border-white/10 shadow-lg">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setOpen(false); }}
                    className="text-xl md:text-2xl font-bold font-barlow tracking-tight text-white hover:opacity-85 transition-opacity"
                >
                    JourNet
                </Link>

                {/* DESKTOP — Navegación */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => scrollToSection(item.id)}
                            className="nav-link text-base font-medium font-poppins py-1 cursor-pointer"
                        >
                            {item.name}
                        </button>
                    ))}
                </nav>

                {/* DESKTOP — Botón login */}
                <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 rounded-full bg-[linear-gradient(to_right,#3DAAED,#437DE8)]
                        px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                >
                    <UserRound className="h-4 w-4" strokeWidth={2.5} />
                    <span>Iniciar sesión</span>
                </Link>

                {/* MOBILE — Login + Hamburger */}
                <div className="flex items-center md:hidden">
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="rounded-full p-2 text-white hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none"
                        aria-label={open ? "Cerrar menú" : "Abrir menú"}
                        aria-expanded={open}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* MOBILE — Dropdown */}
            {open && (
                <div className="md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Dropdown con animación */}
                    <div className="absolute left-3 right-3 z-50 mt-2 rounded-2xl bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 p-3 shadow-2xl
            animate-in fade-in slide-in-from-top-2 duration-200">
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.id)}
                                    className="w-full text-left rounded-xl px-4 py-3.5 text-sm font-medium font-poppins
                            text-gray-200 hover:bg-white/10 hover:text-white active:bg-white/15 transition-colors"
                                >
                                    {item.name}
                                </button>
                            ))}

                            <div className="my-1 border-t border-white/10" />

                            <Link
                                to="/login"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-center gap-2 rounded-xl
                        bg-[linear-gradient(to_right,#3DAAED,#437DE8)] px-4 py-3
                        text-sm font-semibold text-white active:scale-95 transition-all"
                            >
                                <UserRound className="h-4 w-4" />
                                <span>Iniciar sesión</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavbarComponent;