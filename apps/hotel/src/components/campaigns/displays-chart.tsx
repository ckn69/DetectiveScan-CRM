"use client";

import { Button, Card, cn } from "@detectivescan/ui";
import { ChartColumn, Table2 } from "lucide-react";
import { type KeyboardEvent, type PointerEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { niceScale, xTicks } from "@/lib/chart-scale";
import type { DayNumber } from "@/lib/dates";
import { formatDay, formatInteger, formatWeekday, plural } from "@/lib/format";
import { PanelHeader } from "../dashboard/panel-header";

type Point = { day: DayNumber; displays: number };

const describe = (point: Point) => `${formatWeekday(point.day)} : ${plural(point.displays, "affichage")}.`;

/*
 * Affichages d'une campagne, jour par jour : une seule série, donc une seule nuance du bleu
 * des données (`viz-1`) et pas de légende. Barres de 24 px au plus, bout arrondi de 4 px,
 * 2 px d'air entre deux jours ; info-bulle au survol et au clavier, vue tableau.
 */
export function DisplaysChart({
  points,
  emptyText,
  className,
}: {
  points: Point[];
  /** Phrase affichée quand il n'y a encore aucun jour à tracer. */
  emptyText: string;
  className?: string;
}) {
  const titleId = useId();
  const summaryId = useId();
  const [showTable, setShowTable] = useState(false);

  const first = points[0];
  const last = points.at(-1);
  const total = points.reduce((sum, point) => sum + point.displays, 0);
  const peak = points.reduce<Point | null>((best, point) => (!best || point.displays > best.displays ? point : best), null);
  const range = first && last ? (first.day === last.day ? `Le ${formatDay(first.day)}` : `Du ${formatDay(first.day)} au ${formatDay(last.day)}`) : "";

  return (
    <Card aria-labelledby={titleId} className={cn("flex min-w-0 flex-col p-4 md:p-5", className)}>
      <PanelHeader id={titleId} title="Affichages par jour" description={range || undefined}>
        {points.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setShowTable((value) => !value)} className="-mr-2">
            {showTable ? <ChartColumn strokeWidth={1.75} aria-hidden /> : <Table2 strokeWidth={1.75} aria-hidden />}
            {showTable ? "Graphique" : "Tableau"}
          </Button>
        ) : null}
      </PanelHeader>

      <p id={summaryId} className="sr-only">
        {peak && peak.displays > 0
          ? `${range} : ${plural(total, "affichage")} au total, ${plural(peak.displays, "affichage")} au plus haut, le ${formatWeekday(peak.day)}.`
          : "Aucun affichage pour l'instant."}
      </p>

      <div className={cn("mt-5", !showTable && "h-[200px] sm:h-[228px]")}>
        {showTable ? (
          <DataTable points={points} titleId={titleId} />
        ) : (
          <Plot points={points} peak={peak} emptyText={emptyText} titleId={titleId} summaryId={summaryId} />
        )}
      </div>
    </Card>
  );
}

