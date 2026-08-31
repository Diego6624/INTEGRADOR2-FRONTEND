import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronDown, ChevronUp, Eye, MessagesSquare, Plus } from "lucide-react";

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

export default function Forum() {

    const chats = INITIAL_CHATS

    return (
        <ResizablePanelGroup
            orientation="horizontal"
            className=" rounded-lg border"
        >
            <ResizablePanel defaultSize="75%">
                <section className="flex w-full flex-col gap-6">
                    <Item variant="outline" className={'bg-white/5 backdrop-blur-md border border-white/10 '}>
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
                    </Item>


                    {chats.map((chat) => (
                        <Item variant="outline" className={'bg-white/5 backdrop-blur-xl border border-white/10 '}>
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
                        <div className="flex h-full items-center justify-center p-6">
                            <span className="font-semibold">Two</span>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>

    )
}