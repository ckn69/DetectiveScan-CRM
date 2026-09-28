import { type DayNumber, dayFromIso, type LocalNow, weekday } from "../dates";
import { DEMO_HOTEL } from "../demo";
import { formatDay, formatHour, formatTime, formatWeekday, plural } from "../format";
import type { Cutoff, DayRange, Period } from "./period";
import type { ChartPoint, DashboardData, GameStatus, RecentGame, RoomStat, Totals } from "./types";

/*
 * Données fictives de l'Hôtel Démo, déterministes : une même date donne toujours les
 * mêmes chiffres, d'un chargement à l'autre et pour tous les visiteurs.
 *
 * Chaque journée est un journal : des scans (plus nombreux le week-end et le soir, en
 * hausse lente depuis l'installation), chacun dans une chambre ; environ un scan sur deux
 * lance une partie ; chaque partie a son issue et parfois un avis. Indicateurs, courbe,
 * entonnoir, chambres et dernières parties sont tous des comptes sur ce même journal :
 * ils ne peuvent pas se contredire.
 */

/** Installation fictive des QR codes de l'Hôtel Démo : aucune donnée avant ce jour. */
export const DEMO_DATA_SINCE: DayNumber = dayFromIso("2026-03-02") ?? 0;

/** Une partie commencée depuis moins longtemps est « en cours ». */
const GAME_MINUTES = 22;

/** Graines distinctes pour chaque tirage, afin que deux grandeurs ne varient jamais ensemble. */
const Salt = {
  Scans: 1,
  Hour: 2,
  Visitors: 3,
  PlayRate: 4,
  Replay: 5,
  LikeRate: 6,
  RoomWeight: 7,
  RoomPlay: 8,
  ScanMinute: 9,
  ScanRoom: 10,
  Plays: 11,
  Outcome: 12,
  Answer: 13,
  Like: 14,
  Satisfy: 15,
  Player: 16,
  PlayerName: 17,
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

/** Arrondi sans biais : 2,3 donne 3 dans 30 % des cas. */
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

type DemoRoom = { room: string; qr: string; weight: number; play: number };

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
    play: room.startsWith("Suite") ? 1.18 : 0.9 + 0.2 * noise(Salt.RoomPlay, index),
  }));
})();

const ROOM_WEIGHT_TOTAL = ROOMS.reduce((acc, room) => acc + room.weight, 0);

function pickRoom(value: number): DemoRoom {
  let target = value * ROOM_WEIGHT_TOTAL;
  for (const room of ROOMS) {
    target -= room.weight;
    if (target < 0) return room;
  }
  return ROOMS[ROOMS.length - 1] as DemoRoom;
}

// Noms fictifs, déjà masqués (longueur fixe : le masque ne trahit rien du nom).
const CONSENTED_PLAYERS = ["J. D••••", "L. B••••", "S. R••••", "A. L••••", "T. G••••", "N. P••••"];

type Game = {
  outcome: "won" | "lost" | "abandoned";
  answered: boolean;
  liked: boolean;
  /** Note de 4 ou 5. */
  satisfied: boolean;
  /** Nom masqué, seulement si le joueur l'a accepté. */
  player: string | null;
};

type Scan = { id: string; minutes: number; room: DemoRoom; game: Game | null };

const LOGS = new Map<DayNumber, Scan[]>();

