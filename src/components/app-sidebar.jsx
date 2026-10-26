import { Brain, ChevronRight, ClipboardCheck, Map, MessageCircle, Users, Info, ShieldCheck, FileText } from "lucide-react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useContext } from "react";
import { userInitials } from "@/lib/userIdentity";
import { AuthContext } from "@/context/AuthContext";

const projects = [
    { name: "Foro", icon: Users, url: "/forum" },
    { name: "Roadmap", icon: Map, url: "/roadmap" },
    { name: "Agente IA", icon: Brain, url: "/agent" },
    { name: "Chats", icon: MessageCircle, url: "/chat" },
    { name: "Test vocacional", icon: ClipboardCheck, url: "/test" },
    { name: "Consultas", icon: Info, url: "/information" }
];

// Botón flotante que abre/cierra el sidebar. Vive FUERA del componente <Sidebar>
// a propósito: en mobile el sidebar completo puede estar fuera de pantalla
// (off-canvas) cuando está cerrado, así que el botón que lo abre no puede
// depender de estar dentro de él.


export function AppSidebar() {

    const { pathname } = useLocation();
    const navigate = useNavigate()
    const { cerrarSesion, usuario } = useContext(AuthContext)


    const handleLogout = async () => {
        try {
            await cerrarSesion()
            navigate("/")

        } catch (err) {
            console.error('Logout error: ', err)
        }
    }

    return (
        <>
            <Sidebar
                collapsible="icon"
                variant="floating"
                // En mobile el panel se abre como off-canvas (drawer) a ancho completo del componente Sidebar;
                // en escritorio respeta el ancho configurado por el primitive.
                style={{ "--sidebar-width-mobile": "17rem" }}
                className="flex flex-col justify-center"
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

                    {usuario?.role === 'ADMINISTRADOR' && <SidebarGroup className="mt-4 gap-1 border-t border-white/10 pt-4">
                        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Panel de administrador</SidebarGroupLabel>
                        <TooltipProvider delayDuration={300}><SidebarMenu className="gap-1">
                            {[['Usuarios', Users, 'users'], ['Roadmaps', Map, 'roadmaps'], ['Publicaciones', FileText, 'posts'], ['Test vocacional', ShieldCheck, 'questions']].map(([label, Icon, section]) => (
                                <SidebarMenuItem key={section}><SidebarMenuButton render={<Link to={`/admin/${section}`} />}
                                    isActive={pathname === `/admin/${section}`} tooltip={label}
                                    className="h-11 gap-3 px-3 hover:bg-gray-600 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                                    <Icon className="size-5 shrink-0" /><span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
                                </SidebarMenuButton></SidebarMenuItem>
                            ))}
                        </SidebarMenu></TooltipProvider>
                    </SidebarGroup>}
                </SidebarContent>

                {/* PERFIL*/}
                <SidebarFooter className="flex items-center">
                    <SidebarMenu>
                        <SidebarMenuItem className={"w-full flex justify-center"}>
                            <DropdownMenu>
                                {/* BOTÓN DEL PERFIL */}
                                <DropdownMenuTrigger
                                    render={
                                        <SidebarMenuButton className="h-14 sm:h-16 group-data-[collapsible=icon]:border-none w-full justify-between group-data-[collapsible=icon]:h-10
                                     group-data-[collapsible=icon]:justify-center cursor-pointer"
                                        >
                                        {/* USER INFO */}
                                        <div className="flex items-center gap-2 sm:gap-3 w-full justify-center min-w-0">
                                            <Avatar size="sm" className="shrink-0 group-data-[collapsible=icon]:size-8"
                                            >

                                                <AvatarFallback className="bg-blue-500 text-white">
                                                    {userInitials(usuario?.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden"
                                            >
                                                <span className="text-sm truncate w-full">
                                                    {usuario?.name || "Usuario"}
                                                </span>

                                                <span className="text-xs text-muted-foreground truncate w-full">
                                                    {usuario?.university || usuario?.email || "Mi cuenta"}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="shrink-0 group-data-[collapsible=icon]:hidden" />
                                        </SidebarMenuButton>
                                    }
                                />
                                {/* DROPDOWN */}
                                <DropdownMenuContent side="left" align="end" className="px-2">
                                    {/* INFORMACIÓN DEL USUARIO */}
                                    <div className="flex items-center gap-3 py-2 px-1">
                                        <Avatar size="lg" className="shrink-0 group-data-[collapsible=icon]:size-8"
                                        >

                                            <AvatarFallback className="bg-blue-500 text-white">
                                                {userInitials(usuario?.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col items-start min-w-0"
                                        >
                                            <span className="text-sm truncate w-full">
                                                {usuario?.name || "Usuario"}
                                            </span>

                                            <span className="text-xs text-muted-foreground truncate w-full">
                                                {usuario?.university || usuario?.email || "Mi cuenta"}
                                            </span>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem render={<Link to="/profile" />}>Ver perfil</DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="text-red-500 focus:text-red-500 w-full h-full"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </DropdownMenuItem>
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
