import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

/** Identifiants à passer en aria-describedby au champ. */
export function describedBy(id: string, { error, hint }: { error?: string; hint?: string }): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

/**
 * Libellé + champ + aide ou erreur. L'erreur remplace l'aide quand elle existe.
 * Les liens associés (ex. « Mot de passe oublié ? ») se placent après le champ,
 * jamais avant, pour garder un ordre de tabulation naturel.
 */
export function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[13px] font-medium text-fg-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] leading-snug text-red-text">
          <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-snug text-fg-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
