import {
  Bell,
  ChartColumn,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  Megaphone,
  QrCode,
  Settings,
  Star,
} from "lucide-react";

/** Une section de l'espace hôtelier et l'étape de développement qui la livre. */
export type Section = {
  slug: string;
  label: string;
  /** Libellé court pour la barre de navigation mobile. */
  shortLabel?: string;
  icon: LucideIcon;
  step: number;
  summary: string;
  features: string[];
};

export type SectionGroup = { label: string; sections: Section[] };

export const SECTION_GROUPS: SectionGroup[] = [
  {
    label: "Pilotage",
    sections: [
      {
        slug: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        step: 2,
        summary: "Vos scans, joueurs, taux de participation et satisfaction, comparés à la période précédente.",
        features: [
          "Quatre chiffres clés et leur évolution",
          "Scans et parties commencées, jour par jour",
          "Entonnoir du scan à la victoire",
          "Chambres les plus actives et activité récente",
        ],
      },
      {
        slug: "analytics",
        label: "Analytics",
        icon: ChartColumn,
        step: 5,
        summary: "L'analyse détaillée des joueurs, des parties et de chaque chambre.",
        features: ["Joueurs et parties, par période", "Performance de chaque chambre", "Export CSV"],
      },
    ],
  },
  {
    label: "Expérience",
    sections: [
      {
        slug: "campaigns",
        label: "Campagnes",
        icon: Megaphone,
        step: 4,
        summary: "L'écran de 3 secondes que vos clients voient avant l'enquête : restaurant, spa, événements.",
        features: [
          "Campagnes actives, programmées et terminées",
          "Création avec texte, image et bouton d'action",
          "Aperçu exact sur téléphone",
          "Affichages, clics et taux de clic",
        ],
      },
      {
        slug: "qr-codes",
        label: "QR codes & chambres",
        shortLabel: "QR",
        icon: QrCode,
        step: 3,
        summary: "Quel QR code est dans quelle chambre, et combien de fois chacun est scanné.",
        features: [
          "Ajout manuel ou import CSV",
          "Association QR ↔ chambre, avec historique",
          "Scans et joueurs par QR et par chambre",
          "Mode installation depuis le téléphone",
        ],
      },
      {
        slug: "reviews",
        label: "Avis clients",
        shortLabel: "Avis",
        icon: Star,
        step: 5,
        summary: "Ce que vos clients pensent de l'expérience, et ce qui les a gênés.",
        features: [
          "Note moyenne et part de clients satisfaits",
          "Filtres par note, chambre et période",
          "Motifs des avis négatifs",
        ],
      },
    ],
  },
  {
    label: "Compte",
    sections: [
      {
        slug: "account",
        label: "Abonnement",
        icon: CreditCard,
        step: 6,
        summary: "Votre abonnement DetectiveScan, vos factures et votre moyen de paiement.",
        features: ["Essai gratuit d'un mois, puis abonnement", "Factures et moyen de paiement", "Prochaine échéance"],
      },
      {
        slug: "support",
        label: "Aide & support",
        icon: LifeBuoy,
        step: 6,
        summary: "Une question, une suggestion ou un problème : l'équipe DetectiveScan vous répond.",
        features: ["Question, suggestion ou signalement", "Suivi de vos demandes"],
      },
      {
        slug: "settings",
        label: "Paramètres",
        icon: Settings,
        step: 6,
        summary: "Votre hôtel, votre équipe et votre compte.",
        features: [
          "Informations de l'hôtel",
          "Membres de l'équipe et rôles",
          "Sécurité du compte",
          "Données et confidentialité",
        ],
      },
    ],
  },
];

/** Sections hors menu principal (accessibles depuis la barre haute). */
const EXTRA_SECTIONS: Section[] = [
  {
    slug: "notifications",
    label: "Notifications",
    icon: Bell,
    step: 6,
    summary: "Les événements qui demandent votre attention.",
    features: ["Nouvel avis négatif", "Campagne terminée", "QR code sans scan depuis 7 jours"],
  },
];

const ALL_SECTIONS = [...SECTION_GROUPS.flatMap((g) => g.sections), ...EXTRA_SECTIONS];

export function findSection(slug: string | undefined): Section | undefined {
  return ALL_SECTIONS.find((s) => s.slug === slug);
}

/** Onglets de la barre mobile, dans l'ordre (le bouton « + » s'insère au milieu). */
export const MOBILE_TABS = ["dashboard", "campaigns", "qr-codes", "reviews"] as const;

export function sectionHref(hotelSlug: string, slug: string): string {
  return `/${hotelSlug}/${slug}`;
}
