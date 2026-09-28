import { dateFromDay, type DayNumber } from "./dates";

/*
 * Formats français : espace fine insécable pour les milliers et avant « % »,
 * virgule décimale, « 1er » pour le premier du mois, heures en « 21 h 42 ».
 */

const INTEGER = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const DECIMAL = new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const PERCENT = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 0 });

const NBSP = " ";
const THIN_NBSP = " ";
const MINUS = "−";

export const formatInteger = (value: number): string => INTEGER.format(value);
export const formatDecimal = (value: number): string => DECIMAL.format(value);
export const formatPercent = (ratio: number): string => PERCENT.format(ratio);

/** Écart signé : « +18 % », « −2 pts », « −6 ». */
export function formatSigned(value: number, unit?: "%" | "pts"): string {
  const sign = value > 0 ? "+" : value < 0 ? MINUS : "";
  const magnitude = INTEGER.format(Math.abs(value));
  if (unit === "%") return `${sign}${magnitude}${THIN_NBSP}%`;
  if (unit === "pts") return `${sign}${magnitude}${NBSP}${Math.abs(value) > 1 ? "pts" : "pt"}`;
  return `${sign}${magnitude}`;
}

/** « 1 abandon », « 126 abandons » : 0 et 1 restent au singulier en français. */
export function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${formatInteger(count)}${NBSP}${Math.abs(count) >= 2 ? pluralForm : singular}`;
}

export function formatTime(hour: number, minute: number): string {
  return `${hour}${NBSP}h${NBSP}${String(minute).padStart(2, "0")}`;
}

export function formatHour(hour: number): string {
  return `${hour}${NBSP}h`;
}

const DAY_MONTH = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const DAY_MONTH_YEAR = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const WEEKDAY_DAY_MONTH = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** « 1 sept. » → « 1er sept. » */
const withFirst = (text: string): string => text.replace(/(^|\s)1(?=\s)/, (_, space: string) => `${space}1er`);

/** « 27 sept. » ou « 27 sept. 2026 ». */
export function formatDay(day: DayNumber, withYear = false): string {
  return withFirst((withYear ? DAY_MONTH_YEAR : DAY_MONTH).format(dateFromDay(day)));
}

/** « 1er », « 21 » : le jour seul, quand le mois suit. */
export function formatDayOfMonth(day: DayNumber): string {
  const date = dateFromDay(day).getUTCDate();
  return date === 1 ? "1er" : String(date);
}

/** « sam. 26 sept. » */
export function formatWeekday(day: DayNumber): string {
  return withFirst(WEEKDAY_DAY_MONTH.format(dateFromDay(day)));
}
