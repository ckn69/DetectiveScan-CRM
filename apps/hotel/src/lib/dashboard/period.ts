import { dateFromDay, type DayNumber, dayFromIso, isoFromDay, type LocalNow } from "../dates";
import { formatDay, formatDayOfMonth, formatTime } from "../format";

/**
 * Période du dashboard, portée par l'URL (`?periode=7j`, ou `?periode=perso&du=…&au=…`)
 * pour qu'un lien partagé ouvre la même vue. Sans paramètre : les 30 derniers jours.
 *
 * Les périodes en jours s'arrêtent à hier (journées complètes, comparées à des journées
 * complètes) ; « Aujourd'hui » montre la journée en cours, comparée à hier à la même heure.
 */
export type PeriodKey = "aujourdhui" | "7j" | "30j" | "3m" | "perso";

export const DEFAULT_PERIOD: PeriodKey = "30j";

/** Durée maximale d'une période personnalisée, en jours. */
export const MAX_CUSTOM_DAYS = 92;

export type PeriodOption = {
  key: PeriodKey;
  /** Libellé complet (nom accessible). */
  label: string;
  /** Libellé court sous 640 px ; absent quand une icône le remplace. */
  short?: string;
};

export const PERIOD_OPTIONS: PeriodOption[] = [
  { key: "aujourdhui", label: "Aujourd'hui", short: "Aujourd'hui" },
  { key: "7j", label: "7 jours", short: "7 j" },
  { key: "30j", label: "30 jours", short: "30 j" },
  { key: "3m", label: "3 mois", short: "3 mois" },
  { key: "perso", label: "Personnalisé" },
];

const ROLLING_DAYS: Record<"7j" | "30j" | "3m", number> = { "7j": 7, "30j": 30, "3m": 90 };

/** Heure de coupure d'une journée en cours. */
export type Cutoff = { hour: number; minute: number };

/** Jours `from` à `to` inclus ; `cutoff` arrête le dernier jour à une heure donnée. */
export type DayRange = { from: DayNumber; to: DayNumber; cutoff: Cutoff | null };

export type Period = {
  key: PeriodKey;
  range: DayRange;
  /** Même durée juste avant ; `null` quand elle commencerait avant les premières données. */
  previous: DayRange | null;
  granularity: "hour" | "day";
  days: number;
  /** Période personnalisée refusée : on affiche les 30 derniers jours à la place. */
  invalid: boolean;
};

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

/** Premier et dernier jour sélectionnables dans une période personnalisée. */
export function customBounds(now: LocalNow, dataSince: DayNumber): { min: DayNumber; max: DayNumber } {
  return { min: dataSince, max: now.day - 1 };
}

function dayPeriod(key: PeriodKey, from: DayNumber, to: DayNumber, dataSince: DayNumber): Period {
  const days = to - from + 1;
  const previousFrom = from - days;
  return {
    key,
    range: { from, to, cutoff: null },
    previous: previousFrom >= dataSince ? { from: previousFrom, to: from - 1, cutoff: null } : null,
    granularity: "day",
    days,
    invalid: false,
  };
}

export function resolvePeriod(searchParams: SearchParams, now: LocalNow, dataSince: DayNumber): Period {
  const yesterday = now.day - 1;
  const key = first(searchParams.periode);

  if (key === "aujourdhui") {
    const cutoff = { hour: now.hour, minute: now.minute };
    return {
      key,
      range: { from: now.day, to: now.day, cutoff },
      previous: yesterday >= dataSince ? { from: yesterday, to: yesterday, cutoff } : null,
      granularity: "hour",
      days: 1,
      invalid: false,
    };
  }

  if (key === "7j" || key === "3m") {
    return dayPeriod(key, yesterday - ROLLING_DAYS[key] + 1, yesterday, dataSince);
  }

  const fallback = dayPeriod("30j", yesterday - ROLLING_DAYS["30j"] + 1, yesterday, dataSince);

  if (key === "perso") {
    const from = dayFromIso(first(searchParams.du) ?? "");
    const to = dayFromIso(first(searchParams.au) ?? "");
    const { min, max } = customBounds(now, dataSince);
    const valid =
      from !== null && to !== null && from <= to && from >= min && to <= max && to - from + 1 <= MAX_CUSTOM_DAYS;
    return valid ? dayPeriod("perso", from, to, dataSince) : { ...fallback, invalid: true };
  }

  return fallback;
}

/** Lien vers une période ; la période par défaut n'ajoute aucun paramètre. */
export function periodHref(pathname: string, key: PeriodKey, range?: { from: DayNumber; to: DayNumber }): string {
  if (key === DEFAULT_PERIOD) return pathname;
  if (key === "perso" && range) {
    return `${pathname}?periode=perso&du=${isoFromDay(range.from)}&au=${isoFromDay(range.to)}`;
  }
  return `${pathname}?periode=${key}`;
}

/** Plage proposée à l'ouverture de « Personnalisé » : la période affichée, ou les 7 derniers jours. */
export function customDefault(period: Period, now: LocalNow, dataSince: DayNumber): { from: DayNumber; to: DayNumber } {
  if (period.granularity === "day") return { from: period.range.from, to: period.range.to };
  const { min, max } = customBounds(now, dataSince);
  return { from: Math.max(min, max - 6), to: max };
}

/** Phrase sous le filtre : ce que couvrent les chiffres et à quoi ils sont comparés. */
export function periodCaption(period: Period, now: LocalNow, dataSince: DayNumber): string {
  const noComparison = ` Pas de comparaison : les données commencent le ${formatDay(dataSince, true)}.`;

  if (period.granularity === "hour") {
    const base = `Aujourd'hui jusqu'à ${formatTime(now.hour, now.minute)}`;
    return period.previous ? `${base}, comparé à hier à la même heure.` : `${base}.${noComparison}`;
  }

  const { from, to } = period.range;
  const [start, end] = [dateFromDay(from), dateFromDay(to)];
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  const range =
    period.days === 1
      ? `Le ${formatDay(from, true)}`
      : `Du ${sameMonth ? formatDayOfMonth(from) : formatDay(from, !sameYear)} au ${formatDay(to, true)}`;

  if (!period.previous) return `${range}.${noComparison}`;
  return period.days === 1 ? `${range}, comparé à la veille.` : `${range}, comparé aux ${period.days} jours précédents.`;
}
