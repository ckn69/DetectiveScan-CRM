"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "./cn";

/**
 * Panneau latéral modal (élément `<dialog>` natif) : le focus y reste enfermé, Échap et
 * un clic sur le voile le ferment, le focus revient à l'élément qui l'a ouvert.
 * 440 px à droite de l'écran, plein écran sous 640 px.
 *
 * À l'ouverture, le focus va au champ marqué `data-autofocus` (sinon au premier élément
 * focalisable) : `autoFocus` seul ne suffit pas, React le pose avant que le panneau s'ouvre.
 */
export function Sheet({
  open,
  onClose,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      opener.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className={cn("ds-sheet", className)}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex h-full flex-col">{children}</div>
    </dialog>
  );
}
