"use client";

import { Button, Card, cn } from "@detectivescan/ui";
import { ChartLine, Table2 } from "lucide-react";
import { type KeyboardEvent, type PointerEvent, useId, useState } from "react";
import type { ActivityChart as ActivityChartData, ChartPoint } from "@/lib/dashboard/types";
import { formatHour, formatInteger, plural } from "@/lib/format";
import { PanelHeader } from "./panel-header";

/*
 * Courbes des scans et des parties commencées. Deux étapes du même parcours : elles
 * portent les deux premières nuances du bleu des données, la plus vive pour les
 * parties. Un seul axe, lignes de 2 px, curseur au survol et au clavier, vue tableau.
 */

const SERIES = [
  { key: "scans", label: "Scans", unit: ["scan", "scans"], stroke: "stroke-viz-1", swatch: "bg-viz-1" },
  {
    key: "games",
    label: "Parties commencées",
    unit: ["partie commencée", "parties commencées"],
    stroke: "stroke-viz-2",
    swatch: "bg-viz-2",
  },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

/** Graduations rondes (0, 20, 40…) couvrant `max`, en entiers ; au moins 0 à 4 pour les petites valeurs. */
function niceScale(max: number): { top: number; ticks: number[] } {
  if (max <= 4) return { top: 4, ticks: [0, 1, 2, 3, 4] };
  const rough = max / 4;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * power).find((s) => s >= rough) ?? 10 * power);
  const top = Math.max(step, Math.ceil(max / step) * step);
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

/** Positions étiquetées sur l'axe horizontal, en partant de la plus récente. */
function xTicks(count: number, granularity: "hour" | "day"): number[] {
  if (granularity === "hour") return [0, 6, 12, 18, 23];
  const step = count <= 8 ? 1 : count <= 16 ? 2 : 7 * Math.ceil(count / 42);
  const ticks: number[] = [];
  for (let index = count - 1; index >= 0; index -= step) ticks.unshift(index);
  return ticks;
}

const describe = (point: ChartPoint) =>
  `${point.label} : ${formatInteger(point.scans)} scans, ${formatInteger(point.games)} parties commencées.`;

