import { z } from "zod";
import type { QrCode, QrStatus } from "./types";
import { QR_ID_PATTERN } from "./url";

export const qrIdSchema = z
  .string()
  .trim()
  .min(1, "Saisissez l'identifiant imprimé sur le QR code.")
  .max(32, "32 caractères au plus.")
  .regex(QR_ID_PATTERN, "Lettres, chiffres et tirets seulement, comme 01-254-00.");

export const qrUrlSchema = z
  .string()
  .trim()
  .min(1, "Saisissez l'adresse encodée dans le QR code.")
  .pipe(z.url({ protocol: /^https?$/, error: "Adresse invalide : elle commence par https://." }));

export const roomSchema = z
  .string()
  .trim()
  .max(20, "20 caractères au plus.")
  .transform((value) => value || null);

export const statusSchema = z.enum(["active", "pending", "inactive"]);

export const qrInputSchema = z.object({ id: qrIdSchema, url: qrUrlSchema, room: roomSchema, status: statusSchema });

export type QrInput = { id: string; url: string; room: string | null; status: QrStatus };

export type QrCheck = {
  errors: Partial<Record<keyof QrInput, string>>;
  /** Avertissement non bloquant (chambre déjà équipée). */
  warning: string | null;
};

/**
 * Règles qui dépendent des autres QR de l'hôtel : identifiant et adresse uniques,
 * chambre obligatoire pour un QR posé. `editing` : identifiant du QR modifié.
 */
export function checkQr(input: QrInput, existing: QrCode[], editing?: string): QrCheck {
  const others = existing.filter((qr) => qr.id !== editing);
  const errors: QrCheck["errors"] = {};

  if (!editing && existing.some((qr) => qr.id.toLowerCase() === input.id.toLowerCase())) {
    errors.id = `Le QR ${input.id} est déjà enregistré.`;
  }
  const sameUrl = others.find((qr) => qr.url.toLowerCase() === input.url.toLowerCase());
  if (sameUrl) errors.url = `Cette adresse est déjà celle du QR ${sameUrl.id}.`;
  if (input.status === "active" && !input.room) errors.room = "Un QR posé doit avoir une chambre.";

  const neighbour = input.room
    ? others.find((qr) => qr.status === "active" && qr.room?.toLowerCase() === input.room?.toLowerCase())
    : undefined;
  const warning =
    neighbour && input.status === "active"
      ? `${/^\d/.test(input.room ?? "") ? `La chambre ${input.room}` : input.room} a déjà le QR ${neighbour.id} : les deux compteront pour cette chambre.`
      : null;

  return { errors, warning };
}

/** Message de la première erreur de format, champ par champ. */
export function formatErrors(result: z.ZodSafeParseError<unknown>): Partial<Record<keyof QrInput, string>> {
  const errors: Partial<Record<keyof QrInput, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof QrInput | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
