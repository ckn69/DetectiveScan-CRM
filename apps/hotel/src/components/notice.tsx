"use client";

import { CircleCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/** Message de confirmation éphémère (« QR 01-254-07 ajouté. »), annoncé aux lecteurs d'écran. */
export function useNotice(duration = 4000) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (text: string) => {
      setMessage(text);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(null);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { message, show, clear };
}

/**
 * À placer une fois par écran : la zone reste dans le DOM pour que l'annonce soit lue.
 * Un panneau ouvert rend la page inerte : il a donc sa propre zone (`placement="sheet"`).
 */
export function Notice({ message, placement = "page" }: { message: string | null; placement?: "page" | "sheet" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        placement === "sheet"
          ? "pointer-events-none absolute inset-x-5 bottom-[calc(88px+env(safe-area-inset-bottom))] z-10 flex justify-center"
          : "pointer-events-none fixed inset-x-4 bottom-[calc(96px+env(safe-area-inset-bottom))] z-50 flex justify-center md:inset-x-auto md:bottom-6 md:right-8"
      }
    >
      {message ? (
        <p className="ds-enter flex items-center gap-2.5 rounded-md border border-line-strong bg-raised px-4 py-3 text-[13.5px] text-fg shadow-pop">
          <CircleCheck className="size-4 shrink-0 text-success" strokeWidth={1.75} aria-hidden />
          {message}
        </p>
      ) : null}
    </div>
  );
}
