"use client";

import Link from "next/link";
import { sectionHref } from "@/lib/nav";
import { QUICK_ACTIONS } from "@/lib/quick-actions";

/** Contenu d'un popover d'actions rapides ; referme le popover au clic. */
export function QuickActionsList({ hotelSlug, popoverId }: { hotelSlug: string; popoverId: string }) {
  const close = () => document.getElementById(popoverId)?.hidePopover();

  return (
    <>
      <p className="px-3 pb-2 pt-1.5 text-[12px] font-semibold text-fg-3">Actions rapides</p>
      <ul className="grid gap-0.5">
        {QUICK_ACTIONS.map(({ slug, path, title, detail, icon: Icon }) => (
          <li key={title}>
            <Link
              href={path ? `${sectionHref(hotelSlug, slug)}/${path}` : sectionHref(hotelSlug, slug)}
              onClick={close}
              className="flex items-center gap-3 rounded-md p-2.5 transition-colors duration-150 hover:bg-white/8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/8 text-fg">
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
    </>
  );
}
