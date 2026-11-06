import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { describeError } from "@/api/posts";
import { useCreatePost } from "@/hooks/useCreatePost";
import {
  AUTHOR_IDS,
  BODY_MAX,
  TITLE_MAX,
  newPostSchema,
  type LocalPost,
  type NewPostInput,
} from "@/types/post";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (post: LocalPost) => void;
};

const field =
  "w-full rounded-xl border bg-raised px-4 text-base placeholder:text-mute/80 hover:border-mute/50";

export function NewPostDialog({ open, onClose, onCreated }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const create = useCreatePost();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NewPostInput>({
    resolver: zodResolver(newPostSchema),
    mode: "onTouched", // validate on blur first, then live while fixing
    defaultValues: { title: "", body: "" },
  });

  // Keep the native <dialog> in sync with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const titleLength = (useWatch({ control, name: "title" }) ?? "").length;
  const bodyLength = (useWatch({ control, name: "body" }) ?? "").length;

  const onSubmit = handleSubmit((values) => {
    create.mutate(values, {
      onSuccess: (post) => {
        reset();
        create.reset();
        onCreated(post);
      },
    });
  });

  // The draft survives closing the dialog; the server error doesn't need to.
  const close = () => {
    create.reset();
    onClose();
  };

  const serverError = create.isError ? describeError(create.error) : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-labelledby="new-post-title"
      className="sheet w-[min(36rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-paper p-0 text-ink shadow-2xl"
    >
      <form onSubmit={onSubmit} noValidate className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="new-post-title" className="font-display text-3xl font-semibold">
              Nuovo post
            </h2>
            <p className="mt-1 text-mute">Compila tutti i campi per pubblicarlo.</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Chiudi"
            className="-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-xl text-mute hover:bg-raised hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="title" className="text-sm font-semibold">
                Titolo
              </label>
              <span
                className={cn("text-xs tabular-nums text-mute", titleLength > TITLE_MAX && "font-semibold text-danger")}
                aria-hidden
              >
                {titleLength}/{TITLE_MAX}
              </span>
            </div>
            <input
              id="title"
              type="text"
              autoComplete="off"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              placeholder="Di cosa parla il post?"
              className={cn(field, "mt-1.5 h-12", errors.title ? "border-danger" : "border-line")}
              {...register("title")}
            />
            <FieldError id="title-error" message={errors.title?.message} />
          </div>

          <div>
            <label htmlFor="userId" className="text-sm font-semibold">
              Autore
            </label>
            <select
              id="userId"
              aria-invalid={!!errors.userId}
              aria-describedby={errors.userId ? "userId-error" : undefined}
              className={cn(field, "mt-1.5 h-12 cursor-pointer", errors.userId ? "border-danger" : "border-line")}
              {...register("userId", { valueAsNumber: true })}
            >
              <option value="">Scegli un autore</option>
              {AUTHOR_IDS.map((id) => (
                <option key={id} value={id}>
                  Autore {id}
                </option>
              ))}
            </select>
            <FieldError id="userId-error" message={errors.userId?.message} />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="body" className="text-sm font-semibold">
                Testo
              </label>
              <span
                className={cn("text-xs tabular-nums text-mute", bodyLength > BODY_MAX && "font-semibold text-danger")}
                aria-hidden
              >
                {bodyLength}/{BODY_MAX}
              </span>
            </div>
            <textarea
              id="body"
              rows={6}
              aria-invalid={!!errors.body}
              aria-describedby={errors.body ? "body-error" : undefined}
              placeholder="Scrivi il contenuto del post"
              className={cn(field, "mt-1.5 resize-y py-3 leading-relaxed", errors.body ? "border-danger" : "border-line")}
              {...register("body")}
            />
            <FieldError id="body-error" message={errors.body?.message} />
          </div>
        </div>

        {serverError && (
          <div
            role="alert"
            className="mt-5 flex gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm"
          >
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
            <p>
              <strong className="font-semibold">Il post non è stato pubblicato.</strong> {serverError.title}.{" "}
              {serverError.hint} Quello che hai scritto è ancora qui.
            </p>
          </div>
        )}

        <p className="mt-5 text-sm text-mute">
          L'API di prova non conserva i dati: il post resterà salvato solo su questo browser.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="h-12 rounded-xl border border-line bg-raised px-5 font-semibold hover:border-mute/50"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={create.isPending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-deep disabled:opacity-70"
          >
            {create.isPending && <Loader2 aria-hidden className="size-4 animate-spin" />}
            {create.isPending ? "Pubblico…" : create.isError ? "Riprova a pubblicare" : "Pubblica"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-danger">
      {message}
    </p>
  );
}