/** Journal complet d'une journée, dans l'ordre chronologique. */
function dayLog(day: DayNumber): Scan[] {
  const cached = LOGS.get(day);
  if (cached) return cached;

  const maturity = Math.min(1, Math.max(0, day - DEMO_DATA_SINCE) / 240);
  const playRate = 0.47 + 0.05 * maturity + 0.06 * (noise(Salt.PlayRate, day) - 0.5);
  const likeRate = 0.88 + 0.07 * noise(Salt.LikeRate, day);
  const log: Scan[] = [];

  hourlyScans(day).forEach((count, hour) => {
    for (let index = 0; index < count; index++) {
      const key = [day, hour, index] as const;
      const room = pickRoom(noise(Salt.ScanRoom, ...key));
      let game: Game | null = null;
      if (noise(Salt.Plays, ...key) < playRate * room.play) {
        const draw = noise(Salt.Outcome, ...key);
        const outcome = draw < 0.2 ? "abandoned" : draw < 0.2 + 0.8 * 0.64 ? "won" : "lost";
        const answered = outcome !== "abandoned" && noise(Salt.Answer, ...key) < 0.45;
        const liked = answered && noise(Salt.Like, ...key) < likeRate;
        game = {
          outcome,
          answered,
          liked,
          satisfied: answered && noise(Salt.Satisfy, ...key) < (liked ? 0.95 : 0.15),
          player:
            noise(Salt.Player, ...key) < 0.2
              ? (CONSENTED_PLAYERS[Math.floor(noise(Salt.PlayerName, ...key) * CONSENTED_PLAYERS.length)] ?? null)
              : null,
        };
      }
      log.push({
        id: `${day}-${hour}-${index}`,
        minutes: hour * 60 + Math.floor(noise(Salt.ScanMinute, ...key) * 60),
        room,
        game,
      });
    }
  });

  log.sort((a, b) => a.minutes - b.minutes);
  LOGS.set(day, log);
  return log;
}

const minutesOf = (cutoff: Cutoff) => cutoff.hour * 60 + cutoff.minute;

/** Scans d'une journée, arrêtés à `cutoff` pour la journée en cours. */
function scansOf(day: DayNumber, cutoff: Cutoff | null): Scan[] {
  const log = dayLog(day);
  if (!cutoff) return log;
  const end = minutesOf(cutoff);
  return log.filter((scan) => scan.minutes < end);
}

const inProgress = (scan: Scan, end: number | null) => end !== null && end - scan.minutes < GAME_MINUTES;

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

/** Comptes d'une journée. Les parties encore en cours ne sont ni terminées, ni abandonnées. */
function tally(day: DayNumber, cutoff: Cutoff | null): Totals {
  const scans = scansOf(day, cutoff);
  const end = cutoff ? minutesOf(cutoff) : null;
  const games = scans.flatMap((scan) => (scan.game ? [{ ...scan.game, live: inProgress(scan, end) }] : []));
  const done = games.filter((game) => !game.live);
  const count = (predicate: (game: (typeof done)[number]) => boolean) => done.filter(predicate).length;

  const visitors = roundFair(scans.length * (0.79 + 0.04 * noise(Salt.Visitors, day)), Salt.Visitors, day, scans.length);
  // Quelques joueurs refont une partie : moins de joueurs que de parties.
  const replays = roundFair(games.length * (0.05 + 0.04 * noise(Salt.Replay, day)), Salt.Replay, day, games.length);
  const won = count((game) => game.outcome === "won");
  const lost = count((game) => game.outcome === "lost");

  return {
    scans: scans.length,
    visitors,
    players: Math.min(visitors, games.length - replays),
    started: games.length,
    finished: won + lost,
    won,
    lost,
    abandoned: count((game) => game.outcome === "abandoned"),
    answers: count((game) => game.answered),
    liked: count((game) => game.liked),
    satisfied: count((game) => game.satisfied),
  };
}

function rangeTotals({ from, to, cutoff }: DayRange): Totals {
  const totals = { ...EMPTY_TOTALS };
  for (let day = from; day <= to; day++) {
    const dayTotals = tally(day, day === to ? cutoff : null);
    for (const key of Object.keys(totals) as (keyof Totals)[]) totals[key] += dayTotals[key];
  }
  return totals;
}

function dailyPoints({ from, to }: DayRange): ChartPoint[] {
  const points: ChartPoint[] = [];
  for (let day = from; day <= to; day++) {
    const log = dayLog(day);
    points.push({
      label: formatWeekday(day),
      tick: formatDay(day),
      scans: log.length,
      games: log.filter((scan) => scan.game).length,
    });
  }
  return points;
}

