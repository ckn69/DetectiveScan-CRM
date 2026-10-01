/** Squelette de la liste des campagnes : tête, filtre, lignes avec vignette, et le panneau « En ce moment ». */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement des campagnes"
      className="grid max-w-[1600px] animate-pulse gap-4 py-4 md:gap-5 md:py-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start motion-reduce:animate-none"
    >
      <div className="h-[178px] rounded-md border border-line bg-surface xl:col-start-2 xl:row-start-1 xl:h-[612px]" />
      <div className="grid content-start gap-4 md:gap-5 xl:col-start-1 xl:row-start-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="h-4 w-56 rounded-sm bg-white/[0.06]" />
          <span className="h-10 w-full rounded-sm bg-white/[0.06] sm:w-48" />
        </div>
        <span className="h-[42px] w-72 max-w-full rounded-md bg-white/[0.06]" />
        <div className="rounded-md border border-line bg-surface">
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} className="flex items-center gap-4 border-t border-line px-4 py-3.5 first:border-t-0 md:px-5">
              <span className="h-[104px] w-[52px] shrink-0 rounded-sm bg-white/[0.05]" />
              <span className="grid flex-1 gap-2">
                <span className="h-3.5 w-1/2 rounded-sm bg-white/[0.06]" />
                <span className="h-3 w-1/3 rounded-sm bg-white/[0.05]" />
                <span className="h-3 w-2/3 rounded-sm bg-white/[0.05]" />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
