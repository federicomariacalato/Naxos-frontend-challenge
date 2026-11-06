import { cn } from "@/lib/utils";
import { Highlight } from "./Highlight";
import type { AnyPost } from "@/types/post";

type Props = { post: AnyPost; query: string };

export function PostRow({ post, query }: Props) {
  return (
    <article
      className={cn(
        "grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[8.5rem_1fr]",
        post.local && "relative -mx-4 rounded-xl bg-marker/20 px-4 sm:-mx-5 sm:px-5",
      )}
    >
      <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-1.5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-full bg-accent text-xs font-semibold text-white"
          >
            {post.userId}
          </span>
          Autore {post.userId}
        </p>
        <p className="text-sm text-mute">Post {post.id}</p>
        {post.local && (
          <p className="rounded-md bg-marker px-2 py-0.5 text-xs font-semibold text-ink">
            Scritto da te
          </p>
        )}
      </div>

      <div className="min-w-0">
        <h2 className="font-display text-xl leading-snug font-semibold text-balance first-letter:uppercase sm:text-2xl">
          <Highlight text={post.title} query={query} />
        </h2>
        <p className="mt-2 max-w-[65ch] leading-relaxed text-mute first-letter:uppercase">
          <Highlight text={post.body} query={query} />
        </p>
      </div>
    </article>
  );
}
