import { fetchReadStates, isMessageRead, markMessagesRead } from "@/lib/chatReadState";
import { formatMessageTime } from "@/lib/messageTime";
import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiFetch from "@/lib/apiClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export function Notifications({ userId }) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [revision, setRevision] = useState(0);

    useEffect(() => {
        if (!userId) return;
        const controller = new AbortController();
        let running = false;
        async function refresh() {
            if (running || document.hidden) return;
            running = true;
            try {
                const readStates = await fetchReadStates(apiFetch, { signal: controller.signal });
                const conversations = [];
                let page = 0;
                let data;
                do {
                    ({ data } = await apiFetch.get("/conversation/user", { signal: controller.signal, params: { page, size: 100 } }));
                    conversations.push(...(data.content ?? []));
                    page++;
                } while (page < (data.totalPages ?? 1));
                const pending = await Promise.all(conversations.filter(c => c.type !== "AI_AGENT").map(async conversation => {
                    const messages = [];
                    let page = 0;
                    let more = true;
                    while (more) {
                        const { data } = await apiFetch.get(`/message/conversation/${conversation.id}`, {
                            signal: controller.signal, params: { page, size: 100, sort: "id,desc" },
                        });
                        const batch = data.content ?? [];
                        for (const message of batch) {
                            if (isMessageRead(readStates, conversation.id, message)) { more = false; break; }
                            if (String(message.user_id ?? message.userId) !== String(userId)) messages.push(message);
                        }
                        page++;
                        more = more && batch.length > 0 && page < (data.totalPages ?? 1);
                    }
                    return { id: conversation.id, count: messages.length,
                        name: conversation.participants?.filter(p => String(p.id) !== String(userId)).map(p => p.name).join(", ") || "Conversación",
                        latest: messages[0] };
                }));
                if (!controller.signal.aborted) {
                    setItems(pending.filter(item => item.count && !isMessageRead(readStates, item.id, item.latest)).sort((a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt)));
                    setError("");
                }
            } catch {
                if (!controller.signal.aborted) setError("No se pudieron cargar las notificaciones.");
            } finally {
                running = false;
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        function onRead() { setRevision(value => value + 1); }
        refresh();
        const timer = window.setInterval(refresh, 30000);
        window.addEventListener("focus", refresh);
        window.addEventListener("journet:chat-read", onRead);
        return () => {
            controller.abort();
            window.clearInterval(timer);
            window.removeEventListener("focus", refresh);
            window.removeEventListener("journet:chat-read", onRead);
        };
    }, [userId, revision]);

    async function markAllRead() {
        try {
            await Promise.all(items.map(item => markMessagesRead(apiFetch, item.id, [item.latest])));
            setItems([]);
            window.dispatchEvent(new Event("journet:chat-read"));
        } catch { setError("No se pudo guardar el estado de lectura en el servidor."); }
    }
    const count = items.reduce((total, item) => total + item.count, 0);
    return (
        <DropdownMenu onOpenChange={open => { if (open) setRevision(value => value + 1); }}>
            <DropdownMenuTrigger render={<button type="button" aria-label={`Notificaciones, ${count} mensajes sin leer`} className="relative p-2 sm:p-2.5 rounded-xl text-white hover:bg-white/10 cursor-pointer border border-white/10">
                <Bell className="size-5" />
                {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-blue-500 px-1.5 text-xs text-white">{count > 99 ? "99+" : count}</span>}
            </button>} />
            <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)] border border-white/10 bg-[#252525] text-white">
                <p className="px-3 py-2 font-semibold">Notificaciones</p>
                {loading ? <p className="p-3 text-sm text-slate-300" role="status">Cargando notificaciones...</p> : error ? <>
                    <p className="p-3 text-sm text-red-300" role="alert">{error}</p>
                    <DropdownMenuItem onClick={() => setRevision(value => value + 1)}>Reintentar</DropdownMenuItem>
                </> : items.length === 0 ? <p className="p-3 text-sm text-slate-300">No tienes mensajes pendientes.</p> : <>
                    <DropdownMenuItem onClick={markAllRead} className="cursor-pointer text-blue-300 focus:bg-white/10 focus:text-white"><CheckCheck /> Marcar todas como leídas</DropdownMenuItem>
                    {items.map(item => <DropdownMenuItem key={item.id} onClick={() => navigate(`/chat?conversation=${item.id}`)} className="flex-col items-start gap-1 p-3 cursor-pointer focus:bg-white/10 focus:text-white">
                        <span className="font-medium">{item.name} · {item.count} sin leer</span>
                        <span className="line-clamp-2 break-all text-sm text-slate-300">{item.latest.content}</span>
                        <time className="text-xs text-slate-400" dateTime={item.latest.createdAt}>{formatMessageTime(item.latest.createdAt, true)}</time>
                    </DropdownMenuItem>)}
                </>}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
