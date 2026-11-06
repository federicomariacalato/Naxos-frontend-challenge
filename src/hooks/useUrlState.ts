import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SORT, isSortKey, type SortKey } from "@/lib/postsView";

export type ViewState = { q: string; sort: SortKey; page: number };

function read(): ViewState {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get("sort");
  const page = Number(params.get("page"));
  return {
    q: params.get("q") ?? "",
    sort: isSortKey(sort) ? sort : DEFAULT_SORT,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

/**
 * Search, sort and page live in the URL, so a refresh or a shared link
 * lands on the same view. Other params (like ?simulate=) are left alone.
 */
export function useUrlState() {
  const [state, setState] = useState<ViewState>(read);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const set = (key: string, value: string, isDefault: boolean) =>
      isDefault ? params.delete(key) : params.set(key, value);
    set("q", state.q, state.q === "");
    set("sort", state.sort, state.sort === DEFAULT_SORT);
    set("page", String(state.page), state.page === 1);
    const search = params.toString();
    const url = `${window.location.pathname}${search ? `?${search}` : ""}`;
    window.history.replaceState(null, "", url);
  }, [state]);

  const update = useCallback((patch: Partial<ViewState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      // Changing the query or the sort sends you back to page 1 (only if it really changed).
      const filtersChanged = next.q !== prev.q || next.sort !== prev.sort;
      return { ...next, page: patch.page ?? (filtersChanged ? 1 : prev.page) };
    });
  }, []);

  return [state, update] as const;
}
