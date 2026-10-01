import { z } from "zod";
import { dayFromIso } from "../dates";
import type { Weekday } from "./types";

/** Ce qu'on lit en 3 secondes : un titre court et une quinzaine de mots. */
export const TITLE_MAX = 40;
export const MESSAGE_MAX = 120;

const isoDate = z.string().refine((value) => dayFromIso(value) !== null, { error: "Date invalide." });

export const campaignInputSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { error: "Donnez un titre à la campagne." })
      .max(TITLE_MAX, { error: `${TITLE_MAX} caractères au plus.` }),
    message: z.string().trim().max(MESSAGE_MAX, { error: `${MESSAGE_MAX} caractères au plus.` }),
    image: z.string().nullable(),
    start: isoDate,
    end: isoDate.nullable(),
    days: z
      .array(z.number().int().min(0).max(6))
      .min(1, { error: "Choisissez au moins un jour." })
      .transform((days) => [...new Set(days)] as Weekday[]),
    hours: z
      .object({ from: z.number().int().min(0).max(1439), to: z.number().int().min(0).max(1439) })
      .nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.end && (dayFromIso(value.end) ?? 0) < (dayFromIso(value.start) ?? 0)) {
      ctx.addIssue({ code: "custom", path: ["end"], message: "La fin ne peut pas précéder le début." });
    }
    if (value.hours && value.hours.from === value.hours.to) {
      ctx.addIssue({ code: "custom", path: ["hours"], message: "Choisissez deux heures différentes." });
    }
  });

export type CampaignInput = z.infer<typeof campaignInputSchema>;
export type CampaignField = keyof CampaignInput;

/** Première erreur de chaque champ. */
export function campaignErrors(result: z.ZodSafeParseError<unknown>): Partial<Record<CampaignField, string>> {
  const errors: Partial<Record<CampaignField, string>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as CampaignField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
