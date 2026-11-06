import { useQuery } from "@tanstack/react-query";
import { fetchPosts, ApiError } from "@/api/posts";
import { readLocalPosts } from "@/api/localPosts";
import type { AnyPost } from "@/types/post";

export const POSTS_KEY = ["posts"] as const;
export const LOCAL_POSTS_KEY = ["local-posts"] as const;

/**
 * Remote posts + the ones created in this browser, as one list.
 * Local posts live in their own cache entry (backed by localStorage) so a
 * refetch of the API never wipes them.
 */
export function usePosts() {
  const remote = useQuery({
    queryKey: POSTS_KEY,
    queryFn: ({ signal }) => fetchPosts(signal),
    staleTime: 5 * 60 * 1000,
    // Retrying a 4xx or a malformed response won't help; network/5xx might.
    retry: (count, error) =>
      count < 1 && !(error instanceof ApiError && ["client", "invalid"].includes(error.kind)),
  });

  const local = useQuery({
    queryKey: LOCAL_POSTS_KEY,
    queryFn: readLocalPosts,
    staleTime: Infinity,
    initialData: readLocalPosts,
  });

  const posts: AnyPost[] = [...local.data, ...(remote.data ?? [])];

  return {
    posts,
    isLoading: remote.isPending,
    isError: remote.isError,
    error: remote.error,
    /** A refetch failed but we still have posts to show. */
    isStale: remote.isError && remote.data !== undefined,
    isFetching: remote.isFetching,
    refetch: remote.refetch,
  };
}
