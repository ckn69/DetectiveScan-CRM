import type { ReactNode } from "react";

/** En-tête d'un panneau du dashboard : titre, précision, et éventuellement une action à droite. */
export function PanelHeader({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <div className="min-w-0">
        <h2 id={id} className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-fg">
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-[12.5px] leading-snug text-fg-3">{description}</p> : null}
      </div>
      {children}
    </header>
  );
}
