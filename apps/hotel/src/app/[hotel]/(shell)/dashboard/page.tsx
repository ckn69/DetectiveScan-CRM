import { CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { DashboardTransition } from "@/components/dashboard/dashboard-transition";
import { Definitions } from "@/components/dashboard/definitions";
import { FunnelCard } from "@/components/dashboard/funnel-card";
import { KpiTiles } from "@/components/dashboard/kpi-tiles";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { RecentGamesCard } from "@/components/dashboard/recent-games-card";
import { TopRoomsCard } from "@/components/dashboard/top-rooms-card";
import { DEMO_DATA_SINCE, getDemoDashboard } from "@/lib/dashboard/demo-data";
import { kpiTiles } from "@/lib/dashboard/kpis";
import {
  customBounds,
  customDefault,
  MAX_CUSTOM_DAYS,
  PERIOD_OPTIONS,
  periodCaption,
  periodHref,
  resolvePeriod,
} from "@/lib/dashboard/period";
import { hotelNow, isoFromDay } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import { sectionHref } from "@/lib/nav";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Dashboard de l'hôtel : mes clients jouent-ils, aiment-ils, où décrochent-ils ?
 * Tout se lit sur la période choisie, comparée à la précédente. Données du mode démo.
 */
export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ hotel: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ hotel }, query] = await Promise.all([params, searchParams]);
  const now = hotelNow();
  const period = resolvePeriod(query, now, DEMO_DATA_SINCE);
  const data = getDemoDashboard(period, now);

  const pathname = sectionHref(hotel, "dashboard");
  const qrHref = sectionHref(hotel, "qr-codes");
  const custom = customDefault(period, now, DEMO_DATA_SINCE);
  const bounds = customBounds(now, DEMO_DATA_SINCE);

  const filter = (
    <PeriodFilter
      current={period.key}
      options={PERIOD_OPTIONS.map((option) => ({
        ...option,
        href: periodHref(pathname, option.key, option.key === "perso" ? custom : undefined),
      }))}
      custom={{
        from: isoFromDay(custom.from),
        to: isoFromDay(custom.to),
        min: isoFromDay(bounds.min),
        max: isoFromDay(bounds.max),
        maxDays: MAX_CUSTOM_DAYS,
      }}
      caption={periodCaption(period, now, DEMO_DATA_SINCE)}
      qrHref={qrHref}
    />
  );

  return (
    <div className="grid max-w-[1600px] gap-4 py-4 md:gap-5 md:py-6">
      <DashboardTransition filter={filter}>
        {period.invalid ? (
          <p
            role="status"
            className="flex items-start gap-2.5 rounded-md border border-line-strong bg-surface px-4 py-3 text-[13.5px] leading-snug text-fg-2"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden />
            <span>
              Cette période n'est pas valide : choisissez au plus {MAX_CUSTOM_DAYS} jours, entre le{" "}
              {formatDay(DEMO_DATA_SINCE, true)} et hier. Les chiffres ci-dessous couvrent les 30 derniers jours.{" "}
              <Link
                href={periodHref(pathname, "perso", custom)}
                scroll={false}
                className="rounded-sm font-medium text-fg underline underline-offset-4 transition-colors duration-150 hover:text-fg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Choisir une autre période
              </Link>
            </span>
          </p>
        ) : null}

        <KpiTiles tiles={kpiTiles(data)} />

        {/*
          ≥ 1280 px : courbe et entonnoir, puis chambres et parties côte à côte.
          1024–1279 px : courbe pleine largeur, entonnoir et chambres côte à côte, parties dessous.
          En dessous : une colonne.
        */}
        <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-12">
          <ActivityChart chart={data.chart} className="lg:col-span-2 xl:col-span-8" />
          <FunnelCard totals={data.totals} className="xl:col-span-4" />
          <TopRoomsCard rooms={data.topRooms} qrHref={qrHref} className="xl:col-span-5" />
          <RecentGamesCard games={data.recentGames} className="lg:col-span-2 xl:col-span-7" />
        </div>

        <Definitions />
      </DashboardTransition>
    </div>
  );
}
