import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageWindow } from "@/lib/postsView";

type Props = { page: number; totalPages: number; onChange: (page: number) => void };

const step =
  "inline-flex h-11 items-center gap-1 rounded-xl px-3 text-sm font-medium hover:bg-raised disabled:pointer-events-none disabled:opacity-40";

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginazione" className="mt-8 flex items-center justify-between gap-2">
      <button type="button" className={step} disabled={page === 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="size-4" aria-hidden />
        <span className="max-sm:sr-only">Precedente</span>
      </button>

      {/* Phones get a compact counter; wider screens get numbered pages. */}
      <p className="text-sm text-mute sm:hidden" aria-live="polite">
        Pagina {page} di {totalPages}
      </p>
      <ul className="hidden items-center gap-1 sm:flex">
        {pageWindow(page, totalPages).map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} aria-hidden className="w-6 text-center text-mute">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onChange(p)}
                aria-label={`Pagina ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "size-11 rounded-xl text-sm font-medium tabular-nums hover:bg-raised",
                  p === page && "bg-ink text-white hover:bg-ink",
                )}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={step}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        <span className="max-sm:sr-only">Successiva</span>
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </nav>
  );
}
