import ChatSidebar from "./components/ChatSidebar";
import ConversationPanel from "./components/ConversationPanel";
import NewChatDialog from "./components/NewChatDialog";
import useChats from "./hooks/useChats";

export default function ChatsPage() {
  const chat = useChats();

  function handleBackToList() {
    chat.stopTyping();
    chat.setMessages([]);
    chat.setSelectedId(null);
  }

  return (
    <div
      className="relative h-[74vh] min-h-[420px] w-full overflow-hidden rounded-[28px] border border-white/10 shadow-[0_25px_80px_rgba(3,8,18,0.76)]"
      style={{
        background: "rgba(6, 10, 18, 0.74)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 15% 0%, rgba(80, 122, 255, 0.12), transparent 28%), radial-gradient(circle at 100% 100%, rgba(51, 172, 255, 0.08), transparent 26%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col md:grid md:grid-cols-[290px_minmax(0,1fr)]">
        <ChatSidebar
          conversations={chat.conversations}
          currentUserId={chat.currentUserId}
          selectedId={chat.selectedId}
          unreadCounts={chat.unreadCounts}
          loading={chat.loading}
          error={chat.error}
          onSelect={chat.selectConversation}
          onNewChat={chat.openNewChat}
          onRetry={chat.loadConversations}
        />
        <ConversationPanel
          conversationId={chat.selectedId}
          conversationsLoading={chat.loading}
          conversationType={chat.selectedConversation?.type}
          activeName={chat.activeName}
          currentUserId={chat.currentUserId}
          messages={chat.messages}
          typingUser={chat.typingUser}
          loadingMessages={chat.loadingMessages}
          actionError={chat.actionError}
          draft={chat.draft}
          sending={chat.sending}
          onBack={handleBackToList}
          onDraftChange={chat.handleDraftChange}
          onStopTyping={() => chat.stopTyping()}
          onSend={chat.sendMessage}
        />
      </div>

      <NewChatDialog
        open={chat.showNewChat}
        users={chat.users}
        search={chat.search}
        loading={chat.loadingUsers}
        error={chat.actionError}
        onSearchChange={chat.setSearch}
        onSelectUser={chat.createConversation}
        onClose={() => chat.setShowNewChat(false)}
      />
    </div>
  );
}
