/** Squelette affiché pendant le chargement d'une section (même gabarit que le contenu). */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Chargement de la section"
      className="mx-auto grid w-full max-w-[640px] animate-pulse gap-7 py-8 md:py-14 motion-reduce:animate-none"
    >
      <span className="size-12 rounded-md bg-white/[0.06]" />
      <span className="grid gap-3">
        <span className="h-5 w-4/5 rounded-sm bg-white/[0.06]" />
        <span className="h-5 w-3/5 rounded-sm bg-white/[0.06]" />
      </span>
      <span className="grid gap-3 border-y border-line py-5">
        <span className="h-4 w-2/3 rounded-sm bg-white/[0.05]" />
        <span className="h-4 w-1/2 rounded-sm bg-white/[0.05]" />
        <span className="h-4 w-3/5 rounded-sm bg-white/[0.05]" />
      </span>
    </div>
  );
}
