/**
 * QR codes d'un hôtel. Chaque QR posé a sa propre URL : c'est elle que le client scanne,
 * et c'est elle qui dit quelle chambre joue. Le mode démo garde ces données dans le
 * navigateur ; la base de données les gardera sous la même forme.
 */

/** Posé et actif · enregistré mais pas encore posé · désactivé (abîmé, retiré, essai terminé). */
export type QrStatus = "active" | "pending" | "inactive";

export type QrCode = {
  /** Identifiant imprimé sur le QR : `01-254-00`. Ne change jamais. */
  id: string;
  /** Adresse encodée dans le QR. */
  url: string;
  /** Chambre où le QR est posé, `null` s'il n'est associé à aucune. */
  room: string | null;
  status: QrStatus;
  /** Date d'enregistrement (ISO). */
  createdAt: string;
};

export type QrEventKind =
  | "created"
  | "imported"
  | "installed"
  | "assigned"
  | "unassigned"
  | "url_changed"
  | "deactivated"
  | "reactivated";

/** Une ligne de l'historique d'un QR code. */
export type QrEvent = {
  id: string;
  qr: string;
  kind: QrEventKind;
  /** Date (ISO). */
  at: string;
  /** Chambre après l'événement. */
  room: string | null;
  /** Qui l'a fait : « Claire M. », « Équipe DetectiveScan ». */
  by: string;
  note?: string;
};

export type QrState = { qrs: QrCode[]; events: QrEvent[] };

/** Activité d'un QR sur les 30 derniers jours. */
export type QrActivity = {
  scans: number;
  /** Joueurs ÷ visiteurs, `null` sous 5 scans. */
  participation: number | null;
  /** Dernier scan : libellé (« Hier · 22 h 41 ») et valeur de tri. */
  lastScan: { label: string; sort: number } | null;
  /** QR posé depuis plus de 7 jours et pas scanné depuis 7 jours : à vérifier sur place. */
  quiet: boolean;
};
