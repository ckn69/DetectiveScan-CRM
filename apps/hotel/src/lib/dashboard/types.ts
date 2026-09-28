/**
 * Données du dashboard d'un hôtel, pour une période. Le mode démo les génère ;
 * la base de données les fournira sous la même forme.
 */

/** Totaux d'une période. */
export type Totals = {
  scans: number;
  /** Téléphones distincts (identifiant technique anonyme). */
  visitors: number;
  /** Visiteurs ayant commencé au moins une partie. */
  players: number;
  started: number;
  finished: number;
  won: number;
  lost: number;
  abandoned: number;
  /** Réponses à « Avez-vous aimé l'enquête ? » (chacune accompagnée d'une note sur 5). */
  answers: number;
  liked: number;
  /** Notes de 4 ou 5. */
  satisfied: number;
};

export type ChartPoint = {
  /** Libellé complet : « sam. 26 sept. », « 18 h – 19 h ». */
  label: string;
  /** Libellé d'axe : « 26 sept. », « 18 h ». */
  tick: string;
  scans: number;
  games: number;
};

export type ActivityChart = {
  granularity: "hour" | "day";
  /** Nombre de positions sur l'axe horizontal (24 pour une journée, sinon un par jour). */
  slots: number;
  points: ChartPoint[];
  /** Résumé lisible par les lecteurs d'écran. */
  summary: string;
};

export type RoomStat = {
  room: string;
  qr: string;
  scans: number;
  /** Joueurs ÷ visiteurs de la chambre. */
  participation: number | null;
};

export type GameStatus = "in_progress" | "won" | "lost" | "abandoned";

export type RecentGame = {
  id: string;
  /** « 21 h 42 », « Hier · 22 h 41 », « sam. 26 sept. · 21 h 17 ». */
  when: string;
  room: string;
  qr: string;
  /** Nom masqué, uniquement si le joueur a donné son accord ; sinon joueur anonyme. */
  player: string | null;
  status: GameStatus;
  feedback: "liked" | "not_liked" | null;
};

export type DashboardData = {
  totals: Totals;
  /** Totaux de la période précédente, `null` sans comparaison possible. */
  previous: Totals | null;
  /** Chambres équipées d'un QR code. */
  rooms: number;
  chart: ActivityChart;
  topRooms: RoomStat[];
  recentGames: RecentGame[];
};
