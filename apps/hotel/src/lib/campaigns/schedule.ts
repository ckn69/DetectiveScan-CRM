import { type DayNumber, dayFromIso, type LocalNow, weekday } from "../dates";
import { formatDay, formatHour, formatTime } from "../format";
import type { Campaign, CampaignStatus, TimeSlot, Weekday } from "./types";

/*
 * Quand une campagne s'affiche. Une campagne tourne entre ses dates, les jours choisis,
 * toute la journée ou sur une plage horaire (qui peut passer minuit : 22 h – 2 h). Quand
 * plusieurs campagnes tournent au même moment, elles alternent d'une chasse à l'autre.
 */

/** Lundi d'abord, à la française. */
export const WEEK: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const DAY_NAMES: Record<Weekday, { short: string; long: string; letter: string }> = {
  1: { short: "lun.", long: "lundi", letter: "L" },
  2: { short: "mar.", long: "mardi", letter: "M" },
  3: { short: "mer.", long: "mercredi", letter: "M" },
  4: { short: "jeu.", long: "jeudi", letter: "J" },
  5: { short: "ven.", long: "vendredi", letter: "V" },
  6: { short: "sam.", long: "samedi", letter: "S" },
  0: { short: "dim.", long: "dimanche", letter: "D" },
};

/** « 17 h », « 21 h 30 ». */
export function formatClock(minutes: number): string {
  const hour = Math.floor(minutes / 60) % 24;
  const minute = minutes % 60;
  return minute === 0 ? formatHour(hour) : formatTime(hour, minute);
}

/** `"18:30"` ↔ 1110 minutes : la valeur des champs d'heure. */
export const minutesFromInput = (value: string): number | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour < 24 && minute < 60 ? hour * 60 + minute : null;
};
export const inputFromMinutes = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

type Run = { start: DayNumber; end: DayNumber | null };

function runOf(campaign: Pick<Campaign, "start" | "end">): Run {
  return { start: dayFromIso(campaign.start) ?? 0, end: campaign.end ? dayFromIso(campaign.end) : null };
}

const inRun = (run: Run, day: DayNumber) => day >= run.start && (run.end === null || day <= run.end);

/** La campagne s'afficherait-elle à ce moment, pause mise à part ? */
export function inSlot(campaign: Pick<Campaign, "start" | "end" | "days" | "hours">, day: DayNumber, minutes: number): boolean {
  const run = runOf(campaign);
  const on = (d: DayNumber) => inRun(run, d) && campaign.days.includes(weekday(d) as Weekday);
  const slot = campaign.hours;
  if (!slot) return on(day);
  if (slot.from < slot.to) return on(day) && minutes >= slot.from && minutes < slot.to;
  // Plage de nuit : la fin, après minuit, appartient au jour où la plage a commencé.
  if (minutes >= slot.from) return on(day);
  if (minutes < slot.to) return on(day - 1);
  return false;
}

const minutesOf = (now: LocalNow) => now.hour * 60 + now.minute;

export function campaignStatus(campaign: Campaign, now: LocalNow): CampaignStatus {
  const run = runOf(campaign);
  const minutes = minutesOf(now);
  if (run.end !== null && run.end < now.day && !inSlot(campaign, now.day, minutes)) return "ended";
  if (run.start > now.day) return "scheduled";
  if (campaign.paused) return "paused";
  return inSlot(campaign, now.day, minutes) ? "live" : "waiting";
}

/** Prochain début de créneau après `now`, dans les deux semaines qui viennent. */
export function nextShowing(campaign: Campaign, now: LocalNow): { day: DayNumber; minutes: number } | null {
  const run = runOf(campaign);
  const from = campaign.hours?.from ?? 0;
  for (let day = Math.max(now.day, run.start); day <= now.day + 14; day++) {
    if (!inRun(run, day) || !campaign.days.includes(weekday(day) as Weekday)) continue;
    if (day > now.day || from > minutesOf(now)) return { day, minutes: from };
  }
  return null;
}

/** « aujourd'hui », « demain », « samedi », « le 10 oct. ». */
function dayWord(day: DayNumber, today: DayNumber): string {
  if (day === today) return "aujourd'hui";
  if (day === today + 1) return "demain";
  if (day - today < 7) return DAY_NAMES[weekday(day) as Weekday].long;
  return `le ${formatDay(day)}`;
}