function Plot({
  points,
  peak,
  emptyText,
  titleId,
  summaryId,
}: {
  points: Point[];
  peak: Point | null;
  emptyText: string;
  titleId: string;
  summaryId: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const count = points.length;
  const scale = niceScale(Math.max(0, ...points.map((point) => point.displays)));
  const ticks = xTicks(count, "day");
  const empty = points.every((point) => point.displays === 0);
  const lastIndex = count - 1;

  const center = (index: number) => ((index + 0.5) / Math.max(1, count)) * 100;
  const height = (value: number) => (value / scale.top) * 100;
  const current = active === null ? null : points[active];

  function locate(event: PointerEvent<HTMLDivElement>) {
    if (count === 0) return;
    const box = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - box.left) / box.width) * count);
    setActive(Math.min(lastIndex, Math.max(0, index)));
  }

  function move(event: KeyboardEvent<HTMLDivElement>) {
    if (count === 0) return;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = Math.min(lastIndex, (active ?? -1) + 1);
        break;
      case "ArrowLeft":
        next = Math.max(0, (active ?? count) - 1);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = lastIndex;
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
    <div className="relative h-full pb-7 pl-10 pt-5">
      <div className="relative h-full">
        {scale.ticks.map((tick) => (
          <div
            key={tick}
            aria-hidden
            className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-line-strong" : "border-line")}
            style={{ bottom: `${height(tick)}%` }}
          >
            <span className="absolute right-full top-0 mr-3 -translate-y-1/2 text-[11.5px] tabular-nums text-fg-3">
              {formatInteger(tick)}
            </span>
          </div>
        ))}

        {ticks.map((index, position) => {
          const point = points[index];
          if (!point) return null;
          const edge = count > 1 && index === lastIndex ? "end" : count > 1 && index === 0 ? "start" : "middle";
          return (
            <span
              key={index}
              aria-hidden
              className={cn(
                "absolute top-full mt-2 whitespace-nowrap text-[11.5px] tabular-nums text-fg-3",
                edge === "middle" && "-translate-x-1/2",
                (ticks.length - 1 - position) % 2 === 1 && "max-sm:hidden",
              )}
              style={edge === "end" ? { right: 0 } : edge === "start" ? { left: 0 } : { left: `${center(index)}%` }}
            >
              {formatDay(point.day)}
            </span>
          );
        })}

        {empty ? (
          <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-[13px] text-fg-3">
            {count === 0 ? emptyText : "Aucun affichage sur ces jours."}
          </p>
        ) : (
          points.map((point, index) =>
            point.displays > 0 ? (
              <div
                key={point.day}
                aria-hidden
                className={cn(
                  "absolute bottom-0 -translate-x-1/2 rounded-t-[4px] bg-viz-1 transition-[filter] duration-150",
                  active === index && "brightness-[1.35]",
                )}
                style={{
                  left: `${center(index)}%`,
                  width: `min(24px, calc(${100 / count}% - 2px))`,
                  height: `${height(point.displays)}%`,
                }}
              />
            ) : null,
          )
        )}

        {/* Une seule valeur écrite : le jour le plus haut ; les autres sont dans l'info-bulle et le tableau. */}
        {!empty && peak && active === null ? (
          <span
            aria-hidden
            className="absolute mb-1.5 -translate-x-1/2 text-[12px] font-medium tabular-nums text-fg-2"
            style={{ left: `${center(points.indexOf(peak))}%`, bottom: `${height(peak.displays)}%` }}
          >
            {formatInteger(peak.displays)}
          </span>
        ) : null}

        {current && active !== null && !empty ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 z-10 w-max rounded-md border border-line-strong bg-raised px-3 py-2.5 shadow-pop",
              center(active) > 55 ? "-translate-x-[calc(100%+14px)]" : "translate-x-[14px]",
            )}
            style={{ left: `${center(active)}%` }}
          >
            <p className="text-[12px] text-fg-3">{formatWeekday(current.day)}</p>
            <p className="mt-1.5 flex items-center gap-2 text-[13px]">
              <span className="h-2.5 w-1 rounded-full bg-viz-1" />
              <span className="font-semibold tabular-nums text-fg">{formatInteger(current.displays)}</span>
              <span className="text-fg-2">{current.displays >= 2 ? "affichages" : "affichage"}</span>
            </p>
          </div>
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
            const point = points[lastIndex];
            if (active === null && point) {
              setActive(lastIndex);
              setAnnouncement(describe(point));
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

function DataTable({ points, titleId }: { points: Point[]; titleId: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const measure = useCallback(() => {
    const box = scroller.current;
    if (box) setMoreBelow(box.scrollTop + box.clientHeight < box.scrollHeight - 1);
  }, []);
  useEffect(measure, [measure, points]);

  return (
    <div className="grid gap-2">
      <p className="text-[12.5px] text-fg-3">{`${plural(points.length, "jour")}, du plus récent au plus ancien.`}</p>
      <div className="relative">
        <div
          ref={scroller}
          onScroll={measure}
          role="region"
          tabIndex={0}
          aria-labelledby={titleId}
          className="max-h-[26rem] overflow-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-surface text-[12px] text-fg-3">
              <tr>
                <th scope="col" className="py-2 pr-3 text-left font-medium">
                  Jour
                </th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">
                  Affichages
                </th>
              </tr>
            </thead>
            <tbody>
              {[...points].reverse().map((point) => (
                <tr key={point.day} className="border-t border-line">
                  <th scope="row" className="py-2 pr-3 text-left font-normal text-fg-2">
                    {formatWeekday(point.day)}
                  </th>
                  <td className="py-2 pl-3 text-right tabular-nums text-fg">{formatInteger(point.displays)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Fondu du bas tant qu'il reste des lignes à faire défiler. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-surface to-transparent transition-opacity duration-150",
            moreBelow ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </div>
  );
}
