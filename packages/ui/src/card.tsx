import type { HTMLAttributes } from "react";
import { cn } from "./cn";

/** Classes d'un panneau posé dans la page : palier `surface`, filet, coins de 10 px, sans ombre. */
export function cardClasses(className?: string): string {
  return cn("rounded-md border border-line bg-surface", className);
}

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Élément rendu : `section` pour un bloc titré, `div` sinon. */
  as?: "section" | "div" | "article";
}

/** Panneau de contenu (dashboard, listes). Jamais imbriqué dans un autre panneau. */
export function Card({ as: Tag = "section", className, ...props }: CardProps) {
  return <Tag className={cardClasses(className)} {...props} />;
}
