/** Squelette de la fiche d'une campagne : tête, résultats, graphique, aperçu. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement de la campagne"
      className="grid max-w-[1280px] animate-pulse gap-5 py-4 md:gap-6 md:py-6 motion-reduce:animate-none"
    >
      <div className="grid gap-3">
        <span className="h-3.5 w-24 rounded-sm bg-white/[0.05]" />
        <span className="h-6 w-80 max-w-full rounded-sm bg-white/[0.07]" />
        <span className="h-4 w-48 rounded-sm bg-white/[0.05]" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="h-[560px] rounded-md border border-line bg-surface xl:col-start-2 xl:row-start-1" />
        <div className="grid gap-5 xl:col-start-1 xl:row-start-1">
          <div className="h-[120px] rounded-md border border-line bg-surface" />
          <div className="h-[300px] rounded-md border border-line bg-surface" />
        </div>
      </div>
    </div>
  );
}
