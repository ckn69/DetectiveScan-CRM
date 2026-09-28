"use client";

import { useEffect, useState } from "react";

/** Suit l'état ouvert / fermé d'un popover natif (événement `toggle`). */
export function usePopoverOpen(id: string): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const element = document.getElementById(id);
    if (!element) return;
    const onToggle = (event: Event) => setOpen((event as ToggleEvent).newState === "open");
    element.addEventListener("toggle", onToggle);
    return () => element.removeEventListener("toggle", onToggle);
  }, [id]);

  return open;
}
