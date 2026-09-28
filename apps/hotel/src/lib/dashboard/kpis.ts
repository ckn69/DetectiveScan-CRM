import { formatDecimal, formatInteger, formatPercent, formatSigned } from "../format";
import type { DashboardData, Totals } from "./types";

/** Évolution par rapport à la période précédente. Pour tous ces indicateurs, une hausse est une bonne nouvelle. */
export type KpiDelta = {
  direction: "up" | "down" | "flat";
  /** « +18 % », « −2 pts », « Stable ». */
  text: string;
  /** Valeur de la période précédente : « 1 088 », « 55 % ». */
  previous: string;
  /** Phrase complète pour les lecteurs d'écran. */
  spoken: string;
};

export type KpiTile = {
  id: string;
  label: string;
  /** Valeur affichée, ou `null` faute de données (division par zéro). */
  value: string | null;
  delta: KpiDelta | null;
  details: { label: string; value: string }[];
};

const ratio = (part: number, whole: number): number | null => (whole > 0 ? part / whole : null);
const percentOrDash = (value: number | null): string => (value === null ? "—" : formatPercent(value));

function spoken(direction: KpiDelta["direction"], amount: string, previous: string): string {
  if (direction === "flat") return `Stable par rapport à la période précédente (${previous}).`;
  return `En ${direction === "up" ? "hausse" : "baisse"} de ${amount} par rapport à la période précédente (${previous}).`;
}

function countDelta(value: number, previous: number | undefined): KpiDelta | null {
  if (previous === undefined || previous === 0) return null;
  const change = Math.round(((value - previous) / previous) * 100);
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const previousText = formatInteger(previous);
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

/** Les quatre chiffres clés et leurs sous-indicateurs : les dix indicateurs du dashboard. */
export function kpiTiles({ totals, previous, rooms }: DashboardData): KpiTile[] {
  const participationRate = participation(totals);
  const liked = likedShare(totals);

  return [
    {
      id: "scans",
      label: "Scans",
      value: formatInteger(totals.scans),
      delta: countDelta(totals.scans, previous?.scans),
      details: [
        { label: "Visiteurs uniques", value: formatInteger(totals.visitors) },
        { label: "Scans par chambre", value: rooms > 0 ? formatDecimal(totals.scans / rooms) : "—" },
      ],
    },
    {
      id: "players",
      label: "Joueurs",
      value: formatInteger(totals.players),
      delta: countDelta(totals.players, previous?.players),
      details: [
        { label: "Gagnants", value: formatInteger(totals.won) },
        { label: "Perdants", value: formatInteger(totals.lost) },
      ],
    },
    {
      id: "participation",
      label: "Taux de participation",
      value: participationRate === null ? null : formatPercent(participationRate),
      delta: rateDelta(participationRate, previous ? participation(previous) : undefined),
      details: [
        { label: "Parties commencées", value: formatInteger(totals.started) },
        { label: "Parties terminées", value: formatInteger(totals.finished) },
      ],
    },
    {
      id: "liked",
      label: "Ont aimé l'expérience",
      value: liked === null ? null : formatPercent(liked),
      delta: rateDelta(liked, previous ? likedShare(previous) : undefined),
      details: [
        { label: "Taux de satisfaction", value: percentOrDash(ratio(totals.satisfied, totals.answers)) },
        { label: "N'ont pas aimé", value: percentOrDash(ratio(totals.answers - totals.liked, totals.answers)) },
      ],
    },
  ];
}
