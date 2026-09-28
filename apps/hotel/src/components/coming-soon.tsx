import { Badge } from "@detectivescan/ui";
import { CircleDashed } from "lucide-react";
import { notFound } from "next/navigation";
import { findSection } from "@/lib/nav";

/**
 * État d'une section pas encore livrée : ce qu'elle contiendra et l'étape qui l'apporte.
 * Volontairement neutre (aucun rouge) : le rouge reste réservé aux actions.
 * Remplacé section par section au fil des étapes de développement.
 */
export function ComingSoon({ slug }: { slug: string }) {
  const section = findSection(slug);
  if (!section) notFound();
  const { icon: Icon, summary, features, step } = section;

  return (
    <section aria-labelledby="section-title" className="mx-auto grid w-full max-w-[640px] gap-7 py-8 md:py-14">
      <span className="flex size-12 items-center justify-center rounded-md bg-white/[0.06] text-fg-2 ring-1 ring-inset ring-line">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden />
      </span>

      <h2 id="section-title" className="max-w-[34ch] text-[22px] font-semibold leading-snug tracking-[-0.015em]">
        {summary}
      </h2>

      <ul className="grid gap-3 border-y border-line py-5" aria-label="Contenu prévu">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-[14px] text-fg-2">
            <CircleDashed className="mt-0.5 size-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="neutral">Prévu à l'étape {step}</Badge>
        <p className="text-[13px] text-fg-3">Chaque étape livre une section complète, l'une après l'autre.</p>
      </div>
    </section>
  );
}
