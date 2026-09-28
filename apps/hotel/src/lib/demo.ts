/**
 * Données du mode démo. Tout ce qui s'affiche ici est fictif et doit rester
 * étiqueté comme tel dans l'interface (bandeau « Mode démo »).
 */
export const DEMO_HOTEL = {
  slug: "hotel-demo",
  name: "Hôtel Démo",
  city: "Lyon",
  rooms: 42,
  initials: "HD",
} as const;

export const DEMO_USER = {
  name: "Claire Martin",
  shortName: "Claire M.",
  initials: "CM",
  role: "Admin de l'hôtel",
  email: "claire.martin@example.com",
} as const;

export type Hotel = typeof DEMO_HOTEL;
export type SessionUser = typeof DEMO_USER;
