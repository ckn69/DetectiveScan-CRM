"use client";

import { cn } from "@detectivescan/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { findSection, MOBILE_TABS, sectionHref } from "@/lib/nav";
import { QuickActionsList } from "./quick-actions-list";
import { usePopoverOpen } from "./use-popover-open";

const POPOVER_ID = "quick-actions-mobile";

/** Barre de navigation du bas (< 768 px) : 4 onglets et un bouton d'actions rapides au centre. */
export function MobileNav({ hotelSlug }: { hotelSlug: string }) {
  const pathname = usePathname();
  const open = usePopoverOpen(POPOVER_ID);

  const tabs = MOBILE_TABS.map((slug) => findSection(slug)).filter((s) => s !== undefined);
  const left = tabs.slice(0, 2);
  const right = tabs.slice(2);

  const renderTab = ({ slug, label, shortLabel, icon: Icon }: (typeof tabs)[number]) => {
    const href = sectionHref(hotelSlug, slug);
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <li key={slug}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white",
            active ? "text-fg" : "text-fg-3 hover:text-fg-2",
          )}
        >
          <Icon className={cn("size-[22px]", active && "text-red-text")} strokeWidth={1.75} aria-hidden />
          {shortLabel ?? label}
        </Link>
      </li>
    );
  };

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-chrome pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid h-16 grid-cols-5 items-center">
        {left.map(renderTab)}
        <li className="flex justify-center">
          <button
            type="button"
            popoverTarget={POPOVER_ID}
            aria-label={open ? "Fermer les actions rapides" : "Actions rapides"}
            className={cn(
              "-mt-7 flex size-13 items-center justify-center rounded-lg text-white shadow-pop transition-[background-color,translate] duration-150 active:translate-y-px",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              open ? "bg-red-press" : "bg-red hover:bg-red-hover active:bg-red-press",
            )}
          >
            <Plus
              className={cn("size-6 transition-transform duration-200 ease-out", open && "rotate-45")}
              strokeWidth={2}
              aria-hidden
            />
          </button>
        </li>
        {right.map(renderTab)}
      </ul>

      <div
        id={POPOVER_ID}
        popover="auto"
        className="ds-popover fixed inset-auto bottom-[calc(84px+env(safe-area-inset-bottom))] left-3 right-3 z-50 w-auto rounded-lg border border-line-strong bg-raised p-2 shadow-pop"
      >
        <QuickActionsList hotelSlug={hotelSlug} popoverId={POPOVER_ID} />
      </div>
    </nav>
  );
}
