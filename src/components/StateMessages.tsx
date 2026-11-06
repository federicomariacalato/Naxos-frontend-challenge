import { CloudOff, FileSearch, Loader2, PenLine, RefreshCw } from "lucide-react";
import { describeError } from "@/api/posts";

const button =
  "inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold disabled:opacity-60";

export function ErrorState({
  error,
  retrying,
  onRetry,
}: {
  error: unknown;
  retrying: boolean;
  onRetry: () => void;
}) {
  const { title, hint } = describeError(error);
  return (
    <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft px-6 py-10 text-center">
      <CloudOff aria-hidden className="mx-auto size-9 text-danger" />
      <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-[45ch] text-mute">{hint}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className={`${button} mt-6 bg-ink text-white hover:bg-ink/85`}
      >
        {retrying ? (
          <Loader2 aria-hidden className="size-4 animate-spin" />
        ) : (
          <RefreshCw aria-hidden className="size-4" />
        )}
        {retrying ? "Sto riprovando…" : "Riprova"}
      </button>
    </div>
  );
}

/** Shown above the list when a refresh failed but we still have posts to show. */
export function StaleBanner({ retrying, onRetry }: { retrying: boolean; onRetry: () => void }) {
  return (
    <div
      role="status"
      className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm"
    >
      <p>Non siamo riusciti ad aggiornare i post. Stai vedendo l'ultima versione caricata.</p>
      <button type="button" onClick={onRetry} disabled={retrying} className="font-semibold underline disabled:opacity-60">
        {retrying ? "Sto riprovando…" : "Riprova"}
      </button>
    </div>
  );
}

export function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="py-16 text-center">
      <FileSearch aria-hidden className="mx-auto size-9 text-mute" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-balance">
        Nessun post contiene «{query.trim()}»
      </h2>
      <p className="mt-2 text-mute">Prova con una parola più corta o controlla l'ortografia.</p>
      <button type="button" onClick={onClear} className={`${button} mt-6 border border-line bg-raised hover:border-mute/50`}>
        Cancella la ricerca
      </button>
    </div>
  );
}

export function NoPosts({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="py-16 text-center">
      <PenLine aria-hidden className="mx-auto size-9 text-mute" />
      <h2 className="mt-4 font-display text-2xl font-semibold">Non c'è ancora nessun post</h2>
      <p className="mt-2 text-mute">Scrivi il primo e comparirà qui.</p>
      <button type="button" onClick={onCreate} className={`${button} mt-6 bg-accent text-white hover:bg-accent-deep`}>
        Scrivi un post
      </button>
    </div>
  );
}
