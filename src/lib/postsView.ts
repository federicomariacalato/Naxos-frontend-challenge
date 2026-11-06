import { normalize } from "./text";
import type { AnyPost } from "@/types/post";

export const SORT_OPTIONS = [
  { value: "newest", label: "Più recenti" },
  { value: "oldest", label: "Meno recenti" },
  { value: "title-asc", label: "Titolo, dalla A alla Z" },
  { value: "title-desc", label: "Titolo, dalla Z alla A" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];
export const DEFAULT_SORT: SortKey = "newest";
export const PAGE_SIZE = 10;

export function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((o) => o.value === value);
}

const collator = new Intl.Collator("it", { sensitivity: "base" });

/** Search (title + body) then sort. Pure, so it's easy to test. */
export function filterAndSort(posts: AnyPost[], query: string, sort: SortKey): AnyPost[] {
  const q = normalize(query.trim());
  const filtered = q
    ? posts.filter((p) => normalize(p.title).includes(q) || normalize(p.body).includes(q))
    : posts;

  const sorted = [...filtered];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    case "oldest":
      return sorted.sort((a, b) => a.id - b.id);
    case "title-asc":
      return sorted.sort((a, b) => collator.compare(a.title, b.title));
    case "title-desc":
      return sorted.sort((a, b) => collator.compare(b.title, a.title));
  }
}

export function paginate<T>(items: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * PAGE_SIZE;
  return { items: items.slice(start, start + PAGE_SIZE), page: current, totalPages };
}

/** Page numbers to render, with `null` standing for an ellipsis. */
export function pageWindow(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | null)[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(null);
    result.push(p);
  });
  return result;
}
