import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CircleCheck } from "lucide-react";

type Props = { message: string | null; onDismiss: () => void };

export function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onDismiss, 5000);
    return () => clearTimeout(id);
  }, [message, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <m.p
            key={message}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-3 rounded-xl bg-ink px-5 py-3.5 text-sm font-medium text-white shadow-xl"
          >
            <CircleCheck aria-hidden className="size-5 shrink-0 text-marker" />
            {message}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}
