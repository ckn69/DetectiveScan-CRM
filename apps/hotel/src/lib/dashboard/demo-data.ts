import { type DayNumber, dayFromIso, type LocalNow, weekday } from "../dates";
import { DEMO_HOTEL } from "../demo";
import { formatDay, formatHour, formatTime, formatWeekday, plural } from "../format";
import type { Cutoff, DayRange, Period } from "./period";
import type { ChartPoint, DashboardData, GameStatus, RecentGame, RoomStat, Totals } from "./types";

/*
 * Données fictives de l'Hôtel Démo, déterministes : une même date donne toujours les
 * mêmes chiffres, d'un chargement à l'autre et pour tous les visiteurs.
 *
 * Modèle : des scans par jour (plus nombreux le week-end, en hausse lente depuis
 * l'installation), répartis sur la journée (pic en soirée), puis chaque étape du jeu
 * déduite de taux réalistes (participation ≈ 58 %, 80 % des parties terminées…).
 */

/** Installation fictive des QR codes de l'Hôtel Démo : aucune donnée avant ce jour. */
export const DEMO_DATA_SINCE: DayNumber = dayFromIso("2026-03-02") ?? 0;

/** Graines distinctes pour chaque tirage, afin que deux grandeurs ne varient jamais ensemble. */
const Salt = {
  Scans: 1,
  Hour: 2,
  Visitors: 3,
  Participation: 4,
  Replay: 5,
  Finish: 6,
  Win: 7,
  Answer: 8,
  Like: 9,
  Satisfy: 10,
  RoomWeight: 11,
  RoomJitter: 12,
  RoomParticipation: 13,
  GameMinute: 14,
  GameRoom: 15,
  GamePlayer: 16,
  GameName: 17,
  GameOutcome: 18,
  GameFeedback: 19,
  GameLike: 20,
} as const;

/** Nombre pseudo-aléatoire stable dans [0, 1[ pour une combinaison de clés. */
function noise(...keys: number[]): number {
  let hash = 0x9e3779b9;
  for (const key of keys) {
    hash = Math.imul(hash ^ (key | 0), 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
  }
  let t = (hash + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
}

/** Répartit `total` selon des poids, en entiers dont la somme vaut exactement `total`. */
function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((acc, weight) => acc + weight, 0);
  const exact = weights.map((weight) => (sum > 0 ? (total * weight) / sum : 0));
  const parts = exact.map(Math.floor);
  let rest = total - parts.reduce((acc, part) => acc + part, 0);
  const byRemainder = exact.map((value, index) => ({ index, remainder: value - Math.floor(value) }));
  byRemainder.sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  for (const { index } of byRemainder) {
    if (rest <= 0) break;
    parts[index] = (parts[index] ?? 0) + 1;
    rest -= 1;
  }
  return parts;
}

/** Arrondi sans biais : 2,3 donne 3 dans 30 % des cas. Évite que les petites journées tirent les taux vers 100 %. */
function roundFair(value: number, ...keys: number[]): number {
  const floor = Math.floor(value);
  return floor + (noise(...keys) < value - floor ? 1 : 0);
}

// Dimanche … samedi : clientèle de loisirs le week-end.
const WEEKDAY_FACTOR = [1.14, 0.78, 0.74, 0.82, 0.92, 1.2, 1.4];

// Minuit … 23 h : les clients jouent surtout en fin de journée, avant et après le dîner.
const HOUR_WEIGHT = [
  1.2, 0.5, 0.2, 0.1, 0.1, 0.2, 0.5, 1.6, 2.4, 2, 1.5, 1.3, 1.7, 2, 2.6, 3.4, 4.4, 6, 8.6, 11, 12.6, 12, 8.3, 4.2,
];

function dailyScans(day: DayNumber): number {
  const age = day - DEMO_DATA_SINCE;
  if (age < 0) return 0;
  const warmup = Math.min(1, 0.45 + (0.55 * age) / 28);
  const trend = 0.7 + 0.55 * Math.min(1, age / 270);
  const jitter = 0.84 + 0.32 * noise(Salt.Scans, day);
  return Math.round(36 * (WEEKDAY_FACTOR[weekday(day)] ?? 1) * warmup * trend * jitter);
}

function hourlyScans(day: DayNumber): number[] {
  const weights = HOUR_WEIGHT.map((weight, hour) => weight * (0.8 + 0.4 * noise(Salt.Hour, day, hour)));
  return distribute(dailyScans(day), weights);
}

/** Scans heure par heure, arrêtés à `cutoff` (l'heure entamée compte au prorata des minutes écoulées). */
function hoursUntil(day: DayNumber, cutoff: Cutoff | null): number[] {
  const hours = hourlyScans(day);
  if (!cutoff) return hours;
  return hours.map((scans, hour) =>
    hour < cutoff.hour ? scans : hour === cutoff.hour ? Math.floor((scans * cutoff.minute) / 60) : 0,
  );
}

const sum = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);

const EMPTY_TOTALS: Totals = {
  scans: 0,
  visitors: 0,
  players: 0,
  started: 0,
  finished: 0,
  won: 0,
  lost: 0,
  abandoned: 0,
  answers: 0,
  liked: 0,
  satisfied: 0,
};

