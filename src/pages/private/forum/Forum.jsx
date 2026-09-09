import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronDown, ChevronRight, ChevronUp, Eye, MapIcon, MessagesSquare, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const INITIAL_CHATS = [
    {
        "id": 47,
        "tags": ["Tecnología", "Recursos"],
        "title": "¿Cuáles son los mejores cursos online para complementar Ingeniería en Sistemas en 2026?",
        "content": "Estoy en 4to semestre y quiero aprovechar el tiempo libre. He visto muchas opciones pero no sé cuáles son realmente útiles. ¿Recomendaciones?",
        "user": "Sebastián B.",
        "lastComment": "hace 2 horas",
        "comments": 24,
        "views": 312
    },
    {
        "id": 89,
        "tags": ["Recursos"],
        "title": "Compartiendo mi roadmap para Machine Learning desde cero — ruta completa 2026",
        "content": "Después de 6 meses de estudio autodidacta junto con mis materias, armé un roadmap detallado. Incluye recursos gratuitos y pagos.",
        "user": "Valentina Ríos",
        "lastComment": "hace 5 horas",
        "comments": 45,
        "views": 1240
    },
    {
        "id": 62,
        "tags": ["Vida universitaria"],
        "title": "¿Cómo equilibrar trabajo de medio tiempo y universidad sin afectar mis notas?",
        "content": "Empecé a trabajar este semestre y me está costando mantener el ritmo. Busco consejos de quienes ya lo han logrado.",
        "user": "Diego Restrepo",
        "lastComment": "hace 8 horas",
        "comments": 67,
        "views": 890
    }, {
        "id": 134,
        "tags": ["Recursos"],
        "title": "Lista completa de recursos gratuitos para aprender programación — actualizada mayo 2026",
        "content": "Recopilé más de 40 recursos completamente gratuitos: plataformas, canales de YouTube, libros y comunidades activas.",
        "user": "Ana Lucía V.",
        "lastComment": "hace 1 día",
        "comments": 89,
        "views": 3240
    }, {
        "id": 38,
        "tags": ["Carrera"],
        "title": "¿Vale la pena hacer una maestría directamente después de pregrado?",
        "content": "Tengo una oferta de trabajo y también una beca de maestría. No sé qué camino tomar. ¿Experiencias?",
        "user": "Mateo G.",
        "lastComment": "hace 2 días",
        "comments": 34,
        "views": 567
    },
]

const INITIAL_MENTORES = [
    {
        "name": "Ana Lucía Vargas",
        "career": "Ing. Sistemas",
        "points": 874
    },
    {
        "name": "Carlos Mendoza",
        "career": "Economía",
        "points": 723
    },
    {
        "name": "Sofía Bermúdez",
        "career": "Medicina",
        "points": 612
    },
    {
        "name": "Diego Amaya",
        "career": "Derecho",
        "points": 589
    },
    {
        "name": "Valeria Torres",
        "career": "Psicología",
        "points": 445
    },
]

const POPULAR_ROADMAPS = [
    {
        "name": "Full-Stack para Ing. Sistemas",
        "followers": "1.2K seguidores",
    },
    {
        "name": "Medicina: Años preclínicos",
        "followers": "987 seguidores",
    },
    {
        "name": "Emprendimiento universitario",
        "followers": "756 seguidores",
    }
]

const INITIAL_DATA = [
    {
        "number": 4,
        "content": "Hilos creados"
    },
    {
        "number": 18,
        "content": "Respuestas"
    }, {
        "number": 67,
        "content": "Me gusta recibidos"
    }, {
        "number": 2,
        "content": "Roadmaps"
    },
]

// Por debajo del breakpoint `lg` (1024px) NO usamos ResizablePanelGroup:
// los paneles redimensionables (con su handle de arrastre) no tienen
// sentido en mobile y suelen comportarse mal cuando cambian de tamaño
// en caliente. En vez de eso, en mobile se renderiza un layout simple
// apilado (flex-col), y solo en desktop se monta el layout de columnas
// redimensionables.
function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(
        typeof window !== "undefined" ? window.innerWidth >= 1024 : true
    );

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const handler = (e) => setIsDesktop(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return isDesktop;
}

