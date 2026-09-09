import { Bell, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "@base-ui/react";
import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="bg-[#2F2F2FCC] sticky top-4 z-10 flex flex-row flex-wrap justify-between items-center gap-2 sm:gap-3
            py-3 sm:py-5 px-4 sm:px-6 border-b border-border rounded-2xl sm:rounded-3xl
            pl-14 md:pl-6">
            {/* pl-14 en mobile deja espacio para el botón flotante que abre el sidebar
                (fixed, md:hidden) definido en Layout.jsx, para que no tape el título */}
            <h1 className="text-lg sm:text-2xl lg:text-3xl truncate min-w-0 flex-1">
                Bienvenido Usuario
            </h1>

            <div className="flex flex-row items-center gap-2 sm:gap-4 lg:gap-7 shrink-0">
                <InputGroup className={'bg-transparent hidden sm:flex w-40 md:w-56 lg:w-64'}>
                    <InputGroupInput placeholder="Buscar..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>

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
                    <Avatar size="lg" className="size-8 sm:size-10">
                        <AvatarImage alt="USER" className={'bg-blue-500'} />
                        <AvatarFallback className={'bg-blue-500 text-white'}>PS</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </header>
    );
}