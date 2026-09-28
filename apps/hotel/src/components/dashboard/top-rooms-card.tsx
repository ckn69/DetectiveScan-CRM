import { Card, cn } from "@detectivescan/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { RoomStat } from "@/lib/dashboard/types";
import { formatInteger, formatPercent } from "@/lib/format";
import { PanelHeader } from "./panel-header";

/** Les chambres où l'on scanne le plus, avec leur QR code et leur taux de participation. */
export function TopRoomsCard({ rooms, qrHref, className }: { rooms: RoomStat[]; qrHref: string; className?: string }) {
  return (
    <Card aria-labelledby="rooms-title" className={cn("flex min-w-0 flex-col p-4 md:p-5", className)}>
      <PanelHeader id="rooms-title" title="Chambres les plus actives" description="Classées par nombre de scans">
        <Link
          href={qrHref}
          className="-mr-1 inline-flex h-8 items-center gap-1 rounded-sm px-1 text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Toutes les chambres
          <ChevronRight className="size-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </PanelHeader>

      {rooms.length === 0 ? (
        <p className="mt-6 text-[13px] text-fg-3">Aucun scan sur cette période.</p>
      ) : (
        <table className="mt-4 w-full text-[13.5px]">
          <thead className="text-[12px] text-fg-3">
            <tr>
              <th scope="col" className="pb-2 pr-3 text-left font-medium">
                Chambre
              </th>
              <th scope="col" className="px-3 pb-2 text-left font-medium">
                QR code
              </th>
              <th scope="col" className="px-3 pb-2 text-right font-medium">
                Scans
              </th>
              <th scope="col" className="pb-2 pl-3 text-right font-medium">
                Participation
              </th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.qr} className="border-t border-line">
                <th scope="row" className="py-2.5 pr-3 text-left align-baseline font-medium text-fg">
                  {room.room}
                </th>
                <td className="px-3 py-2.5 align-baseline font-mono text-[12.5px] text-fg-2">{room.qr}</td>
                <td className="px-3 py-2.5 text-right align-baseline tabular-nums text-fg">{formatInteger(room.scans)}</td>
                <td className="py-2.5 pl-3 text-right align-baseline tabular-nums text-fg-2">
                  {room.participation === null ? (
                    <>
                      <span aria-hidden>—</span>
                      <span className="sr-only">Pas assez de scans</span>
                    </>
                  ) : (
                    formatPercent(room.participation)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rooms.some((room) => room.participation === null) ? (
        <p className="mt-auto pt-4 text-[12px] leading-snug text-fg-3">
          Participation affichée à partir de 5 scans par chambre.
        </p>
      ) : null}
    </Card>
  );
}
