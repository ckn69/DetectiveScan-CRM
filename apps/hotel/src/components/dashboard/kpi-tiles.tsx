import { Card, cn } from "@detectivescan/ui";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { KpiDelta, KpiTile } from "@/lib/dashboard/kpis";

const DELTA_STYLE: Record<KpiDelta["direction"], { icon: typeof ArrowUpRight; tone: string }> = {
  up: { icon: ArrowUpRight, tone: "text-success" },
  down: { icon: ArrowDownRight, tone: "text-red-text" },
  flat: { icon: Minus, tone: "text-fg-2" },
};

function Delta({ delta }: { delta: KpiDelta | null }) {
  if (!delta) return <p className="text-[12.5px] leading-5 text-fg-3">Pas de comparaison</p>;
  const { icon: Icon, tone } = DELTA_STYLE[delta.direction];
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-[12.5px] leading-5">
      <span aria-hidden className={cn("inline-flex items-center gap-0.5 font-semibold", tone)}>
        <Icon className="size-3.5" strokeWidth={1.75} />
        {delta.text}
      </span>
      <span aria-hidden className="text-fg-3">
        vs {delta.previous}
      </span>
      <span className="sr-only">{delta.spoken}</span>
    </p>
  );
}

/** Les quatre chiffres clés, comparés à la période précédente. */
export function KpiTiles({ tiles }: { tiles: KpiTile[] }) {
  return (
    <section aria-labelledby="kpi-title">
      <h2 id="kpi-title" className="sr-only">
        Chiffres clés
      </h2>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Card key={tile.id} as="article" aria-labelledby={`kpi-${tile.id}`} className="flex min-w-0 flex-col p-4 md:p-5">
            <h3 id={`kpi-${tile.id}`} className="text-[13px] font-medium leading-snug text-fg-2">
              {tile.label}
            </h3>
            <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-fg">
              {tile.value ?? (
                <>
                  <span aria-hidden>—</span>
                  <span className="sr-only">Pas encore de données</span>
                </>
              )}
            </p>
            <div className="mt-2.5">
              <Delta delta={tile.delta} />
            </div>
            <dl className="mt-4 grid gap-2 border-t border-line pt-3.5 sm:gap-1.5">
              {tile.details.map((detail) => (
                <div key={detail.label} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-2">
                  <dt className="text-[12.5px] text-fg-3">{detail.label}</dt>
                  <dd className="text-[13.5px] font-medium tabular-nums text-fg">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </section>
  );
}
