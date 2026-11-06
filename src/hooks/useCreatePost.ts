import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/posts";
import { writeLocalPosts } from "@/api/localPosts";
import { LOCAL_POSTS_KEY, POSTS_KEY } from "./usePosts";
import type { LocalPost, NewPostInput, Post } from "@/types/post";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: NewPostInput): Promise<LocalPost> => {
      await createPost(input);

      const local = queryClient.getQueryData<LocalPost[]>(LOCAL_POSTS_KEY) ?? [];
      const remote = queryClient.getQueryData<Post[]>(POSTS_KEY) ?? [];

      // The API answers id 101 every time, so we mint our own unique id.
      const id = Math.max(0, ...local.map((p) => p.id), ...remote.map((p) => p.id)) + 1;
      const created: LocalPost = {
        id,
        userId: input.userId,
        title: input.title.trim(),
        body: input.body.trim(),
        local: true,
      };

      const next = [created, ...local];
      writeLocalPosts(next);
      queryClient.setQueryData(LOCAL_POSTS_KEY, next);
      return created;
    },
  });
}