/** Étapes du jeu d'une journée, à partir de ses scans. */
function dayTotals(day: DayNumber, scans: number): Totals {
  const maturity = Math.min(1, Math.max(0, day - DEMO_DATA_SINCE) / 240);
  const fair = (value: number, salt: number) => roundFair(value, salt, day, scans);
  const visitors = fair(scans * (0.79 + 0.04 * noise(Salt.Visitors, day)), Salt.Visitors);
  const participation = 0.53 + 0.06 * maturity + 0.08 * (noise(Salt.Participation, day) - 0.5);
  const players = fair(visitors * participation, Salt.Participation);
  const started = players + fair(players * (0.05 + 0.04 * noise(Salt.Replay, day)), Salt.Replay);
  const finished = fair(started * (0.77 + 0.06 * noise(Salt.Finish, day)), Salt.Finish);
  const won = fair(finished * (0.6 + 0.08 * noise(Salt.Win, day)), Salt.Win);
  const answers = fair(finished * (0.42 + 0.08 * noise(Salt.Answer, day)), Salt.Answer);
  return {
    scans,
    visitors,
    players,
    started,
    finished,
    won,
    lost: finished - won,
    abandoned: started - finished,
    answers,
    liked: fair(answers * (0.88 + 0.07 * noise(Salt.Like, day)), Salt.Like),
    satisfied: fair(answers * (0.84 + 0.08 * noise(Salt.Satisfy, day)), Salt.Satisfy),
  };
}

function rangeTotals({ from, to, cutoff }: DayRange): Totals {
  const totals = { ...EMPTY_TOTALS };
  for (let day = from; day <= to; day++) {
    const scans = day === to && cutoff ? sum(hoursUntil(day, cutoff)) : dailyScans(day);
    const dayValues = dayTotals(day, scans);
    for (const key of Object.keys(totals) as (keyof Totals)[]) totals[key] += dayValues[key];
  }
  return totals;
}

/** Parties commencées heure par heure : le total de la journée (ou de sa partie écoulée), réparti comme les scans. */
function hourlyGames(day: DayNumber, cutoff: Cutoff | null): number[] {
  const scans = hoursUntil(day, cutoff);
  return distribute(dayTotals(day, sum(scans)).started, scans);
}

function dailyPoints({ from, to }: DayRange): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let day = from; day <= to; day++) {
    const scans = dailyScans(day);
    points.push({ label: formatWeekday(day), tick: formatDay(day), scans, games: dayTotals(day, scans).started });
  }
  return points;
}

/** Heures complètes de la journée en cours (l'heure entamée n'est pas tracée : elle ferait croire à une chute). */
function hourlyPoints(day: DayNumber, cutoff: Cutoff): ChartPoint[] {
  const scans = hoursUntil(day, cutoff);
  const games = hourlyGames(day, cutoff);
  return scans.slice(0, cutoff.hour).map((value, hour) => ({
    label: `${formatHour(hour)} – ${hour === 23 ? "minuit" : formatHour(hour + 1)}`,
    tick: formatHour(hour),
    scans: value,
    games: games[hour] ?? 0,
  }));
}

function chartSummary(points: ChartPoint[], granularity: "hour" | "day"): string {
  const scans = sum(points.map((point) => point.scans));
  if (scans === 0) return "Aucun scan sur cette période.";
  const games = sum(points.map((point) => point.games));
  const peak = points.reduce((best, point) => (point.scans > best.scans ? point : best));
  const peakName = granularity === "hour" ? "Heure la plus active" : "Journée la plus active";
  return `${plural(scans, "scan")} et ${plural(games, "partie commencée", "parties commencées")}. ${peakName} : ${peak.label}, ${plural(peak.scans, "scan")}.`;
}

type DemoRoom = { room: string; qr: string; weight: number; bias: number };

/**
 * 42 chambres (1 à 37, puis 5 suites). Les QR codes sont numérotés dans l'ordre de pose,
 * commencé chambre 12 : le QR `01-254-00` est dans la chambre 12.
 */
const ROOMS: DemoRoom[] = (() => {
  const numbered = [
    ...Array.from({ length: 26 }, (_, i) => String(12 + i)),
    ...Array.from({ length: 11 }, (_, i) => String(1 + i)),
  ];
  const labels = [...numbered, ...Array.from({ length: 5 }, (_, i) => `Suite ${i + 1}`)];
  const favourites: Record<string, number> = { "12": 2.3, "27": 2.1, "31": 1.95, "8": 1.85, "Suite 5": 1.8 };
  return labels.map((room, index) => ({
    room,
    qr: `01-254-${String(index).padStart(2, "0")}`,
    weight: (0.75 + 0.5 * noise(Salt.RoomWeight, index)) * (favourites[room] ?? 1),
    // Les suites accueillent des familles : on y joue un peu plus.
    bias: room.startsWith("Suite") ? 0.1 : 0.12 * (noise(Salt.RoomParticipation, index) - 0.5),
  }));
})();

