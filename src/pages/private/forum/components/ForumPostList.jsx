import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ArrowBigUp, Eye, MessagesSquare } from "lucide-react";
import ForumPostSkeleton from "./ForumPostSkeleton";

function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ForumPostList({
  posts,
  loading,
  error,
  actionError,
  votingPostIds,
  onRetry,
  onOpenPost,
  onToggleVote,
}) {
  if (loading) {
    return (
      <div aria-label="Cargando publicaciones" aria-busy="true" className="space-y-2">
        {Array.from({ length: 4 }, (_, index) => <ForumPostSkeleton key={index} />)}
      </div>
    );
  }
  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-300/20 bg-black/70 p-5 text-sm text-rose-200">
        <p>{error}</p>
        <button type="button" onClick={onRetry} className="mt-2 underline">Reintentar</button>
      </div>
    );
  }
  if (!posts.length) return <p className="rounded-2xl border border-white/10 bg-black/70 p-6 text-sm text-slate-300">No hay publicaciones para mostrar.</p>;

  return (
    <div className="space-y-2">
      {actionError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-black/70 px-4 py-2 text-sm text-rose-200">{actionError}</p>}
      {posts.map((post) => (
        <Item key={post.id} variant="outline" className="border border-white/10 bg-black/70 backdrop-blur-xl">
          <ItemMedia className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => onToggleVote(post)}
              disabled={votingPostIds.has(post.id)}
              aria-label={post.votedByCurrentUser ? "Quitar voto a la publicación" : "Votar la publicación"}
              aria-pressed={post.votedByCurrentUser}
              className={`flex flex-col items-center rounded-md px-1 transition-colors disabled:cursor-wait disabled:opacity-60 ${post.votedByCurrentUser ? "text-[#9388ff]" : "text-slate-300 hover:text-[#9388ff]"}`}
            >
              <ArrowBigUp className="size-6" />
              <span className="text-sm">{post.votesCount ?? 0}</span>
            </button>
          </ItemMedia>
          <ItemContent>
            <div className="flex flex-row flex-wrap gap-2">
              {(post.tags ?? []).map((tag) => <Badge key={tag.id} variant="secondary" className={"cursor-default"}>{tag.name}</Badge>)}
            </div>
            <button type="button" onClick={() => onOpenPost(post.id)} className="cursor-pointer text-left transition hover:text-sky-200">
              <ItemTitle className="text-base font-semibold transition hover:text-sky-200 sm:text-lg">{post.title}</ItemTitle>
            </button>
            <ItemDescription className="line-clamp-3 text-sm">{post.content}</ItemDescription>
            <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-6 md:pt-1.5">
              <div className="flex items-center gap-2">
                <Avatar className="size-8 bg-blue-500 text-white sm:size-10">
                  <AvatarFallback className="bg-blue-500 text-white">{getInitials(post.authorName)}</AvatarFallback>
                </Avatar>
                <span className="text-sm sm:text-base cursor-default">{post.authorName || `Usuario #${post.userId}`}</span>
              </div>
              <time className="text-xs text-slate-300 sm:text-sm cursor-default">{formatDate(post.createdAt)}</time>
              <div className="flex items-center gap-2">
                <MessagesSquare className="size-4 sm:size-5" />
                <span className="text-sm sm:text-base cursor-default">{post.commentsCount ?? 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="size-4 sm:size-5" />
                <span className="text-sm sm:text-base cursor-default">{post.views ?? 0}</span>
              </div>
            </div>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
