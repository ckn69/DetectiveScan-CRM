import { DEMO_DATA_SINCE, DEMO_ROOMS } from "../dashboard/demo-data";
import { isoFromDay } from "../dates";
import type { QrCode, QrEvent, QrState } from "./types";
import { qrUrl } from "./url";

const TEAM = "Équipe DetectiveScan";

/** Le matin du jour donné : 9 h UTC, soit 10 h à Paris en hiver (les poses se font le matin). */
const morning = (day: number) => `${isoFromDay(day)}T09:00:00.000Z`;

/**
 * Parc de QR codes de l'Hôtel Démo au départ : 42 QR posés (un par chambre), un QR de
 * rechange pas encore posé, et un QR abîmé, désactivé puis remplacé en chambre 17.
 */
export function demoQrBase(): QrState {
  const installed = morning(DEMO_DATA_SINCE);
  const replaced = morning(DEMO_DATA_SINCE + 12);

  const qrs: QrCode[] = DEMO_ROOMS.map(({ room, qr }) => ({
    id: qr,
    url: qrUrl(qr),
    room,
    status: "active",
    createdAt: qr === "01-254-05" ? replaced : installed,
  }));
  qrs.push(
    { id: "01-254-42", url: qrUrl("01-254-42"), room: null, status: "pending", createdAt: installed },
    { id: "01-254-43", url: qrUrl("01-254-43"), room: "17", status: "inactive", createdAt: installed },
  );

  const events: QrEvent[] = DEMO_ROOMS.map(({ room, qr }) =>
    qr === "01-254-05"
      ? { id: `e-${qr}-1`, qr, kind: "installed", at: replaced, room, by: TEAM, note: "Remplace le QR 01-254-43, abîmé." }
      : { id: `e-${qr}-1`, qr, kind: "installed", at: installed, room, by: TEAM },
  );
  events.push(
    { id: "e-01-254-42-1", qr: "01-254-42", kind: "created", at: installed, room: null, by: TEAM, note: "QR de rechange." },
    { id: "e-01-254-43-1", qr: "01-254-43", kind: "installed", at: installed, room: "17", by: TEAM },
    {
      id: "e-01-254-43-2",
      qr: "01-254-43",
      kind: "deactivated",
      at: replaced,
      room: "17",
      by: TEAM,
      note: "Abîmé, remplacé par le QR 01-254-05.",
    },
  );

  return { qrs, events };
}
