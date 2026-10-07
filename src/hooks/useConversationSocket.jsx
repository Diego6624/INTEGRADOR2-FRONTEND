import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

export function useConversationSocket(conversationId, onNewMessage, onTypingStatus) {
    const onNewMessageRef = useRef(onNewMessage);
    const onTypingStatusRef = useRef(onTypingStatus);
    const conversationIds = Array.isArray(conversationId) ? conversationId : [conversationId];
    const subscriptionKey = conversationIds.filter(Boolean).join(",");

    useEffect(() => {
        onNewMessageRef.current = onNewMessage;
    }, [onNewMessage]);

    useEffect(() => {
        onTypingStatusRef.current = onTypingStatus;
    }, [onTypingStatus]);

    useEffect(() => {
        if (!subscriptionKey) return;

        const socketUrl = new URL("/ws", import.meta.env.VITE_API_URL || window.location.origin);

        const client = new Client({
            webSocketFactory: () => new SockJS(socketUrl.toString(), null, {
                transports: ['xhr-streaming', 'xhr-polling'],
                transportOptions: {
                    'xhr-streaming': { withCredentials: true },
                    'xhr-polling': { withCredentials: true }
                }
            }),
            onConnect: () => {
                subscriptionKey.split(",").forEach((id) => {
                    client.subscribe(`/topic/conversation/${id}`, (message) => {
                        try {
                            onNewMessageRef.current(JSON.parse(message.body));
                        } catch (error) {
                            console.error("No se pudo procesar el mensaje recibido:", error);
                        }
                    });
                    client.subscribe(`/topic/conversation/${id}/typing`, (message) => {
                        try {
                            onTypingStatusRef.current?.(JSON.parse(message.body));
                        } catch (error) {
                            console.error("No se pudo procesar el estado de escritura:", error);
                        }
                    });
                });
            },
            onStompError: (frame) => {
                console.error('Error STOMP: ', frame)
            }
        })
        client.activate()
        return () => client.deactivate()
    }, [subscriptionKey])
}