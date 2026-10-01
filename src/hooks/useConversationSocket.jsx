import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

export function useConversationSocket(conversationId, onNewMessage) {
    useEffect(() => {

        if (!conversationId) return 

        const client = new Client({
            webSocketFactory: () => new SockJS('https://journet-backend.onrender.com/ws', null, {
                transports: ['xhr-streaming', 'xhr-polling'],
                transportOptions: {
                    'xhr-streaming': { withCredentials: true },
                    'xhr-polling': { withCredentials: true }
                }
            }),
            onConnect: () => {
                client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    console.log(newMessage)
                    onNewMessage(newMessage);
                })
            },
            onStompError: (frame) => {
                console.error('Error STOMP: ',frame)
            }
        })
        client.activate()
        return () => client.deactivate()
    }, [conversationId])
}