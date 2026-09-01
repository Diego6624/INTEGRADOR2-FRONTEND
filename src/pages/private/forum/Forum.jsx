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

export default function Forum() {

    return (
        <ResizablePanelGroup
            orientation="horizontal"
            className=""
        >
            <ResizablePanel defaultSize="75%">
                <section className="flex w-full flex-col gap-2">
                    <Item variant="outline" className={'bg-black/70 backdrop-blur-md border border-white/10 '}>
                        <ItemContent>
                            <ItemTitle className={'text-3xl font-semibold'}>Foro de la comunidad</ItemTitle>
                            <ItemDescription className={'text-lg'}>
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
                            <ToggleGroup size="sm" defaultValue={["top"]} variant="outline" spacing={2}>
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


                    {INITIAL_CHATS.map((chat) => (
                        <Item variant="outline" className={'bg-black/70 backdrop-blur-xl border border-white/10 '}>
                            <ItemMedia className={'flex flex-col'}>
                                <ChevronUp />
                                <span className="text-sm">
                                    {chat.id}
                                </span>
                            </ItemMedia>
                            <ItemContent>
                                <div className="flex flex-row gap-2">
                                    {chat.tags.map((tag) => (
                                        <Badge variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                                <ItemTitle className={'font-semibold'}>{chat.title}</ItemTitle>
                                <ItemDescription className={'text-sm'}>
                                    {chat.content}
                                </ItemDescription>

                                <div className="flex flex-row gap-6 items-center">
                                    <div className="flex flex-row items-center gap-2">
                                        <Avatar size="lg">
                                            <AvatarImage alt="USER" className={'bg-blue-500'} />
                                            <AvatarFallback className={'bg-blue-500 text-white'}>CN</AvatarFallback>
                                        </Avatar>
                                        <span>
                                            {chat.user}
                                        </span>
                                    </div>
                                    <span>
                                        {chat.lastComment}
                                    </span>
                                    <div className="flex flex-row gap-2">
                                        <MessagesSquare />
                                        <span>
                                            {chat.comments}
                                        </span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Eye />
                                        <span>
                                            {chat.views}
                                        </span>
                                    </div>

                                </div>

                            </ItemContent>
                        </Item>
                    ))}
                </section>
            </ResizablePanel>
            <ResizablePanel defaultSize="25%">
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize="50%">
                        <section className="rounded-3xl m-5 flex flex-col gap-2 items-center justify-center bg-black/70 backdrop-blur-md border border-white/10">
                            <Item>
                                <ItemContent>
                                    <ItemTitle className={'flex flex-row items-center justify-around  gap-20 w-full'}>
                                        <span className={'text-lg font-bold'}>Top mentores</span>
                                        <span>Puntos</span>
                                    </ItemTitle>
                                </ItemContent>
                                {
                                    INITIAL_MENTORES.map((mentor) => (
                                        <Item>
                                            <ItemMedia>
                                                <Avatar className="size-10">
                                                    <AvatarImage src="https://github.com/evilrabbit.png" />
                                                    <AvatarFallback>ER</AvatarFallback>
                                                </Avatar>
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle className={'text-md font-bold'}>{mentor.name}</ItemTitle>
                                                <ItemDescription>{mentor.career}</ItemDescription>
                                            </ItemContent>
                                            <ItemActions>
                                                <Link className="text-[#7C6DFF]">
                                                    {mentor.points}
                                                </Link>
                                            </ItemActions>
                                        </Item>
                                    ))
                                }
                            </Item>


                        </section>

                        <section className="rounded-3xl m-5 flex flex-col gap-2 items-center justify-center bg-black/70 backdrop-blur-md border border-white/10">
                            <Item>
                                <ItemContent>
                                    <ItemTitle>
                                        <span className={'text-lg font-bold'}>Roadmaps Populares</span>
                                    </ItemTitle>
                                </ItemContent>
                                {
                                    POPULAR_ROADMAPS.map((roadmap) => (
                                        <Item>
                                            <ItemMedia variant="icon" className={'p-2 rounded-xl bg-[#1A2540]'}>
                                                <MapIcon className="bg-[#1A2540]" size={64} />
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle className={'text-md font-bold'}>{roadmap.name}</ItemTitle>
                                                <ItemDescription>{roadmap.followers}</ItemDescription>
                                            </ItemContent>
                                        </Item>
                                    ))
                                }
                                <ItemFooter className={'flex flex-col'}>
                                    <hr className=" w-full bg-gray-600" />
                                    <Link to={'/roadmap'} className="text-[#7C6DFF] flex flex-row items-center">Ver todos los roadmaps <ChevronRight /></Link>
                                </ItemFooter>
                            </Item>


                        </section>


                        <section className="rounded-3xl m-5 flex flex-col gap-2 items-center justify-center bg-black/70 backdrop-blur-md border border-white/10">
                            <Item>
                                <ItemContent>
                                    <ItemTitle>
                                        <span className={'text-lg font-bold'}>Tu actividad</span>
                                    </ItemTitle>
                                </ItemContent>
                                <div className="grid grid-cols-2 gap-2">
                                    {
                                        INITIAL_DATA.map((data) => (
                                            <Item variant="outline" className={'bg-[#1E2D4A]'}>
                                                <ItemContent>
                                                    <ItemTitle className={'text-xl text-white font-bold'}>{data.number}</ItemTitle>
                                                    <ItemDescription>{data.content}</ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        ))
                                    }
                                </div>
                            </Item>


                        </section>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>

    )
}