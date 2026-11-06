import { z } from "zod";

/** A post as returned by JSONPlaceholder. */
export const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});
export const postsSchema = z.array(postSchema);

export type Post = z.infer<typeof postSchema>;

/** Posts created in this browser carry a flag so the UI can label them. */
export type LocalPost = Post & { local: true };
export type AnyPost = Post & { local?: true };

export const AUTHOR_IDS = Array.from({ length: 10 }, (_, i) => i + 1);

export const TITLE_MAX = 80;
export const BODY_MIN = 10;
export const BODY_MAX = 400;

/** Rules for the "new post" form. Trim first so "   " counts as empty. */
export const newPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Scrivi un titolo.")
    .min(3, "Il titolo deve avere almeno 3 caratteri.")
    .max(TITLE_MAX, `Il titolo può avere al massimo ${TITLE_MAX} caratteri.`),
  body: z
    .string()
    .trim()
    .min(1, "Scrivi il testo del post.")
    .min(BODY_MIN, `Il testo deve avere almeno ${BODY_MIN} caratteri.`)
    .max(BODY_MAX, `Il testo può avere al massimo ${BODY_MAX} caratteri.`),
  userId: z.number({ error: "Scegli un autore." }).int().min(1, "Scegli un autore."),
});

export type NewPostInput = z.infer<typeof newPostSchema>;