const ROOM_WEIGHT_TOTAL = ROOMS.reduce((acc, room) => acc + room.weight, 0);

function topRooms(range: DayRange, totals: Totals, limit = 5): RoomStat[] {
  const seed = range.from * 31 + range.to;
  const scans = distribute(
    totals.scans,
    ROOMS.map((room, index) => room.weight * (0.85 + 0.3 * noise(Salt.RoomJitter, seed, index))),
  );
  const hotelRate = totals.visitors > 0 ? totals.players / totals.visitors : null;

  return ROOMS.map((room, index) => {
    const roomScans = scans[index] ?? 0;
    // Sous 5 scans, un taux par chambre ne veut rien dire : on ne l'affiche pas.
    const participation =
      hotelRate === null || roomScans < 5
        ? null
        : Math.min(0.9, Math.max(0.2, hotelRate + room.bias + 0.08 * (noise(Salt.RoomParticipation, seed, index) - 0.5)));
    return { room: room.room, qr: room.qr, scans: roomScans, participation };
  })
    .filter((room) => room.scans > 0)
    .sort((a, b) => b.scans - a.scans)
    .slice(0, limit);
}

// Noms fictifs, déjà masqués : seuls les joueurs qui ont donné leur accord ont un nom.
const CONSENTED_PLAYERS = ["J. D••••", "L. B•••••", "S. R••••••", "A. L•••••", "T. G••••", "N. P•••••"];

function pickRoom(value: number): DemoRoom {
  let target = value * ROOM_WEIGHT_TOTAL;
  for (const room of ROOMS) {
    target -= room.weight;
    if (target < 0) return room;
  }
  return ROOMS[ROOMS.length - 1] as DemoRoom;
}

function whenLabel(day: DayNumber, minutes: number, now: LocalNow): string {
  const time = formatTime(Math.floor(minutes / 60), minutes % 60);
  if (day === now.day) return time;
  if (day === now.day - 1) return `Hier · ${time}`;
  return `${formatWeekday(day)} · ${time}`;
}

/** Dernières parties de la période, de la plus récente à la plus ancienne (7 jours parcourus au plus). */
function recentGames(period: Period, now: LocalNow, limit = 6): RecentGame[] {
  const { from, to, cutoff } = period.range;
  const end = cutoff ? cutoff.hour * 60 + cutoff.minute : 24 * 60;
  const games: RecentGame[] = [];
  let day = to;
  let hour = Math.floor((end - 1) / 60);

  for (let step = 0; step < 7 * 24 && games.length < limit && day >= from; step++) {
    const count = hourlyGames(day, day === to ? cutoff : null)[hour] ?? 0;
    // L'heure entamée ne couvre que les minutes déjà écoulées.
    const span = cutoff && day === to && hour === cutoff.hour ? cutoff.minute : 60;
    const starts: { index: number; minutes: number }[] = [];
    for (let index = 0; index < count; index++) {
      starts.push({ index, minutes: hour * 60 + Math.floor(noise(Salt.GameMinute, day, hour, index) * span) });
    }
    starts.sort((a, b) => b.minutes - a.minutes);

    for (const { index, minutes } of starts) {
      if (games.length >= limit) break;
      const key = [day, minutes, index] as const;
      const elapsed = cutoff && day === to ? end - minutes : Number.POSITIVE_INFINITY;
      const outcome = noise(Salt.GameOutcome, ...key);
      const status: GameStatus =
        elapsed < 22 ? "in_progress" : outcome < 0.2 ? "abandoned" : outcome < 0.2 + 0.8 * 0.64 ? "won" : "lost";
      const answered = (status === "won" || status === "lost") && noise(Salt.GameFeedback, ...key) < 0.45;
      const room = pickRoom(noise(Salt.GameRoom, ...key));
      games.push({
        id: `${day}-${minutes}-${index}`,
        when: whenLabel(day, minutes, now),
        room: room.room,
        qr: room.qr,
        player:
          noise(Salt.GamePlayer, ...key) < 0.2
            ? (CONSENTED_PLAYERS[Math.floor(noise(Salt.GameName, ...key) * CONSENTED_PLAYERS.length)] ?? null)
            : null,
        status,
        feedback: answered ? (noise(Salt.GameLike, ...key) < 0.9 ? "liked" : "not_liked") : null,
      });
    }

    hour -= 1;
    if (hour < 0) {
      hour = 23;
      day -= 1;
    }
  }
  return games;
}

export function getDemoDashboard(period: Period, now: LocalNow): DashboardData {
  const totals = rangeTotals(period.range);
  const points =
    period.granularity === "hour" && period.range.cutoff
      ? hourlyPoints(period.range.to, period.range.cutoff)
      : dailyPoints(period.range);

  return {
    totals,
    previous: period.previous ? rangeTotals(period.previous) : null,
    rooms: DEMO_HOTEL.rooms,
    chart: {
      granularity: period.granularity,
      slots: period.granularity === "hour" ? 24 : points.length,
      points,
      summary: chartSummary(points, period.granularity),
    },
    topRooms: topRooms(period.range, totals),
    recentGames: recentGames(period, now),
  };
}
