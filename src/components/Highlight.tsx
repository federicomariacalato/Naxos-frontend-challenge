import { splitByMatch } from "@/lib/text";

/** Renders `text` with the parts matching `query` wrapped in <mark>. */
export function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitByMatch(text, query).map((chunk, i) =>
        chunk.match ? <mark key={i}>{chunk.text}</mark> : <span key={i}>{chunk.text}</span>,
      )}
    </>
  );
}
