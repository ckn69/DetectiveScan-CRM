"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CampaignInput } from "@/lib/campaigns/schema";
import type { Campaign } from "@/lib/campaigns/types";

/*
 * Campagnes du mode démo, gardées dans ce navigateur (localStorage), images importées
 * comprises. Avec Supabase, ces actions deviendront des Server Actions et les images
 * iront dans Storage ; les écrans ne changeront pas.
 */

const STORAGE_KEY = "ds-demo-campaigns";
const VERSION = 1;

let current: Campaign[] | null = null;
const listeners = new Set<() => void>();

function read(base: Campaign[]): Campaign[] {
  if (current) return current;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved?.version === VERSION && Array.isArray(saved.campaigns)) {
      current = saved.campaigns as Campaign[];
      return current;
    }
  } catch {
    // Stockage indisponible : on repart des campagnes de départ.
  }
  current = base;
  return current;
}

/**
 * Applique le changement, puis l'enregistre. `false` : le navigateur n'a pas pu le garder
 * (stockage plein, souvent à cause d'une image) ; il vaut pour cette visite seulement.
 */
function write(next: Campaign[]): boolean {
  current = next;
  for (const listener of listeners) listener();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, campaigns: next }));
    return true;
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCampaignStore(base: Campaign[]) {
  const campaigns = useSyncExternalStore(
    subscribe,
    () => read(base),
    () => base,
  );

  const actions = useMemo(
    () => ({
      /** Crée la campagne ; `saved` dit si le navigateur a pu la garder au-delà de cette visite. */
      add(input: CampaignInput): { id: string; saved: boolean } {
        const id = `c-${Date.now().toString(36)}`;
        const campaign: Campaign = { ...input, id, paused: false, createdAt: new Date().toISOString() };
        return { id, saved: write([campaign, ...read(base)]) };
      },
      update(id: string, patch: Partial<Omit<Campaign, "id" | "createdAt">>): boolean {
        return write(read(base).map((campaign) => (campaign.id === id ? { ...campaign, ...patch } : campaign)));
      },
      remove(id: string): boolean {
        return write(read(base).filter((campaign) => campaign.id !== id));
      },
      reset() {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Rien à effacer.
        }
        current = base;
        for (const listener of listeners) listener();
      },
    }),
    [base],
  );

  return { campaigns, ...actions };
}

const subscribeNothing = () => () => {};

/** `false` au rendu serveur et à l'hydratation, `true` ensuite : le stockage du navigateur est lisible. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
}