function ForumHeader() {
    return (
        <Item variant="outline" className={'bg-black/70 backdrop-blur-md border border-white/10 '}>
            <ItemContent>
                <ItemTitle className={'text-xl sm:text-2xl lg:text-3xl font-semibold'}>Foro de la comunidad</ItemTitle>
                <ItemDescription className={'text-sm sm:text-base lg:text-lg'}>
                    Comparte, aprende y conecta con la comunidad universitaria
                </ItemDescription>
            </ItemContent>

            <ItemActions>
                <Button size="sm" className="bg-blue-500 rounded-3xl">
                    <Plus className="text-white" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline">Popular <ChevronDown /></Button>} />
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
            </ItemActions>
            <ItemFooter>
                <ToggleGroup size="sm" defaultValue={["top"]} variant="outline" spacing={2} className={'flex flex-wrap'}>
                    <ToggleGroupItem value="Todos" aria-label="Toggle top" className={'bg-[#1C2D6E]'}>
                        Todos
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Tecnología" aria-label="Toggle bottom" className={'bg-[#1C2D6E]'}>
                        Tecnología
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Carrera" aria-label="Toggle left" className={'bg-[#1C2D6E]'}>
                        Carrera
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Recursos" aria-label="Toggle right" className={'bg-[#1C2D6E]'}>
                        Recursos
                    </ToggleGroupItem>
                    <ToggleGroupItem value="Mentorías" aria-label="Toggle right" className={'bg-[#1C2D6E]'}>
                        Mentorías
                    </ToggleGroupItem>
                </ToggleGroup>
            </ItemFooter>
        </Item>
    );
}

