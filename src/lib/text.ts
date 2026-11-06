/** Lowercase + strip accents, so "perche" matches "perché". */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export type Chunk = { text: string; match: boolean };

/**
 * Splits `text` into chunks, flagging the ones that match `query`
 * (accent- and case-insensitive). Used to highlight search matches.
 *
 * NFD-stripping can change string length for exotic characters, so we only
 * highlight when the normalized text keeps the same length as the original.
 */
export function splitByMatch(text: string, query: string): Chunk[] {
  const q = normalize(query.trim());
  if (!q) return [{ text, match: false }];

  const haystack = normalize(text);
  if (haystack.length !== text.length) return [{ text, match: false }];

  const chunks: Chunk[] = [];
  let cursor = 0;
  let index = haystack.indexOf(q, cursor);
  while (index !== -1) {
    if (index > cursor) chunks.push({ text: text.slice(cursor, index), match: false });
    chunks.push({ text: text.slice(index, index + q.length), match: true });
    cursor = index + q.length;
    index = haystack.indexOf(q, cursor);
  }
  if (cursor < text.length) chunks.push({ text: text.slice(cursor), match: false });
  return chunks;
}
