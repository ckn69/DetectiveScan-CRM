import type { QrCode } from "./types";

/**
 * Modèle de l'URL encodée dans un QR, `{id}` remplacé par l'identifiant.
 * Provisoire : la forme exacte des URL du site du jeu reste à confirmer, et ce
 * modèle se réglera hôtel par hôtel depuis le back-office.
 */
export const QR_URL_TEMPLATE = "https://detectivescan.com/?qr={id}";

/** Identifiant imprimé : lettres, chiffres et tirets, comme `01-254-00`. */
export const QR_ID_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,30}[A-Za-z0-9])?$/;

export function qrUrl(id: string, template: string = QR_URL_TEMPLATE): string {
  return template.replace("{id}", encodeURIComponent(id));
}

const normalizeUrl = (value: string) => value.trim().replace(/\/+$/, "").toLowerCase();

/**
 * Retrouve l'identifiant d'un QR à partir de ce qu'il contient (scan) ou de ce qui
 * a été saisi : URL connue, URL au format du modèle, paramètre `qr`, ou identifiant seul.
 */
export function qrIdFromScan(raw: string, known: QrCode[], template: string = QR_URL_TEMPLATE): string | null {
  const value = raw.trim();
  if (!value) return null;

  const exact = known.find((qr) => normalizeUrl(qr.url) === normalizeUrl(value));
  if (exact) return exact.id;

  const [before, after = ""] = template.split("{id}");
  const pattern = new RegExp(
    `^${escapeRegExp(before ?? "")}([^/?#&]+)${escapeRegExp(after)}/?$`,
    "i",
  );
  const fromTemplate = pattern.exec(value)?.[1];
  if (fromTemplate) return decodeURIComponent(fromTemplate);

  try {
    const parsed = new URL(value);
    const param = parsed.searchParams.get("qr");
    if (param) return param;
  } catch {
    // Ce n'est pas une URL : peut-être l'identifiant lui-même.
  }

  return QR_ID_PATTERN.test(value) ? value : null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Ordre naturel des chambres : 1, 2, 10, 12, puis « Suite 1 »… ; les QR sans chambre à la fin. */
export function compareRooms(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a.localeCompare(b, "fr", { numeric: true, sensitivity: "base" });
}
