import { Brain, ChevronRight, Map, MessageCircle, Users } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger
} from "./ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const projects = [
    { name: "Foro", icon: Users, url: "/forum" },
    { name: "Roadmap", icon: Map, url: "/roadmap" },
    { name: "Agente IA", icon: Brain, url: "/agent" },
    { name: "Chats", icon: MessageCircle, url: "/chat" },
];

export function AppSidebar() {
    const { pathname } = useLocation();

    return (
        <Sidebar
            collapsible="icon"
            variant="floating"
            className="flex flex-col justify-center min-w-min"
        >
            {/* HEADER */}
            <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
                <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                    {/* LOGO */}
                    <Link to="/" className="flex flex-col items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
                        <span className="text-3xl font-bold tracking-tight">
                            Journet
                        </span>
                        <hr className="border-white w-full" />
                    </Link>

                    {/* TRIGGER */}
                    <SidebarTrigger className="shrink-0 size-8 hover:bg-gray-600 transition cursor-pointer" />
                </div>
            </SidebarHeader>

            {/* SEPARADOR COLAPSABLE */}
            <div className="group-data-[collapsible=icon]:flex w-full justify-center hidden">
                <hr className="border-white w-[80%]" />
            </div>

            {/* NAVEGACIÓN */}
            <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0.5">
                <SidebarGroup className="gap-1">

                    {/* LABEL */}
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        Principal
                    </SidebarGroupLabel>

                    {/* MAP RUTAS */}
                    <TooltipProvider delayDuration={300}>
                        <SidebarMenu className="gap-1">
                            {projects.map((project) => (
                                <SidebarMenuItem key={project.name}>
                                    <SidebarMenuButton
                                        render={<Link to={project.url} />}
                                        isActive={pathname === project.url}
                                        tooltip={project.name}
                                        className="h-12 px-3 gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 
                                            hover:bg-gray-600 transition"
                                    >
                                        <project.icon className="size-5 shrink-0" />

                                        <span className="group-data-[collapsible=icon]:hidden">
                                            {project.name}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </TooltipProvider>
                </SidebarGroup>

                {/* RECIENTES */}
                <SidebarGroup>

                    {/* LABEL */}
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        Recientes
                    </SidebarGroupLabel>

                    {/* MAP RUTAS */}
                    {/* <TooltipProvider delayDuration={300}>
                        <SidebarMenu className="gap-1">

                        </SidebarMenu>
                    </TooltipProvider> */}
                </SidebarGroup>
            </SidebarContent>

            {/* PERFIL*/}
            <SidebarFooter className="">
                <SidebarMenu>
                    <SidebarMenuItem className={"w-full flex justify-center"}>
                        <DropdownMenu>
                            {/* BOTÓN DEL PERFIL */}
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-16 group-data-[collapsible=icon]:border-none w-full justify-between px-3 group-data-[collapsible=icon]:h-10
                                     group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 cursor-pointer"
                                >
                                    {/* USER INFO */}
                                    <div className="flex items-center gap-3 w-full justify-between">
                                        <Avatar size="lg" className="shrink-0 group-data-[collapsible=icon]:size-8"
                                        >
                                            <AvatarImage
                                                alt="Pedro Suárez"
                                                className="bg-blue-500"
                                            />
                                            <AvatarFallback className="bg-blue-500 text-white">
                                                PS
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden"
                                        >
                                            <span className="text-sm">
                                                Pedro Suárez
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                Ing. de sistemas
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="shrink-0 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            {/* DROPDOWN */}
                            <DropdownMenuContent side="left" align="end" className="w-full px-2">
                                {/* INFORMACIÓN DEL USUARIO */}
                                <div className="flex items-center gap-3 py-2 px-1">
                                    <Avatar size="lg" className="shrink-0 group-data-[collapsible=icon]:size-8"
                                    >
                                        <AvatarImage
                                            alt="Pedro Suárez"
                                            className="bg-blue-500"
                                        />
                                        <AvatarFallback className="bg-blue-500 text-white">
                                            PS
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden"
                                    >
                                        <span className="text-sm">
                                            Pedro Suárez
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                            Ing. de sistemas
                                        </span>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    {/* <Link to="/profile"> */}
                                        Ver perfil
                                    {/* </Link> */}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    onClick={() => {
                                        console.log("Cerrar sesión");
                                    }}
                                >
                                    Cerrar sesión
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar >
    );
}