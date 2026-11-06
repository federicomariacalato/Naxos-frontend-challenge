export function PostSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" aria-label="Caricamento dei post">
      <span className="sr-only">Caricamento dei post…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          aria-hidden
          className="grid gap-x-8 gap-y-3 border-b border-line py-6 sm:grid-cols-[8.5rem_1fr]"
        >
          <div className="space-y-2">
            <div className="skeleton h-5 w-28" />
            <div className="skeleton h-4 w-16" />
          </div>
          <div className="space-y-3">
            <div className="skeleton h-7 w-3/4" />
            <div className="skeleton h-4 w-full max-w-[65ch]" />
            <div className="skeleton h-4 w-5/6 max-w-[55ch]" />
          </div>
        </div>
      ))}
    </div>
  );
}
