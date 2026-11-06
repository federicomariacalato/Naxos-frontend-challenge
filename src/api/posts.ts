import {
  postSchema,
  postsSchema,
  type NewPostInput,
  type Post,
} from "@/types/post";
import { applySimulation } from "./simulate";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
const TIMEOUT_MS = 10_000;

export type ApiErrorKind = "offline" | "timeout" | "server" | "client" | "invalid";

/** One error type for the whole API layer, so the UI only has to switch on `kind`. */
export class ApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
  }
}

async function request(url: string, init: RequestInit = {}): Promise<unknown> {
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;

  let response: Response;
  try {
    response = await fetch(url, { ...init, signal });
  } catch (error) {
    // The caller cancelled on purpose (e.g. React Query): not a failure to report.
    if (init.signal?.aborted) throw error;
    if (timeout.aborted) throw new ApiError("timeout", "Request timed out");
    throw new ApiError("offline", "Network request failed");
  }

  if (!response.ok) {
    throw new ApiError(
      response.status >= 500 ? "server" : "client",
      `HTTP ${response.status}`,
      response.status,
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError("invalid", "Response is not valid JSON");
  }
}

export async function fetchPosts(signal?: AbortSignal): Promise<Post[]> {
  try {
    await applySimulation("list");
  } catch {
    throw new ApiError("offline", "Simulated network failure");
  }
  const data = await request(BASE_URL, { signal });
  const parsed = postsSchema.safeParse(data);
  if (!parsed.success) throw new ApiError("invalid", "Unexpected response shape");
  return parsed.data;
}

/**
 * JSONPlaceholder accepts the POST and echoes it back, but doesn't store it
 * (and always answers id 101). We still make the real call so the form has a
 * genuine async flow; the caller decides which id to give the post locally.
 */
export async function createPost(input: NewPostInput): Promise<Post> {
  try {
    await applySimulation("create");
  } catch {
    throw new ApiError("offline", "Simulated network failure");
  }
  const data = await request(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(input),
  });
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) throw new ApiError("invalid", "Unexpected response shape");
  return parsed.data;
}

/** Plain-language message for each failure, shown to the user. */
export function describeError(error: unknown): { title: string; hint: string } {
  const kind = error instanceof ApiError ? error.kind : "offline";
  switch (kind) {
    case "timeout":
      return {
        title: "Il server ci mette troppo a rispondere",
        hint: "Riprova tra qualche istante.",
      };
    case "server":
      return {
        title: "Il servizio dei post non funziona al momento",
        hint: "Il problema non dipende da te. Riprova tra poco.",
      };
    case "client":
    case "invalid":
      return {
        title: "Abbiamo ricevuto una risposta inattesa",
        hint: "Riprova. Se succede ancora, il servizio potrebbe essere cambiato.",
      };
    default:
      return {
        title: "Non riusciamo a raggiungere il server",
        hint: "Controlla la connessione e riprova.",
      };
  }
}
