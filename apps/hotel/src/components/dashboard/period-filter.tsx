"use client";

import { Button, buttonClasses, cn } from "@detectivescan/ui";
import { CalendarRange, QrCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, type MouseEvent, useId, useOptimistic, useState } from "react";
import { dayFromIso, isoFromDay } from "@/lib/dates";
import type { PeriodKey } from "@/lib/dashboard/period";
import { useDashboardNavigation } from "./dashboard-transition";

export type PeriodFilterOption = { key: PeriodKey; label: string; short?: string; href: string };

type CustomRange = {
  from: string;
  to: string;
  /** Premier jour disponible (installation des QR codes). */
  min: string;
  /** Dernier jour sélectionnable (hier). */
  max: string;
  maxDays: number;
};

const shiftIso = (iso: string, days: number): string => {
  const day = dayFromIso(iso);
  return day === null ? iso : isoFromDay(day + days);
};
const earliest = (a: string, b: string) => (a < b ? a : b);
const latest = (a: string, b: string) => (a > b ? a : b);

const dateInputClasses =
  "h-10 w-[9.75rem] rounded-sm border border-line-strong bg-surface px-3 text-[14px] tabular-nums text-fg " +
  "transition-[border-color,box-shadow] duration-150 ease-out hover:border-white/25 " +
  "focus:border-red focus:outline-none focus:ring-3 focus:ring-red/35";

/** Suit les clics « normaux » ; laisse passer Ctrl/⌘-clic et clic du milieu (nouvel onglet). */
function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/**
 * Filtre de période : il porte sur toute la page. « Gérer les QR codes » donne
 * l'accès direct demandé aux QR codes (la barre du bas s'en charge sur mobile).
 */
export function PeriodFilter({
  current,
  options,
  custom,
  caption,
  qrHref,
}: {
  current: PeriodKey;
  options: PeriodFilterOption[];
  custom: CustomRange;
  caption: string;
  qrHref: string;
}) {
  const pathname = usePathname();
  const { navigate, pending } = useDashboardNavigation();
  const [selected, setSelected] = useOptimistic(current);
  const captionId = useId();

  function select(event: MouseEvent<HTMLAnchorElement>, option: PeriodFilterOption) {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    if (option.key === selected) return;
    navigate(option.href, () => setSelected(option.key));
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3">
        <nav aria-label="Période" className="min-w-0 max-w-full overflow-x-auto">
          <ul className="flex w-max items-center gap-0.5 rounded-md border border-line bg-surface p-1">
            {options.map((option) => {
              const active = option.key === selected;
              return (
                <li key={option.key}>
                  <Link
                    href={option.href}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    aria-describedby={active ? captionId : undefined}
                    onClick={(event) => select(event, option)}
                    className={cn(
                      "flex h-8 items-center whitespace-nowrap rounded-sm px-2.5 text-[13px] font-medium transition-colors duration-150 sm:px-3",
                      "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
                      active ? "bg-white/[0.09] text-fg" : "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
                    )}
                  >
                    {option.short ? (
                      <span aria-hidden className="sm:hidden">
                        {option.short}
                      </span>
                    ) : (
                      <CalendarRange className="size-4 sm:hidden" strokeWidth={1.75} aria-hidden />
                    )}
                    <span className="max-sm:sr-only">{option.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href={qrHref}
          className={buttonClasses({ variant: "secondary", size: "md", className: "ml-auto max-md:hidden" })}
        >
          <QrCode strokeWidth={1.75} aria-hidden />
          Gérer les QR codes
        </Link>
      </div>

      {selected === "perso" ? (
        <CustomRangeForm
          key={`${custom.from}_${custom.to}`}
          pathname={pathname}
          range={custom}
          pending={pending}
          onApply={(href) => navigate(href, () => setSelected("perso"))}
        />
      ) : null}

      <p id={captionId} className="text-[13px] leading-snug text-fg-3">
        {caption}
      </p>
    </div>
  );
}

function CustomRangeForm({
  pathname,
  range,
  pending,
  onApply,
}: {
  pathname: string;
  range: CustomRange;
  pending: boolean;
  onApply: (href: string) => void;
}) {
  const [from, setFrom] = useState(range.from);
  const [to, setTo] = useState(range.to);
  const hintId = useId();
  const span = range.maxDays - 1;

  // Le navigateur empêche d'envoyer une plage inversée, trop longue ou hors des données.
  const fromMin = to ? latest(range.min, shiftIso(to, -span)) : range.min;
  const fromMax = to ? earliest(to, range.max) : range.max;
  const toMin = from ? latest(from, range.min) : range.min;
  const toMax = from ? earliest(range.max, shiftIso(from, span)) : range.max;

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(`${pathname}?periode=perso&du=${from}&au=${to}`);
  }

  return (
    <form
      action={pathname}
      method="get"
      onSubmit={apply}
      aria-label="Période personnalisée"
      className="flex flex-wrap items-center gap-x-3 gap-y-2"
    >
      <input type="hidden" name="periode" value="perso" />
      <label className="flex items-center gap-2 text-[13px] text-fg-2">
        <span className="w-5 sm:w-auto">Du</span>
        <input
          type="date"
          name="du"
          required
          value={from}
          min={fromMin}
          max={fromMax}
          onChange={(event) => setFrom(event.target.value)}
          aria-describedby={hintId}
          className={dateInputClasses}
        />
      </label>
      <label className="flex items-center gap-2 text-[13px] text-fg-2">
        <span className="w-5 sm:w-auto">au</span>
        <input
          type="date"
          name="au"
          required
          value={to}
          min={toMin}
          max={toMax}
          onChange={(event) => setTo(event.target.value)}
          aria-describedby={hintId}
          className={dateInputClasses}
        />
      </label>
      <Button type="submit" variant="secondary" loading={pending}>
        {pending ? "Chargement…" : "Appliquer"}
      </Button>
      <p id={hintId} className="text-[12.5px] text-fg-3">
        {range.maxDays} jours au plus, jusqu'à hier.
      </p>
    </form>
  );
}
