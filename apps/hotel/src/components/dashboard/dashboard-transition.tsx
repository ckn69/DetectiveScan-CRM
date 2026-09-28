"use client";

import { cn } from "@detectivescan/ui";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, use, useCallback, useMemo, useTransition } from "react";

type DashboardNavigation = {
  pending: boolean;
  /** Change de période sans remonter en haut de page ; `update` s'exécute dans la même transition. */
  navigate: (href: string, update?: () => void) => void;
};

const NavigationContext = createContext<DashboardNavigation | null>(null);

export function useDashboardNavigation(): DashboardNavigation {
  const context = use(NavigationContext);
  if (!context) throw new Error("useDashboardNavigation doit être utilisé dans <DashboardTransition>");
  return context;
}

/**
 * Pendant le chargement d'une autre période, les chiffres affichés restent en place,
 * atténués : ni squelette, ni saut de mise en page. Le filtre, lui, reste net.
 */
export function DashboardTransition({ filter, children }: { filter: ReactNode; children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string, update?: () => void) => {
      startTransition(() => {
        update?.();
        router.push(href, { scroll: false });
      });
    },
    [router],
  );

  const value = useMemo(() => ({ pending, navigate }), [pending, navigate]);

  return (
    <NavigationContext value={value}>
      {filter}
      <div
        aria-busy={pending || undefined}
        className={cn(
          "grid gap-4 transition-opacity duration-200 ease-out md:gap-5",
          pending && "pointer-events-none opacity-50",
        )}
      >
        {children}
      </div>
    </NavigationContext>
  );
}
