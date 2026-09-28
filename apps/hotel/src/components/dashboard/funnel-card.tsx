import { Card, cn } from "@detectivescan/ui";
import type { Totals } from "@/lib/dashboard/types";
import { formatInteger, formatPercent, plural } from "@/lib/format";
import { PanelHeader } from "./panel-header";

type Stage = { label: string; value: number; swatch: string; note: string | null };

const share = (part: number, whole: number) => (whole > 0 ? formatPercent(part / whole) : "—");

/**
 * Du scan à la victoire : quatre étapes ordonnées, en quatre nuances du bleu des données,
 * de la plus sourde (scans) à la plus claire (victoire). Chaque barre porte sa valeur :
 * la liste se lit sans le dessin.
 */
export function FunnelCard({ totals, className }: { totals: Totals; className?: string }) {
  const stages: Stage[] = [
    { label: "Scans", value: totals.scans, swatch: "bg-viz-1", note: null },
    {
      label: "Parties commencées",
      value: totals.started,
      swatch: "bg-viz-2",
      note: `${share(totals.started, totals.scans)} des scans`,
    },
    {
      label: "Parties terminées",
      value: totals.finished,
      swatch: "bg-viz-3",
      note: `${share(totals.finished, totals.started)} des parties commencées · ${plural(totals.abandoned, "abandon")}`,
    },
    {
      label: "Parties gagnées",
      value: totals.won,
      swatch: "bg-viz-4",
      note: `${share(totals.won, totals.finished)} des parties terminées · ${plural(totals.lost, "perdue")}`,
    },
  ];

  return (
    <Card aria-labelledby="funnel-title" className={cn("flex min-w-0 flex-col p-4 md:p-5", className)}>
      <PanelHeader id="funnel-title" title="Du scan à la victoire" description="Où les joueurs s'arrêtent" />
      <ol className="mt-5 grid flex-1 content-between gap-5">
        {stages.map((stage) => {
          const width = totals.scans > 0 ? (stage.value / totals.scans) * 100 : 0;
          return (
            <li key={stage.label}>
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] text-fg-2">{stage.label}</span>
                <span className="text-[14px] font-semibold tabular-nums text-fg">{formatInteger(stage.value)}</span>
              </p>
              <div aria-hidden className="mt-2 h-2.5">
                {stage.value > 0 ? (
                  <div
                    className={cn("h-full min-w-1 rounded-r-[4px]", stage.swatch)}
                    style={{ width: `${width}%` }}
                  />
                ) : null}
              </div>
              {stage.note && totals.scans > 0 ? (
                <p className="mt-1.5 text-[12px] leading-snug text-fg-3">{stage.note}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
