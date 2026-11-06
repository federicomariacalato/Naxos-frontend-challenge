import { ChevronDown, Search, X } from "lucide-react";
import { SORT_OPTIONS, type SortKey } from "@/lib/postsView";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
};

export function Toolbar({ query, onQueryChange, sort, onSortChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">
          Cerca nei post
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-mute"
        />
        <input
          id="search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cerca nei titoli e nei testi"
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-line bg-raised pr-11 pl-12 text-base placeholder:text-mute/80 hover:border-mute/50 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Cancella la ricerca"
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-mute hover:bg-paper hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="relative sm:w-60">
        <label htmlFor="sort" className="sr-only">
          Ordina per
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-line bg-raised pr-10 pl-4 text-base hover:border-mute/50"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-mute"
        />
      </div>
    </div>
  );
}