function ForumChatList() {
    return (
        <>
            {INITIAL_CHATS.map((chat) => (
                <Item key={chat.id} variant="outline" className={'bg-black/70 backdrop-blur-xl border border-white/10 '}>
                    <ItemMedia className={'flex flex-col'}>
                        <ChevronUp />
                        <span className="text-sm">
                            {chat.id}
                        </span>
                    </ItemMedia>
                    <ItemContent>
                        <div className="flex flex-row flex-wrap gap-2">
                            {chat.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                        <ItemTitle className={'font-semibold text-base sm:text-lg'}>{chat.title}</ItemTitle>
                        <ItemDescription className={'text-sm'}>
                            {chat.content}
                        </ItemDescription>

                        <div className="flex flex-row flex-wrap gap-3 sm:gap-6 items-center">
                            <div className="flex flex-row items-center gap-2">
                                <Avatar size="lg" className={'size-8 sm:size-10'}>
                                    <AvatarImage alt="USER" className={'bg-blue-500'} />
                                    <AvatarFallback className={'bg-blue-500 text-white'}>CN</AvatarFallback>
                                </Avatar>
                                <span className="text-sm sm:text-base">
                                    {chat.user}
                                </span>
                            </div>
                            <span className="text-sm sm:text-base">
                                {chat.lastComment}
                            </span>
                            <div className="flex flex-row gap-2 items-center">
                                <MessagesSquare className="size-4 sm:size-5" />
                                <span className="text-sm sm:text-base">
                                    {chat.comments}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Eye className="size-4 sm:size-5" />
                                <span className="text-sm sm:text-base">
                                    {chat.views}
                                </span>
                            </div>
                        </div>
                    </ItemContent>
                </Item>
            ))}
        </>
    );
}

function ForumMain() {
    return (
        <section className="flex w-full flex-col gap-2">
            <ForumHeader />
            <ForumChatList />
        </section>
    );
}

function ForumAside() {
    return (
        <>
            <section className="rounded-3xl m-2 sm:m-5 flex flex-col gap-2 items-center justify-center bg-black/70 backdrop-blur-md border border-white/10">
                <Item>
                    <ItemContent>
                        <ItemTitle className={'flex flex-row items-center justify-between gap-4 sm:gap-20 w-full'}>
                            <span className={'text-base sm:text-lg font-bold'}>Top mentores</span>
                            <span className="text-sm sm:text-base">Puntos</span>
                        </ItemTitle>
                    </ItemContent>
                    {
                        INITIAL_MENTORES.map((mentor, index) => (
                            <Item key={index}>
                                <ItemMedia>
                                    <Avatar className="size-8 sm:size-10">
                                        <AvatarImage src="https://github.com/evilrabbit.png" />
                                        <AvatarFallback>ER</AvatarFallback>
                                    </Avatar>
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className={'text-sm sm:text-md font-bold truncate'}>{mentor.name}</ItemTitle>
                                    <ItemDescription className="text-xs sm:text-sm">{mentor.career}</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                    <Link className="text-[#7C6DFF] text-sm sm:text-base">
                                        {mentor.points}
                                    </Link>
                                </ItemActions>
                            </Item>
                        ))
                    }
                </Item>
            </section>

            <section className="rounded-3xl m-2 sm:m-5 flex flex-col gap-2 items-center justify-center bg-black/70 backdrop-blur-md border border-white/10">
                <Item>
                    <ItemContent>
                        <ItemTitle>
                            <span className={'text-base sm:text-lg font-bold'}>Roadmaps Populares</span>
                        </ItemTitle>
                    </ItemContent>
                    {
                        POPULAR_ROADMAPS.map((roadmap, index) => (
                            <Item key={index}>
                                <ItemMedia variant="icon" className={'p-2 rounded-xl bg-[#1A2540]'}>
                                    <MapIcon className="bg-[#1A2540] size-8 sm:size-16" />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className={'text-sm sm:text-md font-bold truncate'}>{roadmap.name}</ItemTitle>
                                    <ItemDescription className="text-xs sm:text-sm">{roadmap.followers}</ItemDescription>
                                </ItemContent>
                            </Item>
                        ))
                    }
                    <ItemFooter className={'flex flex-col'}>
                        <hr className=" w-full bg-gray-600" />
                        <Link to={'/roadmap'} className="text-[#7C6DFF] flex flex-row items-center text-sm sm:text-base">Ver todos los roadmaps <ChevronRight className="size-4 sm:size-5" /></Link>
                    </ItemFooter>
                </Item>
            </section>

            <section className="rounded-3xl m-2 sm:m-5 flex flex-col gap-2 items-center justify-center bg-black/70 backdrop-blur-md border border-white/10">
                <Item>
                    <ItemContent>
                        <ItemTitle>
                            <span className={'text-base sm:text-lg font-bold'}>Tu actividad</span>
                        </ItemTitle>
                    </ItemContent>
                    <div className="grid grid-cols-2 gap-2 w-full px-2">
                        {
                            INITIAL_DATA.map((data) => (
                                <Item key={data.number} variant="outline" className={'bg-[#1E2D4A]'}>
                                    <ItemContent>
                                        <ItemTitle className={'text-lg sm:text-xl text-white font-bold'}>{data.number}</ItemTitle>
                                        <ItemDescription className="text-xs sm:text-sm">{data.content}</ItemDescription>
                                    </ItemContent>
                                </Item>
                            ))
                        }
                    </div>
                </Item>
            </section>
        </>
    );
}

export default function Forum() {
    const isDesktop = useIsDesktop();

    // Desktop: layout de columnas redimensionables (comportamiento original).
    if (isDesktop) {
        return (
            <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel defaultSize="75%">
                    <ForumMain />
                </ResizablePanel>
                <ResizablePanel defaultSize="25%">
                    <ResizablePanelGroup orientation="vertical">
                        <ResizablePanel defaultSize="50%">
                            <ForumAside />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        );
    }

    // Mobile / tablet: layout simple apilado, sin handles de resize.
    return (
        <div className="flex flex-col gap-4 w-full">
            <ForumMain />
            <div className="flex flex-col">
                <ForumAside />
            </div>
        </div>
    );
}