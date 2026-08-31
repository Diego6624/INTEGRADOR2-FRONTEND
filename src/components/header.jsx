import { Bell, SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "@base-ui/react";

export function Header() {
    return (
        <header className="bg-[#2F2F2FCC] sticky top-0 z-10 flex flex-row justify-between w-full gap-2 py-5 px-6 border-b border-border rounded-3xl items-center">
            <h1 className="text-3xl">Bienvenido Usuario</h1>

            <div className="flex flex-row justify-between gap-7">
                <InputGroup className={'bg-transparent'}>
                    <InputGroupInput placeholder="Buscar..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>

                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline"><Bell /></Button>} />
                    <DropdownMenuContent className={'w-40'} align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuItem>
                                Profile
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Billing
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Avatar size="lg">
                    <AvatarImage alt="USER" className={'bg-blue-500'} />
                    <AvatarFallback className={'bg-blue-500 text-white'}>PS</AvatarFallback>
                </Avatar>
            </div>

        </header>
    )
}