import { ChevronDown } from "lucide-react";

const DEFINITIONS = [
  { term: "Scans", text: "Ouvertures du lien d'un QR code, hors robots et scans de test." },
  { term: "Visiteurs uniques", text: "Téléphones différents sur la période, reconnus sans donnée personnelle." },
  { term: "Joueurs", text: "Visiteurs qui ont commencé au moins une partie." },
  { term: "Taux de participation", text: "Joueurs ÷ visiteurs uniques." },
  { term: "Parties terminées", text: "Parties arrivées au bout de l'enquête, gagnées ou perdues ; les autres sont des abandons." },
  { term: "Gagnants et perdants", text: "Parties terminées sur une victoire ou sur un échec." },
  { term: "Ont aimé, n'ont pas aimé", text: "Réponses à « Avez-vous aimé l'enquête ? », posée en fin de partie." },
  { term: "Taux de satisfaction", text: "Part des notes de 4 ou 5 sur 5." },
  { term: "Comparaison", text: "Même durée, juste avant la période choisie ; aujourd'hui se compare à hier à la même heure." },
];

/** Définitions des indicateurs, repliées par défaut. */
export function Definitions() {
  return (
    <details className="group border-t border-line pt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-sm text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
        Comment sont calculés ces chiffres ?
        <ChevronDown
          className="size-4 transition-transform duration-200 ease-out group-open:rotate-180"
          strokeWidth={1.75}
          aria-hidden
        />
      </summary>
      <dl className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
        {DEFINITIONS.map((definition) => (
          <div key={definition.term}>
            <dt className="text-[13px] font-medium text-fg">{definition.term}</dt>
            <dd className="mt-0.5 text-[13px] leading-relaxed text-fg-3">{definition.text}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
