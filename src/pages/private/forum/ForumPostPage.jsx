import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBigUp,
  ArrowLeft,
  Eye,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiFetch from "@/lib/apiClient";
import ForumComposerDialog from "./components/ForumComposerDialog";

function getApiError(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || fallback;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function getInitials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
}

export default function ForumPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentDraft, setCommentDraft] = useState("");
  const [savingComment, setSavingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "", tagIds: [] });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadPost = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await apiFetch.post(`/post/${id}/view`);
      const [{ data }, { data: user }, { data: categoryPage }] = await Promise.all([
        apiFetch.get(`/post/${id}`),
        apiFetch.get("/me"),
        apiFetch.get("/tag", { params: { page: 0, size: 100, sort: "name,asc" } }),
      ]);
      const comments = data.comments ?? [];
      const commenterIds = [...new Set(comments.map((comment) => comment.user_id).filter(Boolean))];
      const commenterResponses = await Promise.all(commenterIds.map((userId) => apiFetch.get(`/user/${userId}`)));
      const commenterNames = new Map(commenterIds.map((userId, index) => [userId, commenterResponses[index].data.name]));

      setCurrentUser(user);
      setCategories(categoryPage.content ?? []);
      setPost({
        ...data,
        authorName: data.user?.name,
        comments: comments.map((comment) => ({
          ...comment,
          authorName: commenterNames.get(comment.user_id) || `Usuario #${comment.user_id}`,
        })),
      });
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo cargar la publicación."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Loading and error states are owned by the async request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPost();
  }, [loadPost]);

  const canManagePost = post?.user?.id != null
    && currentUser?.id != null
    && String(post.user.id) === String(currentUser.id);

  function startEditing() {
    setDraft({
      title: post.title,
      content: post.content,
      tagIds: (post.tags ?? []).map((tag) => tag.id),
    });
    setEditError("");
    setShowComposer(true);
  }

  function toggleCategory(tagId) {
    setDraft((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter((selectedId) => selectedId !== tagId)
        : [...current.tagIds, tagId],
    }));
  }

  async function saveEdit(event) {
    event.preventDefault();
    setSavingEdit(true);
    setEditError("");
    try {
      const { data } = await apiFetch.put(`/post/${id}`, draft);
      setPost((current) => ({
        ...current,
        ...data,
        authorName: current.authorName,
        comments: current.comments,
      }));
      setShowComposer(false);
    } catch (requestError) {
      setEditError(getApiError(requestError, "No se pudo guardar la edición."));
    } finally {
      setSavingEdit(false);
    }
  }

  async function deletePost() {
    setDeleting(true);
    setDeleteError("");
    try {
      await apiFetch.delete(`/post/${id}`);
      navigate("/forum", { replace: true });
    } catch (requestError) {
      setDeleteError(getApiError(requestError, "No se pudo eliminar la publicación."));
    } finally {
      setDeleting(false);
    }
  }

  async function toggleVote() {
    if (!post || voting) return;
    setVoting(true);
    setVoteError("");
    try {
      const request = post.votedByCurrentUser
        ? apiFetch.delete(`/post/${id}/vote`)
        : apiFetch.post(`/post/${id}/vote`);
      const { data } = await request;
      setPost((current) => ({
        ...current,
        votesCount: data.votesCount,
        votedByCurrentUser: data.votedByCurrentUser,
      }));
    } catch (requestError) {
      setVoteError(getApiError(requestError, "No se pudo guardar tu voto."));
    } finally {
      setVoting(false);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    const content = commentDraft.trim();
    if (!content || savingComment) return;
    setSavingComment(true);
    setCommentError("");
    try {
      const { data } = await apiFetch.post("/comment", { post_id: post.id, content });
      setPost((current) => ({
        ...current,
        comments: [...current.comments, { ...data, authorName: currentUser?.name || "Tú" }],
      }));
      setCommentDraft("");
    } catch (requestError) {
      setCommentError(getApiError(requestError, "No se pudo publicar la respuesta."));
    } finally {
      setSavingComment(false);
    }
  }

  return (
    <main className="w-full max-w-none space-y-4 py-2">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate("/forum")}
        className="cursor-pointer gap-2 rounded-xl text-slate-200 hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Volver al foro
      </Button>

      {error && (
        <section role="alert" className="rounded-2xl border border-rose-300/20 bg-black/70 p-5 text-rose-200">
          <p>{error}</p>
          <Button type="button" variant="outline" onClick={loadPost} className="mt-3">Reintentar</Button>
        </section>
      )}

      {loading && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="space-y-4 rounded-3xl border border-white/10 bg-black/70 p-5 sm:p-7">
            <Skeleton className="h-8 w-4/5 bg-white/10" />
            <Skeleton className="h-4 w-2/5 bg-white/10" />
            <Skeleton className="h-36 w-full bg-white/10" />
            <Skeleton className="h-20 w-full bg-white/10" />
          </section>
          <Skeleton className="h-48 rounded-3xl bg-white/10" />
        </div>
      )}

      {!loading && post && (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-4">
            <article className="rounded-3xl border border-white/10 bg-black/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-7">
              <header className="mb-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(post.tags ?? []).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="border border-violet-300/20 bg-violet-500/15 text-violet-100">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{post.title}</h1>
                  <p className="mt-3 text-sm text-slate-400">
                    Publicado por <span className="font-medium text-slate-200">{post.authorName}</span>
                    {post.createdAt && <> · {formatDate(post.createdAt)}</>}
                  </p>
                </div>
                {canManagePost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          aria-label="Opciones de la publicación"
                          className="cursor-pointer shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <MoreHorizontal className="size-5" />
                        </button>
                      }
                    />
                    <DropdownMenuContent align="end" className="cursor-pointer w-48 border border-white/10 bg-slate-900 text-slate-100">
                      <DropdownMenuItem onClick={startEditing} className="cursor-pointer focus:bg-white/10">
                        <Pencil className="size-4" />
                        Editar publicación
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setDeleteError("");
                          setConfirmDelete(true);
                        }}
                        className="cursor-pointer text-rose-300 focus:bg-rose-500/10 focus:text-rose-200"
                      >
                        <Trash2 className="size-4" />
                        Eliminar publicación
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </header>

              <div className="whitespace-pre-wrap break-words text-base leading-7 text-slate-100">{post.content}</div>

              <footer className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/10 pt-4 text-sm text-slate-300">
                <button
                  type="button"
                  onClick={toggleVote}
                  disabled={voting}
                  aria-pressed={post.votedByCurrentUser}
                  className={`cursor-pointer inline-flex items-center gap-1.5 transition-colors disabled:opacity-60 ${post.votedByCurrentUser ? "text-violet-300" : "hover:text-violet-300"}`}
                >
                  <ArrowBigUp className="size-5" />
                  {post.votesCount ?? 0} votos
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <MessageSquare className="size-4" />
                  {post.comments?.length ?? 0} respuestas
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="size-4" />
                  {post.views ?? 0} visualizaciones
                </span>
              </footer>
              {voteError && <p role="alert" className="mt-3 text-sm text-rose-200">{voteError}</p>}
            </article>

            <section className="rounded-3xl border border-white/10 bg-black/70 p-5 backdrop-blur-xl sm:p-7">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Respuestas <span className="text-slate-400">({post.comments?.length ?? 0})</span>
              </h2>
              <div className="space-y-3">
                {(post.comments ?? []).map((comment) => (
                  <article key={comment.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                        {getInitials(comment.authorName)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-100">{comment.authorName}</p>
                        <time className="text-xs text-slate-400">{formatDate(comment.createdAt)}</time>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{comment.content}</p>
                  </article>
                ))}
                {!post.comments?.length && <p className="text-sm text-slate-400">Aún no hay respuestas. ¡Sé la primera persona en responder!</p>}
              </div>

              <form onSubmit={submitComment} className="mt-5 space-y-3">
                <label className="block text-sm font-medium text-slate-200" htmlFor="forum-reply">
                  Escribe una respuesta
                </label>
                <textarea
                  id="forum-reply"
                  required
                  rows={4}
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                  placeholder="Comparte tu respuesta con la comunidad..."
                  className="w-full resize-y rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-violet-400/60"
                />
                {commentError && <p role="alert" className="text-sm text-rose-200">{commentError}</p>}
                <div className="flex justify-end">
                  <Button type="submit" disabled={savingComment || !commentDraft.trim()} className="cursor-pointer rounded-xl bg-violet-600 text-white hover:bg-violet-500">
                    {savingComment ? "Enviando..." : "Responder"}
                  </Button>
                </div>
              </form>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-white/10 bg-black/70 p-5 backdrop-blur-xl">
              <h2 className="mb-4 text-lg font-semibold text-white">Estadísticas</h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <MessageSquare className="mx-auto mb-2 size-5 text-sky-300" />
                  <p className="text-lg font-semibold text-white">{post.comments?.length ?? 0}</p>
                  <p className="text-xs text-slate-400">Respuestas</p>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <ArrowBigUp className="mx-auto mb-2 size-5 text-violet-300" />
                  <p className="text-lg font-semibold text-white">{post.votesCount ?? 0}</p>
                  <p className="text-xs text-slate-400">Votos</p>
                </div>
                <div className="rounded-2xl bg-white/[0.04] p-3">
                  <Eye className="mx-auto mb-2 size-5 text-cyan-300" />
                  <p className="text-lg font-semibold text-white">{post.views ?? 0}</p>
                  <p className="text-xs text-slate-400">Vistas</p>
                </div>
              </div>
            </section>
            {(post.tags ?? []).length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-black/70 p-5 backdrop-blur-xl">
                <h2 className="mb-3 text-lg font-semibold text-white">Categorías</h2>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="border border-violet-300/20 bg-violet-500/15 text-violet-100">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <section role="alertdialog" aria-modal="true" aria-labelledby="delete-post-title" className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <h2 id="delete-post-title" className="text-lg font-semibold text-white">¿Eliminar publicación?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Esta acción eliminará la publicación y sus respuestas. No se puede deshacer.</p>
            {deleteError && <p role="alert" className="mt-3 text-sm text-rose-200">{deleteError}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" disabled={deleting} onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button type="button" disabled={deleting} onClick={deletePost} className="bg-rose-600 text-white hover:bg-rose-500">
                {deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </section>
        </div>
      )}

      <ForumComposerDialog
        open={showComposer}
        mode="edit"
        error={editError}
        saving={savingEdit}
        tags={categories}
        draft={draft}
        onDraftChange={setDraft}
        onToggleTag={toggleCategory}
        onClose={() => setShowComposer(false)}
        onSubmit={saveEdit}
      />
    </main>
  );
}
