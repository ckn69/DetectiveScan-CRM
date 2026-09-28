"use client";

import { cn, LogoMark } from "@detectivescan/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Hotel, SessionUser } from "@/lib/demo";
import { SECTION_GROUPS, sectionHref } from "@/lib/nav";
import { Avatar } from "./avatar";
import { UserMenu } from "./user-menu";

/** Info-bulle du rail (768–1279 px), visible au survol et au focus clavier. Masquée quand les libellés sont affichés. */
function RailTooltip({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-sm border border-line-strong bg-raised px-2.5 py-1.5",
        "text-[12.5px] font-medium text-fg opacity-0 shadow-pop transition-opacity duration-150",
        "group-hover:opacity-100 group-focus-visible:opacity-100 xl:hidden",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Navigation principale.
 * ≥ 1280 px : sidebar de 248 px avec libellés. 768–1279 px : rail d'icônes de 72 px. < 768 px : masquée (barre du bas).
 */
export function Sidebar({ hotel, user }: { hotel: Hotel; user: SessionUser }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-chrome md:flex">
      <div className="flex h-16 shrink-0 items-center justify-center px-4 xl:justify-start xl:px-5">
        <Link
          href={sectionHref(hotel.slug, "dashboard")}
          className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <LogoMark />
          <span className="sr-only text-[16px] font-bold tracking-[-0.02em] xl:not-sr-only">DetectiveScan</span>
        </Link>
      </div>

      <div className="group relative mx-3 mb-2 flex items-center justify-center gap-3 px-1.5 py-1.5 xl:justify-start xl:px-2">
        <Avatar initials={hotel.initials} />
        <span className="sr-only min-w-0 xl:not-sr-only xl:grid">
          <span className="truncate text-[13px] font-semibold text-fg">{hotel.name}</span>
          <span className="truncate text-[12px] text-fg-3">
            {hotel.city} · {hotel.rooms} chambres
          </span>
        </span>
        <RailTooltip>
          {hotel.name} · {hotel.city}
        </RailTooltip>
      </div>

      <nav aria-label="Navigation principale" className="flex-1 px-3 pb-4 xl:overflow-y-auto">
        {SECTION_GROUPS.map((group, index) => (
          <div key={group.label} className="mt-5 first:mt-3">
            <p className="mb-1.5 hidden px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-3 xl:block">
              {group.label}
            </p>
            {index > 0 ? <hr className="mx-auto mb-3 w-8 border-line xl:hidden" /> : null}
            <ul className="grid gap-0.5">
              {group.sections.map(({ slug, label, icon: Icon }) => {
                const href = sectionHref(hotel.slug, slug);
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={slug}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex h-10 items-center justify-center gap-3 rounded-sm px-3 text-[13.5px] font-medium transition-colors duration-150 xl:justify-start",
                        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
                        active ? "bg-white/[0.09] text-fg" : "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[18px] shrink-0 transition-colors duration-150",
                          active ? "text-red-text" : "text-fg-3 group-hover:text-fg-2",
                        )}
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className="sr-only xl:not-sr-only">{label}</span>
                      <RailTooltip>{label}</RailTooltip>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <UserMenu user={user} hotelSlug={hotel.slug} placement="sidebar" />
      </div>
    </aside>
  );
}