export function ActivityChart({ chart, className }: { chart: ActivityChartData; className?: string }) {
  const titleId = useId();
  const summaryId = useId();
  const [showTable, setShowTable] = useState(false);
  const { points, slots, granularity } = chart;

  return (
    <Card aria-labelledby={titleId} className={cn("flex min-w-0 flex-col p-4 md:p-5", className)}>
      <PanelHeader
        id={titleId}
        title="Scans et parties commencées"
        description={granularity === "hour" ? "Par heure, aujourd'hui" : "Par jour"}
      >
        <div className="flex items-center gap-4">
          {showTable ? null : (
            <ul aria-label="Légende" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-fg-2">
              {SERIES.map((series) => (
                <li key={series.key} className="flex items-center gap-2">
                  <span aria-hidden className={cn("h-0.5 w-3.5 rounded-full", series.swatch)} />
                  {series.label}
                </li>
              ))}
            </ul>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowTable((value) => !value)} className="-mr-2">
            {showTable ? <ChartLine strokeWidth={1.75} aria-hidden /> : <Table2 strokeWidth={1.75} aria-hidden />}
            {showTable ? "Graphique" : "Tableau"}
          </Button>
        </div>
      </PanelHeader>

      <p id={summaryId} className="sr-only">
        {chart.summary}
      </p>

      <div className="mt-5 h-[228px] sm:h-[264px]">
        {showTable ? (
          <DataTable points={points} granularity={granularity} titleId={titleId} />
        ) : (
          <Plot points={points} slots={slots} granularity={granularity} titleId={titleId} summaryId={summaryId} />
        )}
      </div>
    </Card>
  );
}

function Plot({
  points,
  slots,
  granularity,
  titleId,
  summaryId,
}: {
  points: ChartPoint[];
  slots: number;
  granularity: "hour" | "day";
  titleId: string;
  summaryId: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const scale = niceScale(Math.max(0, ...points.map((point) => point.scans)));
  const ticks = xTicks(points.length, granularity);
  const empty = points.every((point) => point.scans === 0);

  const x = (index: number) => (slots > 1 ? (index / (slots - 1)) * 100 : 50);
  const y = (value: number) => (1 - value / scale.top) * 100;

  // Tracés dans un repère 1000 × 1000 étiré sur la zone : le trait garde 2 px (non-scaling-stroke).
  const line = (key: SeriesKey) =>
    points.map((point, index) => `${index === 0 ? "M" : "L"}${x(index) * 10},${y(point[key]) * 10}`).join(" ");
  const paths = { scans: line("scans"), games: line("games") };
  const area = points.length > 1 ? `${paths.scans} L${x(points.length - 1) * 10},1000 L0,1000 Z` : "";

  const last = points.length - 1;
  const lastPoint = points[last];
  const endLabels =
    lastPoint && !empty && Math.abs(y(lastPoint.scans) - y(lastPoint.games)) >= 9 ? lastPoint : null;
  const current = active === null ? null : points[active];

  function locate(event: PointerEvent<HTMLDivElement>) {
    if (points.length === 0) return;
    const box = event.currentTarget.getBoundingClientRect();
    const position = slots > 1 ? ((event.clientX - box.left) / box.width) * (slots - 1) : 0;
    setActive(Math.min(last, Math.max(0, Math.round(position))));
  }

  function move(event: KeyboardEvent<HTMLDivElement>) {
    if (points.length === 0) return;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = Math.min(last, (active ?? -1) + 1);
        break;
      case "ArrowLeft":
        next = Math.max(0, (active ?? last + 1) - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      case "Escape":
        setActive(null);
        return;
      default:
        return;
    }
    event.preventDefault();
    setActive(next);
    const point = points[next];
    if (point) setAnnouncement(describe(point));
  }

  return (
    <div className="relative h-full pb-7 pl-10 pr-10 pt-3">
      <div className="relative h-full">
        {scale.ticks.map((tick) => (
          <div
            key={tick}
            aria-hidden
            className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-line-strong" : "border-line")}
            style={{ top: `${y(tick)}%` }}
          >
            <span className="absolute right-full top-0 mr-3 -translate-y-1/2 text-[11.5px] tabular-nums text-fg-3">
              {formatInteger(tick)}
            </span>
          </div>
        ))}

        {ticks.map((index, position) => {
          const point = granularity === "hour" ? null : points[index];
          const label = granularity === "hour" ? formatHour(index) : point?.tick;
          if (!label) return null;
          const edge = index === 0 ? "start" : x(index) >= 99.9 ? "end" : "middle";
          return (
            <span
              key={index}
              aria-hidden
              className={cn(
                "absolute top-full mt-2 whitespace-nowrap text-[11.5px] tabular-nums text-fg-3",
                edge === "middle" && "-translate-x-1/2",
                edge === "end" && "-translate-x-full",
                // Sous 640 px, une étiquette sur deux (la plus récente reste).
                (ticks.length - 1 - position) % 2 === 1 && "max-sm:hidden",
              )}
              style={{ left: `${x(index)}%` }}
            >
              {label}
            </span>
          );
        })}

        {empty ? (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-[13px] text-fg-3">
            {points.length === 0 && granularity === "hour"
              ? "Le détail heure par heure apparaît après la première heure complète."
              : "Aucun scan sur cette période."}
          </p>
        ) : (
          <svg
            aria-hidden
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {area ? <path d={area} className="fill-viz-1/10" /> : null}
            {SERIES.map((series) => (
              <path
                key={series.key}
                d={paths[series.key]}
                className={cn("fill-none", series.stroke)}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        )}

        {endLabels
          ? SERIES.map((series) => (
              <span
                key={series.key}
                aria-hidden
                className="absolute ml-2 -translate-y-1/2 text-[12px] font-medium tabular-nums text-fg-2"
                style={{ left: `${x(last)}%`, top: `${y(endLabels[series.key])}%` }}
              >
                {formatInteger(endLabels[series.key])}
              </span>
            ))
          : null}

        {/* Un seul point : pas de ligne à tracer, on montre les points. */}
        {!empty && points.length === 1 && lastPoint
          ? SERIES.map((series) => (
              <span
                key={series.key}
                aria-hidden
                className={cn("absolute size-2.5 -translate-1/2 rounded-full ring-2 ring-surface", series.swatch)}
                style={{ left: `${x(0)}%`, top: `${y(lastPoint[series.key])}%` }}
              />
            ))
          : null}

        {current && active !== null && !empty ? (
          <>
            <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-white/25" style={{ left: `${x(active)}%` }} />
            {SERIES.map((series) => (
              <span
                key={series.key}
                aria-hidden
                className={cn(
                  "pointer-events-none absolute size-2.5 -translate-1/2 rounded-full ring-2 ring-surface",
                  series.swatch,
                )}
                style={{ left: `${x(active)}%`, top: `${y(current[series.key])}%` }}
              />
            ))}
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-0 z-10 w-max rounded-md border border-line-strong bg-raised px-3 py-2.5 shadow-pop",
                x(active) > 55 ? "-ml-3 -translate-x-full" : "ml-3",
              )}
              style={{ left: `${x(active)}%` }}
            >
              <p className="text-[12px] text-fg-3">{current.label}</p>
              <ul className="mt-1.5 grid gap-1">
                {SERIES.map((series) => (
                  <li key={series.key} className="flex items-center gap-2 text-[13px]">
                    <span className={cn("h-0.5 w-3 rounded-full", series.swatch)} />
                    <span className="font-semibold tabular-nums text-fg">{formatInteger(current[series.key])}</span>
                    <span className="text-fg-2">{current[series.key] >= 2 ? series.unit[1] : series.unit[0]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : null}

        <div
          role="group"
          tabIndex={empty ? -1 : 0}
          aria-labelledby={titleId}
          aria-describedby={summaryId}
          aria-roledescription="graphique"
          onPointerMove={locate}
          onPointerDown={locate}
          onPointerLeave={() => setActive(null)}
          onFocus={() => {
            if (active === null && lastPoint) {
              setActive(last);
              setAnnouncement(describe(lastPoint));
            }
          }}
          onBlur={() => setActive(null)}
          onKeyDown={move}
          className="absolute inset-0 touch-pan-y rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        />
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </div>
  );
}

function DataTable({
  points,
  granularity,
  titleId,
}: {
  points: ChartPoint[];
  granularity: "hour" | "day";
  titleId: string;
}) {
  return (
    <div
      role="region"
      tabIndex={0}
      aria-labelledby={titleId}
      className="h-full overflow-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <table className="w-full text-[13px]">
        <thead className="sticky top-0 bg-surface text-[12px] text-fg-3">
          <tr>
            <th scope="col" className="py-2 pr-3 text-left font-medium">
              {granularity === "hour" ? "Heure" : "Jour"}
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Scans
            </th>
            <th scope="col" className="py-2 pl-3 text-right font-medium">
              Parties commencées
            </th>
          </tr>
        </thead>
        <tbody>
          {points.length === 0 ? (
            <tr className="border-t border-line">
              <td colSpan={3} className="py-3 text-fg-3">
                Pas encore de données sur cette période.
              </td>
            </tr>
          ) : (
            [...points].reverse().map((point) => (
              <tr key={point.label} className="border-t border-line">
                <th scope="row" className="py-2 pr-3 text-left font-normal text-fg-2">
                  {point.label}
                </th>
                <td className="px-3 py-2 text-right tabular-nums text-fg">{formatInteger(point.scans)}</td>
                <td className="py-2 pl-3 text-right tabular-nums text-fg">{formatInteger(point.games)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
