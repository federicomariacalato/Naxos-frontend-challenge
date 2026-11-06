import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as m from "motion/react-m";
import { Plus } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useUrlState } from "@/hooks/useUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { filterAndSort, paginate } from "@/lib/postsView";
import { Toolbar } from "@/components/Toolbar";
import { PostRow } from "@/components/PostRow";
import { PostSkeleton } from "@/components/PostSkeleton";
import { Pagination } from "@/components/Pagination";
import { ErrorState, NoPosts, NoResults, StaleBanner } from "@/components/StateMessages";
import { NewPostDialog } from "@/components/NewPostDialog";
import { Toast } from "@/components/Toast";

export default function App() {
  const { posts, isLoading, isError, error, isStale, isFetching, refetch } = usePosts();
  const [view, setView] = useUrlState();

  // The input updates instantly; the list filters after a short pause.
  const [draftQuery, setDraftQuery] = useState(view.q);
  const debouncedQuery = useDebouncedValue(draftQuery, 250);
  useEffect(() => setView({ q: debouncedQuery }), [debouncedQuery, setView]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);
  const listTop = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => filterAndSort(posts, view.q, view.sort),
    [posts, view.q, view.sort],
  );
  const { items, page, totalPages } = paginate(filtered, view.page);
  const localCount = posts.filter((p) => p.local).length;

  const goToPage = (next: number) => {
    setView({ page: next });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listTop.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const clearSearch = () => {
    setDraftQuery("");
    setView({ q: "" });
  };

  const handleCreated = () => {
    // Make sure the new post is visible: newest first, no filter, page 1.
    setDraftQuery("");
    setView({ q: "", sort: "newest", page: 1 });
    setDialogOpen(false);
    setToast("Post pubblicato. Lo trovi in cima alla lista.");
    window.scrollTo({ top: 0 });
  };

  const searching = view.q.trim() !== "";
  const showList = !isLoading && (!isError || isStale);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 pb-24 sm:px-6 sm:pt-16">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">Redazione</h1>
          <p className="mt-3 text-mute" aria-live="polite">
            {isLoading
              ? "Sto caricando i post…"
              : showList
                ? `${posts.length} post in archivio${
                    localCount ? `, ${localCount === 1 ? "1 scritto da te" : `${localCount} scritti da te`}` : ""
                  }.`
                : "Non è stato possibile caricare l'archivio."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-5 font-semibold text-white hover:bg-accent-deep"
        >
          <Plus aria-hidden className="size-5" />
          Nuovo post
        </button>
      </header>

      <div className="mt-8">
        <Toolbar
          query={draftQuery}
          onQueryChange={setDraftQuery}
          sort={view.sort}
          onSortChange={(sort) => setView({ sort })}
        />
      </div>

      <main ref={listTop} className="mt-6 scroll-mt-4">
        {isLoading && <PostSkeleton />}

        {isError && !isStale && (
          <ErrorState error={error} retrying={isFetching} onRetry={() => void refetch()} />
        )}

        {showList && (
          <>
            {isStale && <StaleBanner retrying={isFetching} onRetry={() => void refetch()} />}

            {searching && (
              <p className="mb-1 text-sm text-mute" aria-live="polite">
                {filtered.length === 0
                  ? "Nessun risultato."
                  : `${filtered.length} ${filtered.length === 1 ? "risultato" : "risultati"} per «${view.q.trim()}»`}
              </p>
            )}

            {posts.length === 0 ? (
              <NoPosts onCreate={() => setDialogOpen(true)} />
            ) : filtered.length === 0 ? (
              <NoResults query={view.q} onClear={clearSearch} />
            ) : (
              <>
                <m.div
                  key={`${view.q}|${view.sort}|${page}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  {items.map((post) => (
                    <PostRow key={`${post.local ? "l" : "r"}-${post.id}`} post={post} query={view.q} />
                  ))}
                </m.div>
                <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
              </>
            )}
          </>
        )}
      </main>

      <NewPostDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}
