import { Brain, ChevronRight, Map, MessageCircle, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



const projects = [
    {
        name: "Foro",
        icon: Users,
        url: "/forum"
    },
    {
        name: "Roadmap",
        icon: Map,
        url: "/roadmap"
    },
    {
        name: "Agente IA",
        icon: Brain,
        url: "/agent"
    },
    {
        name: "Chats",
        icon: MessageCircle,
        url: "/chat"
    },
];

export function AppSidebar() {

    const pathname = useLocation();
    console.log(pathname)

    return (
        <Sidebar collapsible="icon" variant="floating" className={'mt-2'}>
            <SidebarHeader className={'group-data-[collapsible=icon]:hidden p-6'}>
                <span className="gap-1 text-center space-y-3 text-3xl font-bold tracking-tight">Journet</span>
                <hr className="border-white border"/>
            </SidebarHeader>
            <SidebarContent className="px-2">

                <SidebarGroup className="group-data-[collapsible=icon]:hidden gap-1" >
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    <SidebarMenu className="gap-1">
                        {projects.map((project) => (
                            <SidebarMenuItem key={project.name}>
                                <SidebarMenuButton render={<a href={project.url} />} className="gap-3 px-3 py-2 h-12" isActive={pathname.pathname === project.url}>
                                    <project.icon />
                                    <span>{project.name}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* {"Sección de recientes"} */}
                {/* <SidebarGroup>
                    <SidebarMenu>
                            <SidebarMenuItem key={"Recientes"}>
                                <SidebarMenuButton>
                                    Chats recinetes
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup> */}


            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className={'h-20 border-2 justify-between'} render={<a href="/profile"/>}>
                            <div className="flex flex-row gap-3">
                                <Avatar size="lg">
                                    <AvatarImage alt="USER" className={'bg-blue-500'}/>
                                    <AvatarFallback className={'bg-blue-500 text-white'}>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-left">
                                    <span className="text-sm">Pedro Suaréz</span>
                                    <span className="text-">Ing de sistemas</span>
                                </div>
                            </div>
                            <ChevronRight />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}