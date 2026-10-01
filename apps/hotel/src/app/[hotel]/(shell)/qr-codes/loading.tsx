/** Squelette de la liste des QR codes : barre d'outils, puis lignes du tableau. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement des QR codes"
      className="grid max-w-[1600px] animate-pulse gap-4 py-4 md:gap-5 md:py-6 motion-reduce:animate-none"
    >
      <div className="flex flex-wrap gap-3">
        <span className="h-10 w-full rounded-sm bg-white/[0.06] sm:w-72" />
        <span className="h-[42px] w-[22rem] max-w-full rounded-md bg-white/[0.06]" />
      </div>
      <div className="rounded-md border border-line bg-surface">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} className="flex h-[49px] items-center border-t border-line px-5 first:border-t-0">
            <span className="h-3 w-2/5 rounded-sm bg-white/[0.05]" />
          </span>
        ))}
      </div>
    </div>
  );
}
