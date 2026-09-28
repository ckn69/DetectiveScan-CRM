import { Info } from "lucide-react";

/** Rappel permanent que les chiffres affichés sont fictifs. */
export function DemoBanner() {
  return (
    <div className="border-b border-line bg-surface/70 px-4 py-2.5 md:px-8">
      <p className="flex items-start gap-2 text-[12.5px] leading-snug text-fg-2">
        <Info className="mt-px size-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden />
        <span>
          <strong className="font-semibold text-fg">Mode démo</strong> · données fictives de l'Hôtel Démo.
          <span className="hidden md:inline"> Les comptes s'activeront au branchement de la base de données.</span>
        </span>
      </p>
    </div>
  );
}
