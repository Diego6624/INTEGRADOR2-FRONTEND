import { useCallback, useEffect, useRef, useState } from "react";
import apiFetch from "@/lib/apiClient";
import { useConversationSocket } from "@/hooks/useConversationSocket";

const PAGE_SIZE = 100;

function readMarkerKey(userId, conversationId) {
  return `journet:chat:last-read:${userId}:${conversationId}`;
}

function saveReadMarker(userId, conversationId) {
  window.localStorage.setItem(readMarkerKey(userId, conversationId), String(Date.now()));
}

function getApiError(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || fallback;
}

function normalizeMessage(message) {
  return {
    ...message,
    conversation_id: message.conversation_id ?? message.conversationId,
    user_id: message.user_id ?? message.userId,
  };
}

function sortByCreatedAt(messages) {
  return messages.sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt));
}

export default function useChats() {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const typingTimerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingActiveRef = useRef(false);
  const currentUserId = currentUser?.id;
  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId);

  const handleRealtimeMessage = useCallback((message) => {
    if (!message?.id) return;
    const normalizedMessage = normalizeMessage(message);
    if (!normalizedMessage.conversation_id) return;

    if (Number(normalizedMessage.conversation_id) === Number(selectedId)) {
      setMessages((previous) => previous.some((item) => item.id === normalizedMessage.id)
        ? previous
        : sortByCreatedAt([...previous, normalizedMessage]));
      if (currentUserId) {
        setUnreadCounts((counts) => ({ ...counts, [normalizedMessage.conversation_id]: 0 }));
        saveReadMarker(currentUserId, normalizedMessage.conversation_id);
      }
      return;
    }

    if (normalizedMessage.user_id !== currentUserId) {
      setUnreadCounts((counts) => ({
        ...counts,
        [normalizedMessage.conversation_id]: (counts[normalizedMessage.conversation_id] ?? 0) + 1,
      }));
    }
  }, [currentUserId, selectedId]);

  const handleTypingStatus = useCallback((status) => {
    if (Number(status.conversationId) !== Number(selectedId) || status.userId === currentUserId) return;

    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
    if (status.typing) {
      setTypingUser(status.userName || "Alguien");
      typingTimeoutRef.current = window.setTimeout(() => setTypingUser(""), 2500);
    } else {
      setTypingUser("");
    }
  }, [currentUserId, selectedId]);

  const conversationIds = conversations.map((conversation) => conversation.id);
  useConversationSocket(conversationIds, handleRealtimeMessage, handleTypingStatus);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [userResponse, conversationResponse] = await Promise.all([
        apiFetch.get("/me"),
        apiFetch.get("/conversation/user", { params: { page: 0, size: PAGE_SIZE, sort: "createdAt,desc" } }),
      ]);
      setCurrentUser(userResponse.data);
      const loadedConversations = conversationResponse.data.content ?? [];
      const latestAiConversation = loadedConversations
        .filter((conversation) => conversation.type === "AI_AGENT")
        .reduce((latest, conversation) => (
          !latest || new Date(conversation.createdAt) > new Date(latest.createdAt)
            ? conversation
            : latest
        ), null);
      const visibleConversations = loadedConversations
        .filter((conversation) => conversation.type !== "AI_AGENT");
      if (latestAiConversation) visibleConversations.push(latestAiConversation);
      visibleConversations.sort((first, second) =>
        new Date(second.createdAt) - new Date(first.createdAt)
      );

      const unreadEntries = await Promise.all(visibleConversations.map(async (conversation) => {
        const markerValue = window.localStorage.getItem(readMarkerKey(userResponse.data.id, conversation.id));
        const lastReadAt = markerValue ? Number(markerValue) : null;
        let page = 0;
        let unreadCount = 0;
        let hasMore = true;

        while (hasMore) {
          const { data } = await apiFetch.get(`/message/conversation/${conversation.id}`, {
            params: { page, size: PAGE_SIZE, sort: "createdAt,desc" },
          });
          const pageMessages = data.content ?? [];

          for (const message of pageMessages) {
            const createdAt = new Date(message.createdAt).getTime();
            if (lastReadAt !== null && createdAt <= lastReadAt) {
              hasMore = false;
              break;
            }
            if ((message.user_id ?? message.userId) !== userResponse.data.id) {
              unreadCount += 1;
            }
          }

          if (pageMessages.length < PAGE_SIZE || page + 1 >= (data.totalPages ?? 1)) {
            hasMore = false;
          } else if (hasMore) {
            page += 1;
          }
        }

        return [conversation.id, unreadCount];
      }));

      setUnreadCounts(Object.fromEntries(unreadEntries));
      setConversations(visibleConversations);
      setSelectedId((previousId) => visibleConversations.some((conversation) => conversation.id === previousId)
        ? previousId
        : null);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudieron cargar tus conversaciones."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // The request owns loading/error state and runs once when the page mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedId || !currentUser) return;

    let cancelled = false;
    async function loadMessages() {
      setLoadingMessages(true);
      setActionError("");
      try {
        const response = await apiFetch.get(`/message/conversation/${selectedId}`, {
          params: { page: 0, size: PAGE_SIZE, sort: "createdAt,asc" },
        });
        if (!cancelled) setMessages((response.data.content ?? []).map(normalizeMessage));
      } catch (requestError) {
        if (!cancelled) {
          setMessages([]);
          setActionError(getApiError(requestError, "No se pudieron cargar los mensajes."));
        }
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    }
    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [selectedId, currentUser]);

  const stopTyping = useCallback((conversationId = selectedId) => {
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
    if (!typingActiveRef.current || !conversationId) return;

    typingActiveRef.current = false;
    apiFetch.post(`/conversation/${conversationId}/typing`, { typing: false })
      .catch((requestError) => {
        console.error("No se pudo actualizar el estado de escritura:", requestError);
      });
  }, [selectedId]);

  const selectConversation = useCallback((conversationId) => {
    stopTyping();
    setMessages([]);
    setSelectedId(conversationId);
    setTypingUser("");
    setUnreadCounts((counts) => ({ ...counts, [conversationId]: 0 }));
    if (currentUserId) saveReadMarker(currentUserId, conversationId);
  }, [currentUserId, stopTyping]);

  const handleDraftChange = useCallback((value) => {
    setDraft(value);
    if (!selectedId || !value.trim()) {
      stopTyping();
      return;
    }

    if (!typingActiveRef.current) {
      typingActiveRef.current = true;
      apiFetch.post(`/conversation/${selectedId}/typing`, { typing: true })
        .catch((requestError) => {
          console.error("No se pudo actualizar el estado de escritura:", requestError);
        });
    }

    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = window.setTimeout(() => stopTyping(selectedId), 1500);
  }, [selectedId, stopTyping]);

  useEffect(() => () => {
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current);
  }, []);

  const openNewChat = useCallback(async () => {
    setShowNewChat(true);
    setSearch("");
    setActionError("");
    if (users.length) return;

    setLoadingUsers(true);
    try {
      const response = await apiFetch.get("/user", { params: { page: 0, size: PAGE_SIZE, sort: "name,asc" } });
      setUsers((response.data.content ?? []).filter((user) => user.id !== currentUserId));
    } catch (requestError) {
      setActionError(getApiError(requestError, "No se pudo cargar la lista de usuarios."));
    } finally {
      setLoadingUsers(false);
    }
  }, [currentUserId, users.length]);

  const createConversation = useCallback(async (participant) => {
    setActionError("");
    try {
      const response = await apiFetch.post("/conversation", {
        type: "DIRECT",
        participantId: participant.id,
      });
      const conversation = { ...response.data, otherUser: participant };
      setConversations((items) => [conversation, ...items.filter((item) => item.id !== conversation.id)]);
      setUnreadCounts((counts) => ({ ...counts, [conversation.id]: 0 }));
      setShowNewChat(false);
      selectConversation(conversation.id);
    } catch (requestError) {
      setActionError(getApiError(requestError, "No se pudo iniciar la conversación."));
    }
  }, [selectConversation]);

  const sendMessage = useCallback(async (event) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !selectedId || sending) return;

    stopTyping(selectedId);
    setSending(true);
    setActionError("");
    try {
      const response = await apiFetch.post("/message", {
        content,
        conversation_id: selectedId,
      });
      const message = normalizeMessage(response.data);
      setMessages((previous) => previous.some((item) => item.id === message.id)
        ? previous
        : sortByCreatedAt([...previous, message]));
      setDraft("");
    } catch (requestError) {
      setActionError(getApiError(requestError, "No se pudo enviar el mensaje."));
    } finally {
      setSending(false);
    }
  }, [draft, selectedId, sending, stopTyping]);

  const selectedName = selectedConversation?.type === "AI_AGENT"
    ? "Agente IA"
    : selectedConversation?.participants?.find((participant) => participant.id !== currentUserId)?.name
      || selectedConversation?.otherUser?.name
      || `Conversación #${selectedId ?? ""}`;

  return {
    currentUserId,
    conversations,
    unreadCounts,
    selectedId,
    selectedConversation,
    activeName: selectedName,
    messages,
    typingUser,
    draft,
    loading,
    loadingMessages,
    sending,
    loadingUsers,
    showNewChat,
    search,
    error,
    actionError,
    users,
    selectConversation,
    loadConversations,
    openNewChat,
    createConversation,
    sendMessage,
    handleDraftChange,
    stopTyping,
    setSearch,
    setShowNewChat,
    setSelectedId,
    setMessages,
  };
}
