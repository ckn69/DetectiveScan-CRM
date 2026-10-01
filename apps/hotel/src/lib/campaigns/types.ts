import type { DayNumber } from "../dates";

/**
 * Campagnes d'un hôtel. Au lancement d'une chasse, le téléphone du joueur affiche un écran
 * noir de chargement de quelques secondes : l'hôtel y fait passer un message, un texte et
 * souvent une image, sans bouton. On en mesure donc les affichages, pas les clics.
 */

/** 0 = dimanche … 6 = samedi, comme `weekday()`. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Plage horaire en minutes depuis minuit, heure de l'hôtel ; `from > to` passe minuit. */
export type TimeSlot = { from: number; to: number };

export type Campaign = {
  id: string;
  /** Titre affiché en grand : 40 caractères au plus. */
  title: string;
  /** Texte sous le titre, facultatif : 120 caractères au plus. */
  message: string;
  /** Image facultative : adresse publique, ou image importée (data URL) en démo. */
  image: string | null;
  /** Premier jour de diffusion, `2026-09-01`. */
  start: string;
  /** Dernier jour de diffusion, inclus ; `null` : sans date de fin. */
  end: string | null;
  /** Jours de diffusion, au moins un. */
  days: Weekday[];
  /** Heures de diffusion ; `null` : toute la journée. */
  hours: TimeSlot | null;
  paused: boolean;
  /** Date de création (ISO). */
  createdAt: string;
};

/**
 * En diffusion maintenant · active mais hors de ses jours ou heures · pas encore commencée ·
 * mise en pause · terminée.
 */
export type CampaignStatus = "live" | "waiting" | "scheduled" | "paused" | "ended";

/** Affichages d'une campagne, comptés sur les lancements de chasse pendant ses créneaux. */
export type CampaignStats = {
  /** Depuis le début de la campagne. */
  displays: number;
  /** Part des chasses lancées pendant la campagne (ses dates) qui l'ont affichée. */
  share: number | null;
  /** Jours de la campagne écoulés (au plus les 90 derniers), un point par jour. */
  daily: { day: DayNumber; displays: number }[];
  /** Dernier affichage : « Hier · 21 h 12 ». */
  lastShown: string | null;
};
