"use client";

import { cn } from "@detectivescan/ui";
import { LifeBuoy, type LucideIcon, Megaphone, Plus, ScanLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { findSection, MOBILE_TABS, sectionHref } from "@/lib/nav";

const QUICK_ACTIONS: Array<{ slug: string; title: string; detail: string; icon: LucideIcon }> = [
  { slug: "campaigns", title: "Nouvelle campagne", detail: "Restaurant, spa, événement…", icon: Megaphone },
  { slug: "qr-codes", title: "Scanner un QR code", detail: "L'associer à une chambre", icon: ScanLine },
  { slug: "support", title: "Signaler un problème", detail: "QR abîmé, jeu bloqué…", icon: LifeBuoy },
];

/** Barre de navigation du bas (< 768 px) : 4 onglets et un bouton d'actions rapides au centre. */
export function MobileNav({ hotelSlug }: { hotelSlug: string }) {
  const pathname = usePathname();
  const closeQuickActions = () => document.getElementById("quick-actions")?.hidePopover();

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
            popoverTarget="quick-actions"
            aria-label="Actions rapides"
            className="-mt-7 flex size-13 items-center justify-center rounded-[16px] bg-red text-white shadow-[0_10px_24px_-6px_rgb(229_9_20/0.55)] transition-[background-color,translate] duration-150 hover:bg-red-hover active:translate-y-px active:bg-red-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Plus className="size-6" strokeWidth={2} aria-hidden />
          </button>
        </li>
        {right.map(renderTab)}
      </ul>

      <div
        id="quick-actions"
        popover="auto"
        className="ds-popover fixed inset-auto bottom-[calc(84px+env(safe-area-inset-bottom))] left-3 right-3 z-50 w-auto rounded-lg border border-line-strong bg-raised p-2 shadow-pop"
      >
        <p className="px-3 pb-2 pt-1.5 text-[12px] font-semibold text-fg-3">Actions rapides</p>
        <ul className="grid gap-0.5">
          {QUICK_ACTIONS.map(({ slug, title, detail, icon: Icon }) => (
            <li key={title}>
              <Link
                href={sectionHref(hotelSlug, slug)}
                onClick={closeQuickActions}
                className="flex items-center gap-3 rounded-md p-2.5 transition-colors duration-150 hover:bg-white/8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/8 text-fg">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="grid">
                  <span className="text-[14px] font-semibold text-fg">{title}</span>
                  <span className="text-[12.5px] text-fg-3">{detail}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
