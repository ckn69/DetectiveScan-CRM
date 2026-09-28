import { cn } from "@detectivescan/ui";

/** Pastille d'initiales (hôtel ou utilisateur). */
export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-surface text-[12px] font-bold tracking-[0.02em] text-fg ring-1 ring-inset ring-line-strong",
        className,
      )}
    >
      {initials}
    </span>
  );
}
