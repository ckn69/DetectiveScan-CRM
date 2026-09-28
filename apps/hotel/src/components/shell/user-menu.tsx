"use client";

import { cn } from "@detectivescan/ui";
import { ChartColumn, ChevronsUpDown, CreditCard, LifeBuoy, LogOut, type LucideIcon, UserRound } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import type { SessionUser } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";
import { Avatar } from "./avatar";

type Placement = "sidebar" | "topbar";

const itemClasses =
  "flex h-10 w-full items-center gap-3 rounded-sm px-3 text-left text-[13.5px] font-medium text-fg-2 transition-colors duration-150 " +
  "hover:bg-white/8 hover:text-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white";

/** Menu du compte : profil, raccourcis, déconnexion. Popover natif, fermé au clic extérieur ou sur Échap. */
export function UserMenu({ user, hotelSlug, placement }: { user: SessionUser; hotelSlug: string; placement: Placement }) {
  const id = `user-menu-${placement}`;
  const close = () => document.getElementById(id)?.hidePopover();

  const links: Array<{ slug: string; label: string; icon: LucideIcon; mobileOnly?: boolean }> = [
    { slug: "settings", label: "Profil et paramètres", icon: UserRound },
    { slug: "analytics", label: "Analytics", icon: ChartColumn, mobileOnly: true },
    { slug: "account", label: "Abonnement", icon: CreditCard, mobileOnly: true },
    { slug: "support", label: "Aide & support", icon: LifeBuoy },
  ];

  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        aria-label={`Compte de ${user.name}`}
        className={cn(
          "flex items-center gap-3 rounded-md text-left transition-colors duration-150 hover:bg-white/6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          placement === "sidebar" ? "w-full justify-center p-1.5 xl:justify-start" : "p-0.5",
        )}
      >
        <Avatar initials={user.initials} className={placement === "topbar" ? "size-8 rounded-full" : undefined} />
        {placement === "sidebar" ? (
          <>
            <span className="hidden min-w-0 flex-1 xl:grid">
              <span className="truncate text-[13px] font-semibold text-fg">{user.shortName}</span>
              <span className="truncate text-[12px] text-fg-3">{user.role}</span>
            </span>
            <ChevronsUpDown className="hidden size-4 shrink-0 text-fg-3 xl:block" strokeWidth={1.75} aria-hidden />
          </>
        ) : null}
      </button>

      <div
        id={id}
        popover="auto"
        className={cn(
          "ds-popover fixed inset-auto z-50 w-64 rounded-md border border-line-strong bg-raised p-1.5 shadow-pop",
          placement === "sidebar" ? "bottom-[76px] left-3" : "right-3 top-[60px]",
        )}
      >
        <div className="mb-1 border-b border-line px-3 pb-3 pt-2">
          <p className="truncate text-[13.5px] font-semibold text-fg">{user.name}</p>
          <p className="truncate text-[12px] text-fg-3">{user.email}</p>
        </div>
        <ul className="grid gap-0.5">
          {links.map(({ slug, label, icon: Icon, mobileOnly }) => (
            <li key={slug} className={mobileOnly ? "md:hidden" : undefined}>
              <Link href={sectionHref(hotelSlug, slug)} onClick={close} className={itemClasses}>
                <Icon className="size-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="my-1 h-px bg-line" />
        <form action={signOut}>
          <button type="submit" className={cn(itemClasses, "text-red-text hover:text-red-text")}>
            <LogOut className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
            Se déconnecter
          </button>
        </form>
      </div>
    </>
  );
}