/** Heures complètes de la journée en cours (l'heure entamée n'est pas tracée : elle ferait croire à une chute). */
function hourlyPoints(day: DayNumber, cutoff: Cutoff): ChartPoint[] {
  const scans = scansOf(day, cutoff);
  return Array.from({ length: cutoff.hour }, (_, hour) => {
    const inHour = scans.filter((scan) => Math.floor(scan.minutes / 60) === hour);
    return {
      label: `${formatHour(hour)} – ${hour === 23 ? "minuit" : formatHour(hour + 1)}`,
      tick: formatHour(hour),
      scans: inHour.length,
      games: inHour.filter((scan) => scan.game).length,
    };
  });
}

const sum = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);

function chartSummary(points: ChartPoint[], granularity: "hour" | "day"): string {
  const scans = sum(points.map((point) => point.scans));
  if (scans === 0) return "Aucun scan sur cette période.";
  const games = sum(points.map((point) => point.games));
  const peak = points.reduce((best, point) => (point.scans > best.scans ? point : best));
  const peakName = granularity === "hour" ? "Heure la plus active" : "Journée la plus active";
  return `${plural(scans, "scan")} et ${plural(games, "partie commencée", "parties commencées")}. ${peakName} : ${peak.label}, ${plural(peak.scans, "scan")}.`;
}

/** Les chambres les plus scannées de la période, avec leur taux de participation. */
function topRooms({ from, to, cutoff }: DayRange, totals: Totals, limit = 6): RoomStat[] {
  const byRoom = new Map<DemoRoom, { scans: number; games: number }>();
  for (let day = from; day <= to; day++) {
    for (const scan of scansOf(day, day === to ? cutoff : null)) {
      const stat = byRoom.get(scan.room) ?? { scans: 0, games: 0 };
      stat.scans += 1;
      if (scan.game) stat.games += 1;
      byRoom.set(scan.room, stat);
    }
  }

  // Participation de la chambre : celle de l'hôtel, pondérée par le nombre de parties par scan de la chambre.
  const hotelRate = totals.visitors > 0 ? totals.players / totals.visitors : null;
  const hotelGamesPerScan = totals.scans > 0 ? totals.started / totals.scans : 0;

  return ROOMS.flatMap((room) => {
    const stat = byRoom.get(room);
    if (!stat) return [];
    const participation =
      hotelRate === null || hotelGamesPerScan === 0 || stat.scans < 5
        ? null
        : Math.min(1, (hotelRate * stat.games) / stat.scans / hotelGamesPerScan);
    return [{ room: room.room, qr: room.qr, scans: stat.scans, participation }];
  })
    .sort((a, b) => b.scans - a.scans)
    .slice(0, limit);
}

function whenLabel(day: DayNumber, minutes: number, now: LocalNow): string {
  const time = formatTime(Math.floor(minutes / 60), minutes % 60);
  if (day === now.day) return time;
  if (day === now.day - 1) return `Hier · ${time}`;
  return `${formatWeekday(day)} · ${time}`;
}

/** Dernières parties de la période, de la plus récente à la plus ancienne (7 jours parcourus au plus). */
function recentGames({ from, to, cutoff }: DayRange, now: LocalNow, limit = 6): RecentGame[] {
  const games: RecentGame[] = [];
  const end = cutoff ? minutesOf(cutoff) : null;

  for (let day = to; day >= Math.max(from, to - 6) && games.length < limit; day--) {
    const scans = scansOf(day, day === to ? cutoff : null);
    for (let index = scans.length - 1; index >= 0 && games.length < limit; index--) {
      const scan = scans[index];
      if (!scan?.game) continue;
      const live = day === to && inProgress(scan, end);
      const status: GameStatus = live ? "in_progress" : scan.game.outcome;
      games.push({
        id: scan.id,
        when: whenLabel(day, scan.minutes, now),
        room: scan.room.room,
        qr: scan.room.qr,
        player: scan.game.player,
        status,
        feedback: !live && scan.game.answered ? (scan.game.liked ? "liked" : "not_liked") : null,
      });
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
    recentGames: recentGames(period.range, now),
  };
}
