import type { LocalPost } from "@/types/post";

const KEY = "redazione.local-posts.v1";

export function readLocalPosts(): LocalPost[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? (data as LocalPost[]) : [];
  } catch {
    return [];
  }
}

export function writeLocalPosts(posts: LocalPost[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(posts));
  } catch {
    // Storage full or blocked (private mode): the post stays in memory for this session.
  }
}
