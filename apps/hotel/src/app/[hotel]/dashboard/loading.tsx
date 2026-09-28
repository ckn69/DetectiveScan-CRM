import { cn } from "@detectivescan/ui";

const panel = "rounded-md border border-line bg-surface";

/**
 * Squelette du dashboard : même grille et mêmes hauteurs que la page (mesurées),
 * pour que rien ne saute à l'arrivée des chiffres.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement du dashboard"
      className="grid max-w-[1600px] animate-pulse gap-4 py-4 md:gap-5 md:py-6 motion-reduce:animate-none"
    >
      <div className="grid gap-3">
        <span className="h-[42px] w-full max-w-[440px] rounded-md bg-white/[0.06]" />
        <span className="flex h-9 items-center sm:h-[18px]">
          <span className="h-3 w-80 max-w-full rounded-sm bg-white/[0.05]" />
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={cn("h-[238px] md:h-[246px]", panel)} />
        ))}
      </div>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-12">
        <span className={cn("h-[362px] md:h-[366px] lg:col-span-2 xl:col-span-8 xl:h-[385px]", panel)} />
        <span className={cn("h-[377px] md:h-[385px] xl:col-span-4", panel)} />
        <span className={cn("h-[406px] md:h-[374px] lg:h-[385px] xl:col-span-5 xl:h-[427px]", panel)} />
        <span className={cn("h-[534px] md:h-[427px] lg:col-span-2 xl:col-span-7", panel)} />
      </div>
    </div>
  );
}
