import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { userInitials } from "@/lib/userIdentity";
import { Notifications } from "./notifications";

export function Header() {
    const { usuario } = useAuth();
    return (
        <header className="bg-[#2F2F2FCC] relative z-10 flex min-h-20 flex-row justify-between items-center gap-4 sm:gap-6 py-4 sm:py-5 px-4 sm:px-6 border border-white/10 rounded-2xl sm:rounded-3xl pl-14 md:pl-6 text-white">
            <h1 className="text-base sm:text-xl lg:text-2xl truncate min-w-0 flex-1" title={usuario?.name}>
                Bienvenido{usuario?.name ? `, ${usuario.name}` : ""}
            </h1>
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <Notifications key={usuario?.id} userId={usuario?.id} />
                <Link to="/profile" className="shrink-0" aria-label="Ver mi perfil">
                    <Avatar size="lg" className="size-8 sm:size-10">
                        <AvatarFallback className="bg-blue-500 text-white">{userInitials(usuario?.name)}</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}
