"use client";

import { buttonClasses, cn } from "@detectivescan/ui";
import { Bell, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Hotel, SessionUser } from "@/lib/demo";
import { findSection, sectionHref } from "@/lib/nav";
import { Avatar } from "./avatar";
import { QuickActionsList } from "./quick-actions-list";
import { usePopoverOpen } from "./use-popover-open";
import { UserMenu } from "./user-menu";

const QUICK_ACTIONS_ID = "quick-actions-desktop";

/** Barre haute : titre de la page, notifications, actions rapides (≥ 768 px) et menu du compte (mobile). */
export function Topbar({ hotel, user }: { hotel: Hotel; user: SessionUser }) {
  const pathname = usePathname();
  const section = findSection(pathname.split("/")[2]);
  const notificationsHref = sectionHref(hotel.slug, "notifications");
  const onNotifications = pathname.startsWith(notificationsHref);
  const quickActionsOpen = usePopoverOpen(QUICK_ACTIONS_ID);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3 px-4 md:h-16 md:px-8">
        <Avatar initials={hotel.initials} className="size-8 md:hidden" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-semibold leading-tight tracking-[-0.01em] md:text-[20px]">
            {section?.label ?? "Espace hôtelier"}
          </h1>
          <p className="truncate text-[12px] text-fg-3 md:hidden">{hotel.name}</p>
        </div>

        <Link
          href={notificationsHref}
          aria-label="Notifications"
          aria-current={onNotifications ? "page" : undefined}
          className={cn(
            "flex size-9 items-center justify-center rounded-md border transition-colors duration-150 md:size-10",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
            onNotifications
              ? "border-line-strong bg-white/[0.09] text-fg"
              : "border-line text-fg-2 hover:border-line-strong hover:text-fg",
          )}
        >
          <Bell className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </Link>

        <button
          type="button"
          popoverTarget={QUICK_ACTIONS_ID}
          className={buttonClasses({ size: "md", className: "pl-3 pr-2.5 max-md:hidden" })}
        >
          <Plus aria-hidden />
          Actions rapides
          <ChevronDown
            className={cn("transition-transform duration-200 ease-out", quickActionsOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        <div
          id={QUICK_ACTIONS_ID}
          popover="auto"
          className="ds-popover fixed inset-auto right-8 top-[calc(64px+env(safe-area-inset-top))] z-50 w-80 rounded-lg border border-line-strong bg-raised p-2 shadow-pop"
        >
          <QuickActionsList hotelSlug={hotel.slug} popoverId={QUICK_ACTIONS_ID} />
        </div>

        <div className="md:hidden">
          <UserMenu user={user} hotelSlug={hotel.slug} placement="topbar" />
        </div>
      </div>
    </header>
  );
}
