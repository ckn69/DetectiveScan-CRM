import type { Campaign } from "./types";

const at = (hour: number, minute = 0) => hour * 60 + minute;

/**
 * Campagnes fictives de l'Hôtel Démo : deux en cours qui se chevauchent le soir (elles
 * alternent), une le week-end matin sans image, une soirée programmée, une terminée.
 *
 * Les images (`public/demo/campagnes/`) sont synthétiques : des lumières floues rendues par
 * un script au canvas de Chromium (1 080 × 1 350, graines 11, 23 et 37, JPEG qualité 80),
 * le bas laissé noir pour le fondu de l'écran de chargement. Leur origine est aussi écrite
 * dans chaque fichier (commentaire JPEG). Ce sont des exemples, à remplacer par les photos
 * de l'hôtel.
 */
export function demoCampaignsBase(): Campaign[] {
  return [
    {
      id: "c-restaurant",
      title: "Ce soir, dîner au restaurant",
      message: "Menu de saison et vins de la région. Réservez à la réception ou au 9 depuis votre chambre.",
      image: "/demo/campagnes/restaurant.jpg",
      start: "2026-09-01",
      end: "2026-10-31",
      days: [0, 1, 2, 3, 4, 5, 6],
      hours: { from: at(17), to: at(21, 30) },
      paused: false,
      createdAt: "2026-08-28T08:00:00.000Z",
    },
    {
      id: "c-spa",
      title: "Le spa vous attend",
      message: "Hammam, sauna et soins jusqu'à 20 h. Peignoirs et serviettes vous attendent sur place.",
      image: "/demo/campagnes/spa.jpg",
      start: "2026-09-15",
      end: null,
      days: [0, 1, 2, 3, 4, 5, 6],
      hours: { from: at(14), to: at(20) },
      paused: false,
      createdAt: "2026-09-12T08:00:00.000Z",
    },
    {
      id: "c-brunch",
      title: "Brunch du week-end",
      message: "Viennoiseries maison, œufs et jus pressés, servis au salon du rez-de-chaussée.",
      image: null,
      start: "2026-09-05",
      end: null,
      days: [6, 0],
      hours: { from: at(8), to: at(12, 30) },
      paused: false,
      createdAt: "2026-09-02T08:00:00.000Z",
    },
    {
      id: "c-jazz",
      title: "Soirée jazz au bar",
      message: "Un trio en live vendredi et samedi dès 20 h. Entrée libre pour les clients de l'hôtel.",
      image: "/demo/campagnes/jazz.jpg",
      start: "2026-10-09",
      end: "2026-10-10",
      days: [5, 6],
      hours: { from: at(18), to: at(23) },
      paused: false,
      createdAt: "2026-09-29T08:00:00.000Z",
    },
    {
      id: "c-terrasse",
      title: "Apéritif en terrasse",
      message: "Tous les soirs de l'été, cocktails et planches à partager sur la terrasse du 7e étage.",
      image: null,
      start: "2026-06-15",
      end: "2026-08-31",
      days: [0, 1, 2, 3, 4, 5, 6],
      hours: { from: at(18), to: at(21) },
      paused: false,
      createdAt: "2026-06-10T08:00:00.000Z",
    },
  ];
}
