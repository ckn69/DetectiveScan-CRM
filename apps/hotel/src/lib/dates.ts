/**
 * Dates « civiles » (un jour, sans heure) représentées par leur numéro de jour
 * depuis le 1er janvier 1970. Les périodes se calculent sur ces numéros :
 * aucun fuseau ni changement d'heure à gérer dans les additions de jours.
 */
export type DayNumber = number;

const MS_PER_DAY = 86_400_000;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `2026-09-27` → numéro de jour, ou `null` si la chaîne n'est pas une date réelle. */
export function dayFromIso(iso: string): DayNumber | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date.getTime() / MS_PER_DAY;
}

export function isoFromDay(day: DayNumber): string {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Minuit UTC du jour : à formater avec `timeZone: "UTC"`. */
export function dateFromDay(day: DayNumber): Date {
  return new Date(day * MS_PER_DAY);
}

/** 0 = dimanche … 6 = samedi (le 1er janvier 1970 était un jeudi). */
export function weekday(day: DayNumber): number {
  return (((day + 4) % 7) + 7) % 7;
}

export type LocalNow = { day: DayNumber; hour: number; minute: number };

const HOTEL_CLOCK = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Jour, heure et minute à l'heure de l'hôtel (Europe/Paris). */
export function hotelNow(date: Date = new Date()): LocalNow {
  const parts = Object.fromEntries(HOTEL_CLOCK.formatToParts(date).map((part) => [part.type, part.value]));
  const day = dayFromIso(`${parts.year}-${parts.month}-${parts.day}`);
  if (day === null) throw new Error("Horloge de l'hôtel illisible");
  return { day, hour: Number(parts.hour), minute: Number(parts.minute) };
}
