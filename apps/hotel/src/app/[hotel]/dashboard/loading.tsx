const panel = "rounded-md border border-line bg-surface";

/** Squelette du dashboard, au gabarit exact de la page (aucun saut à l'arrivée des chiffres). */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement du dashboard"
      className="grid max-w-[1600px] animate-pulse gap-4 py-4 md:gap-5 md:py-6 motion-reduce:animate-none"
    >
      <div className="grid gap-3">
        <span className="h-10 w-full max-w-[440px] rounded-md bg-white/[0.06]" />
        <span className="h-4 w-80 max-w-full rounded-sm bg-white/[0.05]" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={`h-[184px] ${panel}`} />
        ))}
      </div>
      <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
        <span className={`h-[340px] sm:h-[376px] lg:col-span-2 ${panel}`} />
        <span className={`h-[340px] sm:h-[376px] ${panel}`} />
      </div>
    </div>
  );
}
