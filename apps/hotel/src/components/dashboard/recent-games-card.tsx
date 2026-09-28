import { Badge, type BadgeTone, Card, cn } from "@detectivescan/ui";
import { ShieldCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import type { GameStatus, RecentGame } from "@/lib/dashboard/types";
import { PanelHeader } from "./panel-header";

const STATUS: Record<GameStatus, { label: string; tone: BadgeTone }> = {
  in_progress: { label: "En cours", tone: "neutral" },
  won: { label: "Gagnée", tone: "success" },
  lost: { label: "Perdue", tone: "neutral" },
  abandoned: { label: "Abandonnée", tone: "warning" },
};

function StatusBadge({ status }: { status: GameStatus }) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone}>
      {status === "in_progress" ? <span aria-hidden className="size-1.5 rounded-full bg-fg-2" /> : null}
      {label}
    </Badge>
  );
}

/** Avis du joueur : la forme du pouce porte le sens, la couleur le renforce. */
function Feedback({ feedback }: { feedback: RecentGame["feedback"] }) {
  if (feedback === "liked") {
    return (
      <span className="inline-flex text-success">
        <ThumbsUp className="size-4" strokeWidth={1.75} aria-hidden />
        <span className="sr-only">A aimé</span>
      </span>
    );
  }
  if (feedback === "not_liked") {
    return (
      <span className="inline-flex text-red-text">
        <ThumbsDown className="size-4" strokeWidth={1.75} aria-hidden />
        <span className="sr-only">N'a pas aimé</span>
      </span>
    );
  }
  return (
    <span className="text-fg-3">
      <span aria-hidden>—</span>
      <span className="sr-only">Pas de réponse</span>
    </span>
  );
}

/** « Chambre 12 », mais « Suite 5 » tel quel. */
const roomName = (room: string) => (/^\d/.test(room) ? `Chambre ${room}` : room);

function Player({ name }: { name: string | null }) {
  return name ? <span className="text-fg-2">{name}</span> : <span className="text-fg-3">Anonyme</span>;
}

/**
 * Dernières parties de la période : quand, où, par qui, avec quel résultat.
 * Les identités restent masquées ; un nom n'existe que si le joueur l'a accepté.
 */
export function RecentGamesCard({ games, className }: { games: RecentGame[]; className?: string }) {
  return (
    <Card aria-labelledby="games-title" className={cn("flex min-w-0 flex-col p-4 md:p-5", className)}>
      <PanelHeader id="games-title" title="Dernières parties" description="Les plus récentes de la période" />

      {games.length === 0 ? (
        <p className="mt-6 text-[13px] text-fg-3">Aucune partie sur cette période.</p>
      ) : (
        <>
          <table className="mt-4 hidden w-full text-[13.5px] md:table">
            <thead className="text-[12px] text-fg-3">
              <tr>
                <th scope="col" className="pb-2 pr-3 text-left font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 pb-2 text-left font-medium">
                  Chambre
                </th>
                <th scope="col" className="px-3 pb-2 text-left font-medium">
                  QR code
                </th>
                <th scope="col" className="px-3 pb-2 text-left font-medium">
                  Joueur
                </th>
                <th scope="col" className="px-3 pb-2 text-left font-medium">
                  Partie
                </th>
                <th scope="col" className="pb-2 pl-3 text-center font-medium">
                  Avis
                </th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-t border-line">
                  <td className="whitespace-nowrap py-2.5 pr-3 align-baseline tabular-nums text-fg-2">{game.when}</td>
                  <th scope="row" className="px-3 py-2.5 text-left align-baseline font-medium text-fg">
                    {game.room}
                  </th>
                  <td className="px-3 py-2.5 align-baseline font-mono text-[12.5px] text-fg-2">{game.qr}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 align-baseline">
                    <Player name={game.player} />
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={game.status} />
                  </td>
                  <td className="py-2.5 pl-3 text-center">
                    <Feedback feedback={game.feedback} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-3 md:hidden">
            {games.map((game) => (
              <li key={game.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-fg">
                    {roomName(game.room)}
                    <span className="ml-2 font-mono text-[12px] font-normal text-fg-3">{game.qr}</span>
                  </p>
                  <p className="mt-0.5 truncate text-[12.5px] text-fg-3">
                    <span className="tabular-nums">{game.when}</span> · <Player name={game.player} />
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {game.feedback ? <Feedback feedback={game.feedback} /> : null}
                  <StatusBadge status={game.status} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-auto flex items-start gap-2 pt-4 text-[12px] leading-snug text-fg-3">
        <ShieldCheck className="mt-px size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        Identités masquées : un nom n'apparaît que si le joueur l'a accepté.
      </p>
    </Card>
  );
}
