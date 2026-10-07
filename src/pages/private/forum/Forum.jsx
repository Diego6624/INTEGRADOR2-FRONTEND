import { useCallback, useEffect, useMemo, useState } from "react";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import apiFetch from "@/lib/apiClient";
import ForumComposerDialog from "./components/ForumComposerDialog";
import ForumHeader from "./components/ForumHeader";
import ForumPostList from "./components/ForumPostList";
import ForumSidebar from "./components/ForumSidebar";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 100;

function sortByVotes(posts) {
  return [...posts].sort((first, second) =>
    (second.votesCount ?? 0) - (first.votesCount ?? 0)
    || new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}

function getApiError(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || fallback;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handler = (event) => setIsDesktop(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export default function Forum() {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [sort, setSort] = useState("createdAt,desc");
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [postDraft, setPostDraft] = useState({ title: "", content: "", tagIds: [] });
  const [engagementError, setEngagementError] = useState("");
  const [votingPostIds, setVotingPostIds] = useState(() => new Set());

  const loadForum = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [postResponse, tagResponse] = await Promise.all([
        apiFetch.get("/post", { params: { page: 0, size: PAGE_SIZE, sort } }),
        apiFetch.get("/tag", { params: { page: 0, size: PAGE_SIZE, sort: "name,asc" } }),
      ]);
      const postItems = postResponse.data.content ?? [];
      const userIds = [...new Set(postItems.map((post) => post.userId).filter(Boolean))];
      const userResults = await Promise.all(userIds.map((id) => apiFetch.get(`/user/${id}`)));
      const namesById = new Map(userIds.map((id, index) => [id, userResults[index].data.name]));
      setPosts(postItems.map((post) => ({ ...post, authorName: namesById.get(post.userId) })));
      setTags(tagResponse.data.content ?? []);
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo cargar el foro."));
    } finally {
      setLoading(false);
    }
  }, [sort]);

  useEffect(() => {
    // The request owns loading/error state and runs when its sort changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadForum();
  }, [loadForum]);

  const visiblePosts = useMemo(
    () => selectedTag === null ? posts : posts.filter((post) => post.tags?.some((tag) => tag.id === selectedTag)),
    [posts, selectedTag]
  );

  function toggleDraftTag(tagId) {
    setPostDraft((draft) => ({
      ...draft,
      tagIds: draft.tagIds.includes(tagId)
        ? draft.tagIds.filter((id) => id !== tagId)
        : [...draft.tagIds, tagId],
    }));
  }

  async function savePost(event) {
    event.preventDefault();
    setSavingPost(true);
    setError("");
    try {
      await apiFetch.post("/post", postDraft);
      setShowComposer(false);
      setPostDraft({ title: "", content: "", tagIds: [] });
      await loadForum();
    } catch (requestError) {
      setError(getApiError(requestError, "No se pudo publicar el tema."));
    } finally {
      setSavingPost(false);
    }
  }

  async function togglePostVote(post) {
    setVotingPostIds((ids) => new Set(ids).add(post.id));
    setEngagementError("");
    try {
      const request = post.votedByCurrentUser
        ? apiFetch.delete(`/post/${post.id}/vote`)
        : apiFetch.post(`/post/${post.id}/vote`);
      const { data } = await request;

      setPosts((items) => {
        const updated = items.map((item) => item.id === post.id
          ? { ...item, votesCount: data.votesCount, votedByCurrentUser: data.votedByCurrentUser }
          : item
        );
        return sort === "votesCount,desc" ? sortByVotes(updated) : updated;
      });
    } catch (requestError) {
      setEngagementError(getApiError(requestError, "No se pudo guardar tu voto."));
    } finally {
      setVotingPostIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(post.id);
        return nextIds;
      });
    }
  }

  const mainContent = (
    <section className="flex h-full min-h-0 w-full flex-col gap-2">
      <div className="shrink-0">
        <ForumHeader
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          sort={sort}
          setSort={setSort}
          loading={loading}
          onCreate={() => {
            setError("");
            setPostDraft({ title: "", content: "", tagIds: [] });
            setShowComposer(true);
          }}
        />
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        <ForumPostList
          posts={visiblePosts}
          loading={loading}
          error={error}
          actionError={engagementError}
          votingPostIds={votingPostIds}
          onRetry={loadForum}
          onOpenPost={(id) => navigate(`/forum/${id}`)}
          onToggleVote={togglePostVote}
        />
      </div>
    </section>
  );

  return (
    <>
      {isDesktop ? (
        <div className="h-[calc(100vh-10rem)] min-h-[560px] w-full">
          <ResizablePanelGroup orientation="horizontal" className="h-full min-h-0">
            <ResizablePanel defaultSize="75%" className="min-h-0">
              {mainContent}
            </ResizablePanel>
            <ResizablePanel defaultSize="25%" className="min-h-0">
              <ForumSidebar fillHeight />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <section className="flex w-full flex-col gap-2">
            <ForumHeader
              tags={tags}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              sort={sort}
              setSort={setSort}
              loading={loading}
              onCreate={() => {
                setError("");
                setPostDraft({ title: "", content: "", tagIds: [] });
                setShowComposer(true);
              }}
            />
            <ForumPostList
              posts={visiblePosts}
              loading={loading}
              error={error}
              actionError={engagementError}
              votingPostIds={votingPostIds}
              onRetry={loadForum}
              onOpenPost={(id) => navigate(`/forum/${id}`)}
              onToggleVote={togglePostVote}
            />
          </section>
          <ForumSidebar />
        </div>
      )}

      <ForumComposerDialog
        open={showComposer}
        error={error}
        saving={savingPost}
        tags={tags}
        draft={postDraft}
        onDraftChange={setPostDraft}
        onToggleTag={toggleDraftTag}
        onClose={() => {
          setShowComposer(false);
          setError("");
        }}
        onSubmit={savePost}
      />
    </>
  );
}
