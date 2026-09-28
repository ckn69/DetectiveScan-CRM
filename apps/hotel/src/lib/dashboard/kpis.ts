import { formatDecimal, formatInteger, formatPercent, formatSigned } from "../format";
import type { DashboardData, Totals } from "./types";

/** Évolution par rapport à la période précédente. Pour tous ces indicateurs, une hausse est une bonne nouvelle. */
export type KpiDelta = {
  direction: "up" | "down" | "flat";
  /** « +18 % », « −6 », « −2 pts », « Stable ». */
  text: string;
  /** Valeur de la période précédente : « 1 088 », « 55 % ». */
  previous: string;
  /** Phrase complète pour les lecteurs d'écran. */
  spoken: string;
};

export type KpiDetail = {
  label: string;
  value: string;
  /** Valeur de la période précédente, `null` sans comparaison. */
  previous: string | null;
};

export type KpiTile = {
  id: string;
  label: string;
  /** Valeur affichée, ou `null` faute de données (division par zéro). */
  value: string | null;
  delta: KpiDelta | null;
  details: KpiDetail[];
};

/** Sous ce nombre, un pourcentage d'évolution exagère : on montre l'écart en valeur. */
const SMALL_BASE = 20;

const ratio = (part: number, whole: number): number | null => (whole > 0 ? part / whole : null);
const percentOrDash = (value: number | null): string => (value === null ? "—" : formatPercent(value));

function spoken(direction: KpiDelta["direction"], amount: string, previous: string): string {
  if (direction === "flat") return `Stable par rapport à la période précédente (${previous}).`;
  return `En ${direction === "up" ? "hausse" : "baisse"} de ${amount} par rapport à la période précédente (${previous}).`;
}

function countDelta(value: number, previous: number | undefined): KpiDelta | null {
  if (previous === undefined || previous === 0) return null;
  const previousText = formatInteger(previous);

  if (previous < SMALL_BASE) {
    const gap = value - previous;
    const direction = gap > 0 ? "up" : gap < 0 ? "down" : "flat";
    return {
      direction,
      text: direction === "flat" ? "Stable" : formatSigned(gap),
      previous: previousText,
      spoken: spoken(direction, formatInteger(Math.abs(gap)), previousText),
    };
  }

  const change = Math.round(((value - previous) / previous) * 100);
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  return {
    direction,
    text: direction === "flat" ? "Stable" : formatSigned(change, "%"),
    previous: previousText,
    spoken: spoken(direction, `${Math.abs(change)} %`, previousText),
  };
}

function rateDelta(value: number | null, previous: number | null | undefined): KpiDelta | null {
  if (value === null || previous === null || previous === undefined) return null;
  const change = Math.round((value - previous) * 100);
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const previousText = formatPercent(previous);
  const points = Math.abs(change) > 1 ? "points" : "point";
  return {
    direction,
    text: direction === "flat" ? "Stable" : formatSigned(change, "pts"),
    previous: previousText,
    spoken: spoken(direction, `${Math.abs(change)} ${points}`, previousText),
  };
}

const participation = (totals: Totals) => ratio(totals.players, totals.visitors);
const likedShare = (totals: Totals) => ratio(totals.liked, totals.answers);
const satisfaction = (totals: Totals) => ratio(totals.satisfied, totals.answers);
const dislikedShare = (totals: Totals) => ratio(totals.answers - totals.liked, totals.answers);

/** Les quatre chiffres clés et leurs sous-indicateurs, chacun avec sa valeur précédente : les dix indicateurs. */
export function kpiTiles({ totals, previous, rooms }: DashboardData): KpiTile[] {
  const participationRate = participation(totals);
  const liked = likedShare(totals);

  const count = (label: string, pick: (t: Totals) => number): KpiDetail => ({
    label,
    value: formatInteger(pick(totals)),
    previous: previous ? formatInteger(pick(previous)) : null,
  });
  const rate = (label: string, pick: (t: Totals) => number | null): KpiDetail => ({
    label,
    value: percentOrDash(pick(totals)),
    previous: previous && pick(previous) !== null ? percentOrDash(pick(previous)) : null,
  });
  const perRoom = (t: Totals) => (rooms > 0 ? formatDecimal(t.scans / rooms) : "—");

  return [
    {
      id: "scans",
      label: "Scans",
      value: formatInteger(totals.scans),
      delta: countDelta(totals.scans, previous?.scans),
      details: [
        count("Visiteurs uniques", (t) => t.visitors),
        { label: "Scans par chambre", value: perRoom(totals), previous: previous ? perRoom(previous) : null },
      ],
    },
    {
      id: "players",
      label: "Joueurs",
      value: formatInteger(totals.players),
      delta: countDelta(totals.players, previous?.players),
      details: [count("Gagnants", (t) => t.won), count("Perdants", (t) => t.lost)],
    },
    {
      id: "participation",
      label: "Taux de participation",
      value: participationRate === null ? null : formatPercent(participationRate),
      delta: rateDelta(participationRate, previous ? participation(previous) : undefined),
      details: [count("Parties commencées", (t) => t.started), count("Parties terminées", (t) => t.finished)],
    },
    {
      id: "liked",
      label: "Ont aimé l'expérience",
      value: liked === null ? null : formatPercent(liked),
      delta: rateDelta(liked, previous ? likedShare(previous) : undefined),
      details: [rate("Taux de satisfaction", satisfaction), rate("N'ont pas aimé", dislikedShare)],
    },
  ];
}