/** Prochain passage d'une campagne : « aujourd'hui à 17 h », « samedi » (toute la journée). */
export function nextShowingLabel(campaign: Campaign, now: LocalNow): string | null {
  const next = nextShowing(campaign, now);
  if (!next) return null;
  return `${dayWord(next.day, now.day)}${campaign.hours ? ` à ${formatClock(next.minutes)}` : ""}`;
}

/** Ce que l'état veut dire maintenant : « jusqu'à 21 h 30 », « reprend samedi à 9 h »… */
export function statusDetail(campaign: Campaign, status: CampaignStatus, now: LocalNow): string | null {
  const run = runOf(campaign);
  switch (status) {
    case "live": {
      if (!campaign.hours) return "toute la journée";
      return `jusqu'à ${formatClock(campaign.hours.to)}`;
    }
    case "waiting": {
      const next = nextShowingLabel(campaign, now);
      return next ? `reprend ${next}` : null;
    }
    case "scheduled":
      return `à partir ${run.start === now.day + 1 ? "de demain" : `du ${formatDay(run.start)}`}`;
    case "ended":
      return run.end === null ? null : `le ${formatDay(run.end, run.end < now.day - 180)}`;
    case "paused":
      return null;
  }
}

/** « Tous les jours », « Du lundi au vendredi », « Le week-end », « Lun., mer. et ven. ». */
export function daysLabel(days: Weekday[]): string {
  const set = new Set(days);
  if (set.size === 7) return "Tous les jours";
  if (set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d as Weekday))) return "Du lundi au vendredi";
  if (set.size === 2 && set.has(6) && set.has(0)) return "Le week-end";
  const names = WEEK.filter((d) => set.has(d)).map((d) => DAY_NAMES[d][set.size === 1 ? "long" : "short"]);
  if (names.length === 1) return `Le ${names[0]}`;
  const text = `${names.slice(0, -1).join(", ")} et ${names.at(-1)}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** « de 17 h à 21 h 30 », « toute la journée ». */
export function hoursLabel(hours: TimeSlot | null): string {
  return hours ? `de ${formatClock(hours.from)} à ${formatClock(hours.to)}` : "toute la journée";
}

/** « Du 1er sept. au 31 oct. », « Depuis le 15 sept. », « À partir du 9 oct. », « Le 10 oct. ». */
export function datesLabel(campaign: Pick<Campaign, "start" | "end">, today: DayNumber): string {
  const run = runOf(campaign);
  const year = (day: DayNumber) => Math.abs(day - today) > 300;
  if (run.end === null) {
    return run.start > today ? `À partir du ${formatDay(run.start, year(run.start))}` : `Depuis le ${formatDay(run.start, year(run.start))}`;
  }
  if (run.end === run.start) return `Le ${formatDay(run.start, year(run.start))}`;
  return `Du ${formatDay(run.start, year(run.start))} au ${formatDay(run.end, year(run.end))}`;
}

/** Une ligne : « Tous les jours, de 17 h à 21 h 30 ». */
export function slotLabel(campaign: Pick<Campaign, "days" | "hours">): string {
  return `${daysLabel(campaign.days)}, ${hoursLabel(campaign.hours)}`;
}

/**
 * Campagnes qui partageront l'écran avec celle-ci : chevauchement de dates, de jours et
 * d'heures, testé par quart d'heure sur les deux premières semaines où les deux campagnes
 * tournent ensemble (deux semaines couvrent tous les jours et toutes les plages).
 */
export function overlaps(campaign: Campaign, others: Campaign[], today: DayNumber): Campaign[] {
  const run = runOf(campaign);
  const first = Math.max(run.start, today);
  return others.filter((other) => {
    if (other.id === campaign.id || other.paused) return false;
    const otherRun = runOf(other);
    const from = Math.max(first, otherRun.start);
    const last = Math.min(run.end ?? Infinity, otherRun.end ?? Infinity, from + 13);
    for (let day = from; day <= last; day++) {
      for (let minutes = 0; minutes < 1440; minutes += 15) {
        if (inSlot(campaign, day, minutes) && inSlot(other, day, minutes)) return true;
      }
    }
    return false;
  });
}
