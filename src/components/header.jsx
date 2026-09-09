import { Bell, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "@base-ui/react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";

export function Header() {
    return (
        <header className="bg-[#2F2F2FCC] backdrop-blur-md sticky top-2 sm:top-4 z-20 flex flex-row justify-between gap-2 sm:gap-4 py-3 sm:py-4 px-3 sm:px-6 border border-white/10 rounded-2xl sm:rounded-3xl items-center shadow-lg">
            {/* Izquierda: Botón Sidebar móvil + Título */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <SidebarTrigger className="text-white hover:bg-white/10 cursor-pointer shrink-0" />
                <h1 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-white truncate">
                    Bienvenido Usuario
                </h1>
            </div>

            {/* Derecha: Buscador + Notificaciones + Perfil */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
                <div className="hidden sm:block w-36 md:w-52 lg:w-64">
                    <InputGroup className="bg-white/5 border border-white/10 rounded-xl focus-within:border-[#3DAAED]">
                        <InputGroupInput placeholder="Buscar..." className="text-white placeholder:text-gray-400 text-sm" />
                        <InputGroupAddon className="text-gray-400">
                            <SearchIcon className="h-4 w-4" />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button className="p-2 sm:p-2.5 rounded-xl text-white bg-transparent hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        }
                    />
                    <DropdownMenuContent className="w-44 bg-[#252525] text-white border border-white/10" align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-gray-400 text-xs">Mi Cuenta</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                                Perfil
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                                Ajustes
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link to={'/profile'} className="shrink-0">
                    <Avatar size="default" className="ring-2 ring-white/20">
                        <AvatarImage alt="USER" className="bg-blue-500" />
                        <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm">
                            PS
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}