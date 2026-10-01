"use client";

import { RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LoadingScreen, SCREEN, type ScreenContent } from "./loading-screen";

const control =
  "flex size-10 items-center justify-center rounded-full bg-white/[0.12] text-fg backdrop-blur-sm transition-colors duration-150 " +
  "hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** L'écran du joueur agrandi à la place disponible, sans le déformer ; sur un téléphone, à sa taille réelle. */
function FitScreen({ content, hotelName, replay }: { content: ScreenContent; hotelName: string; replay: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () =>
      setScale(Math.min(element.clientWidth / SCREEN.width, element.clientHeight / SCREEN.height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0 grid place-items-center overflow-hidden">
      {scale ? (
        <div style={{ width: SCREEN.width * scale, height: SCREEN.height * scale }} className="relative">
          <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
            <LoadingScreen key={replay} content={content} hotelName={hotelName} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Aperçu en plein écran, fond noir : ce que voit le client, à la taille de l'écran.
 * `close` est un lien (page dédiée) ou une action (aperçu ouvert depuis l'éditeur).
 */
export function PreviewStage({
  content,
  hotelName,
  close,
}: {
  content: ScreenContent;
  hotelName: string;
  close: { href: string } | { onClose: () => void };
}) {
  const [replay, setReplay] = useState(0);
  return (
    <div className="fixed inset-0 z-50 bg-black">
      <FitScreen content={content} hotelName={hotelName} replay={replay} />
      <div className="absolute inset-x-0 top-0 flex justify-between px-3 pt-[calc(12px+env(safe-area-inset-top))]">
        <button type="button" aria-label="Rejouer l'aperçu" onClick={() => setReplay((value) => value + 1)} className={control}>
          <RotateCcw className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </button>
        {"href" in close ? (
          <Link href={close.href} aria-label="Fermer l'aperçu" className={control}>
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </Link>
        ) : (
          <button type="button" aria-label="Fermer l'aperçu" onClick={close.onClose} className={control} autoFocus>
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
