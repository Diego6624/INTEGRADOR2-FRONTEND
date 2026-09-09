import { Brain, ChevronRight, ClipboardCheck, Map, MessageCircle, Users } from "lucide-react";
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
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
    { name: "Test vocacional", icon: ClipboardCheck, url: "/test" }
];

// Botón flotante que abre/cierra el sidebar. Vive FUERA del componente <Sidebar>
// a propósito: en mobile el sidebar completo puede estar fuera de pantalla
// (off-canvas) cuando está cerrado, así que el botón que lo abre no puede
// depender de estar dentro de él.


export function AppSidebar() {

    const { pathname } = useLocation();

    return (
        <>
        <Sidebar
            collapsible="icon"
            variant="floating"
            // En mobile el panel se abre como off-canvas (drawer) a ancho completo del componente Sidebar;
            // en escritorio respeta el ancho configurado por el primitive.
            style={{ "--sidebar-width-mobile": "17rem" }}
            className="flex flex-col justify-center min-w-min top-2"
        >
            {/* HEADER */}
            <SidebarHeader className="p-3 sm:p-4 group-data-[collapsible=icon]:p-2 flex justify-center items-center">

                {/* LOGO */}
                <Link to="/" className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 group-data-[collapsible=icon]:hidden">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Journet
                    </span>
                    <hr className="border-white w-full" />
                </Link>

                {/* TRIGGER */}
            </SidebarHeader>

            {/* SEPARADOR COLAPSABLE */}
            <div className="group-data-[collapsible=icon]:flex w-full justify-center hidden">
                <hr className="border-white w-[80%]" />
            </div>

            {/* NAVEGACIÓN */}
            <SidebarContent className="px-1.5 sm:px-2 group-data-[collapsible=icon]:px-0.5">
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
                                        className="h-11 sm:h-12 px-2.5 sm:px-3 gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 
                                            hover:bg-gray-600 transition"
                                    >
                                        <project.icon className="size-5 shrink-0" />

                                        <span className="group-data-[collapsible=icon]:hidden truncate">
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
            <SidebarFooter className="flex items-center">
                <SidebarMenu>
                    <SidebarMenuItem className={"w-full flex justify-center"}>
                        <DropdownMenu>
                            {/* BOTÓN DEL PERFIL */}
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="h-14 sm:h-16 group-data-[collapsible=icon]:border-none w-full justify-between group-data-[collapsible=icon]:h-10
                                     group-data-[collapsible=icon]:justify-center cursor-pointer"
                                >
                                    {/* USER INFO */}
                                    <div className="flex items-center gap-2 sm:gap-3 w-full justify-center min-w-0">
                                        <Avatar size="sm" className="shrink-0 group-data-[collapsible=icon]:size-8"
                                        >
                                            <AvatarImage
                                                alt="Pedro Suárez"
                                                className="bg-blue-500"
                                            />
                                            <AvatarFallback className="bg-blue-500 text-white">
                                                PS
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden"
                                        >
                                            <span className="text-sm truncate w-full">
                                                Pedro Suárez
                                            </span>

                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                Ing. de sistemas
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="shrink-0 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            {/* DROPDOWN */}
                            <DropdownMenuContent side="left" align="end" className="px-2">
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

                                    <div className="flex flex-col items-start min-w-0"
                                    >
                                        <span className="text-sm truncate w-full">
                                            Pedro Suárez
                                        </span>

                                        <span className="text-xs text-muted-foreground truncate w-full">
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
                                
                                <Link to={"/"} className="w-full h-full cursor-pointer">
                                    <DropdownMenuItem
                                        className="text-red-500 focus:text-red-500 w-full h-full"
                                        onClick={() => {
                                            console.log("Cerrar sesión");
                                        }}
                                    >
                                        Cerrar sesión
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarTrigger className="shrink-0 size-8 hover:bg-gray-600 transition cursor-pointer" />

            </SidebarFooter>
        </Sidebar>
        </>
    );
}