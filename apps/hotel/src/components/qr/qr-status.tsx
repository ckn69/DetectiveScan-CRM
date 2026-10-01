import { Badge } from "@detectivescan/ui";
import type { QrCode, QrStatus } from "@/lib/qr/types";

export const QR_STATUS_LABEL: Record<QrStatus, string> = {
  active: "Posé",
  pending: "À poser",
  inactive: "Désactivé",
};

/**
 * Statut d'un QR. L'état normal (posé) reste discret : une pastille verte et un libellé ;
 * seuls les cas à traiter prennent un badge (à poser en ambre, désactivé en neutre).
 */
export function QrStatusLabel({ status }: { status: QrStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-fg-2">
        <span aria-hidden className="size-1.5 rounded-full bg-success" />
        {QR_STATUS_LABEL.active}
      </span>
    );
  }
  return <Badge tone={status === "pending" ? "warning" : "neutral"}>{QR_STATUS_LABEL[status]}</Badge>;
}

/** « Chambre 12 », mais « Suite 5 » tel quel ; « Sans chambre » si le QR n'est associé à aucune. */
export function roomLabel(room: string | null): string {
  if (!room) return "Sans chambre";
  return /^\d/.test(room) ? `Chambre ${room}` : room;
}

/** Nombre de chambres qui ont au moins un QR posé. */
export function equippedRooms(qrs: QrCode[]): number {
  return new Set(qrs.flatMap((qr) => (qr.status === "active" && qr.room ? [qr.room.toLowerCase()] : []))).size;
}
