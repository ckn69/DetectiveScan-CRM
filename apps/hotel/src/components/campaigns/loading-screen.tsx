import { cn } from "@detectivescan/ui";
import type { ReactNode } from "react";
import { typeset } from "@/lib/campaigns/typeset";

/** Taille logique de l'écran du joueur : un téléphone de 390 px de large, barres du navigateur ôtées. */
export const SCREEN = { width: 390, height: 780 } as const;

export type ScreenContent = { title: string; message: string; image: string | null };

/**
 * L'écran de chargement que voit le joueur au lancement d'une chasse, environ 3 secondes :
 * fond noir, le message de l'hôtel (image en haut qui se fond dans le noir, titre, texte,
 * signature), puis la barre de chargement. Rendu à la taille réelle (390 × 780) ; les
 * aperçus le réduisent sans rien changer. Sans message, il ne reste que le chargement.
 */
export function LoadingScreen({
  content,
  hotelName,
  still = false,
}: {
  content: ScreenContent | null;
  hotelName: string;
  /** Vignette figée : barre à mi-course, sans animation. */
  still?: boolean;
}) {
  const title = content ? typeset(content.title.trim()) : "";
  const message = content ? typeset(content.message.trim()) : "";
  const image = content?.image ?? null;

  return (
    <div
      className={cn("relative overflow-hidden bg-black font-sans text-white antialiased", still && "ds-still")}
      style={{ width: SCREEN.width, height: SCREEN.height }}
    >
      {image ? (
        <div className="absolute inset-x-0 top-0 h-[420px]">
          <img src={image} alt="" className="size-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgb(0 0 0 / 0) 38%, rgb(0 0 0 / 0.55) 70%, #000 100%)" }}
          />
        </div>
      ) : null}

      {title || message ? (
        <div
          className={cn(
            "ds-reveal absolute inset-x-0 flex flex-col px-7",
            image ? "top-[352px] bottom-[104px]" : "top-0 bottom-[104px] justify-center",
          )}
        >
          {title ? (
            <p className="line-clamp-3 text-[28px] font-semibold leading-[1.16] tracking-[-0.015em] text-balance">{title}</p>
          ) : null}
          {message ? <p className="mt-3 line-clamp-5 text-[16px] leading-[1.5] text-[#b3b3b3]">{message}</p> : null}
          <p className="mt-5 text-[13px] font-medium text-[#8c8c8c]">{hotelName}</p>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-10 grid justify-items-center gap-3">
        <div className="h-[2px] w-[148px] overflow-hidden rounded-full bg-white/[0.14]">
          <div className="ds-load-bar h-full w-full bg-[#e50914]" />
        </div>
        <p className="text-[12.5px] text-[#8c8c8c]">Préparation de votre enquête…</p>
      </div>
    </div>
  );
}

/** L'écran en une phrase, pour les lecteurs d'écran : l'aperçu réduit, lui, est masqué. */
export function describeScreen(content: ScreenContent | null): string {
  const title = content?.title.trim() ?? "";
  const message = content?.message.trim() ?? "";
  if (!title && !message) return "Écran de chargement, sans message de l'hôtel.";
  return [
    title ? `Titre : ${title}.` : null,
    message ? `Texte : ${message}` : null,
    content?.image ? "Avec une image en haut de l'écran." : "Sans image.",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Réduit l'écran (390 × 780) à `width` pixels de large. */
function Scaled({ width, children }: { width: number; children: ReactNode }) {
  const scale = width / SCREEN.width;
  return (
    <div className="relative overflow-hidden" style={{ width, height: Math.round(SCREEN.height * scale) }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Téléphone à l'échelle : un cadre sobre (bord de 3,4 %, coins arrondis) autour de l'écran
 * réel réduit. Pas d'encoche ni de barre d'état : l'aperçu montre la page, rien d'autre.
 */
export function PhoneFrame({
  width,
  label,
  description,
  className,
  children,
}: {
  width: number;
  label: string;
  /** Ce que montre l'écran, lu à la place de l'aperçu réduit (voir `describeScreen`). */
  description: string;
  className?: string;
  children: ReactNode;
}) {
  const bezel = Math.max(6, Math.round(width * 0.034));
  const inner = width - bezel * 2;
  const radius = Math.round(width * 0.14);
  return (
    <figure aria-label={label} className={cn("m-0 shrink-0", className)} style={{ width }}>
      <div className="bg-[#161616] ring-1 ring-inset ring-white/[0.12]" style={{ padding: bezel, borderRadius: radius }}>
        <div aria-hidden className="overflow-hidden bg-black" style={{ borderRadius: radius - bezel }}>
          <Scaled width={inner}>{children}</Scaled>
        </div>
      </div>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}

/** Vignette de liste : l'écran figé, sans cadre. */
export function ScreenThumb({ width, content, hotelName }: { width: number; content: ScreenContent; hotelName: string }) {
  return (
    <div aria-hidden className="shrink-0 overflow-hidden rounded-sm outline-1 -outline-offset-1 outline-white/[0.12]" style={{ width }}>
      <Scaled width={width}>
        <LoadingScreen content={content} hotelName={hotelName} still />
      </Scaled>
    </div>
  );
}
