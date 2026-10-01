"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DEMO_USER } from "@/lib/demo";
import type { ImportRow } from "@/lib/qr/csv";
import type { QrInput } from "@/lib/qr/schema";
import type { QrCode, QrEvent, QrEventKind, QrState } from "@/lib/qr/types";

/*
 * Parc de QR codes du mode démo, gardé dans ce navigateur (localStorage) : les ajouts,
 * imports et poses survivent à un rechargement, sans base de données. Avec Supabase,
 * ces actions deviendront des Server Actions ; les écrans ne changeront pas.
 */

const STORAGE_KEY = "ds-demo-qr";
const VERSION = 1;

let current: QrState | null = null;
const listeners = new Set<() => void>();

function read(base: QrState): QrState {
  if (current) return current;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved?.version === VERSION && Array.isArray(saved.state?.qrs) && Array.isArray(saved.state?.events)) {
      current = saved.state as QrState;
      return current;
    }
  } catch {
    // Stockage indisponible (navigation privée, données effacées) : on repart du parc de départ.
  }
  current = base;
  return current;
}

function write(next: QrState) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, state: next }));
  } catch {
    // Les changements restent en mémoire jusqu'au rechargement.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let sequence = 0;

function event(qr: string, kind: QrEventKind, room: string | null, note?: string): QrEvent {
  sequence += 1;
  return {
    id: `e-${Date.now().toString(36)}-${sequence}`,
    qr,
    kind,
    at: new Date().toISOString(),
    room,
    by: DEMO_USER.shortName,
    ...(note ? { note } : {}),
  };
}

/** Ce qui a changé entre deux états d'un QR, en lignes d'historique. */
function changes(before: QrCode, after: QrCode, note?: string): QrEvent[] {
  const events: QrEvent[] = [];
  const installed = before.status !== "active" && after.status === "active";

  if (installed && before.status === "pending") {
    events.push(event(after.id, "installed", after.room, note));
  } else if (before.room !== after.room) {
    events.push(event(after.id, after.room ? "assigned" : "unassigned", after.room, note));
  }
  if (before.status !== after.status) {
    if (after.status === "inactive") events.push(event(after.id, "deactivated", after.room, note));
    else if (before.status === "inactive") events.push(event(after.id, "reactivated", after.room, note));
    else if (after.status === "pending" && before.room === after.room) {
      events.push(event(after.id, "unassigned", after.room, note ?? "Retiré, à reposer."));
    }
  }
  if (before.url !== after.url) events.push(event(after.id, "url_changed", after.room, note));
  return events;
}

export type QrPatch = Partial<Pick<QrCode, "room" | "url" | "status">>;

export function useQrStore(base: QrState) {
  const state = useSyncExternalStore(
    subscribe,
    () => read(base),
    () => base,
  );

  const actions = useMemo(
    () => ({
      add(input: QrInput, note?: string): QrCode {
        const now = read(base);
        const qr: QrCode = { ...input, createdAt: new Date().toISOString() };
        const kind = qr.status === "active" ? "installed" : qr.status === "inactive" ? "deactivated" : "created";
        write({ qrs: [...now.qrs, qr], events: [...now.events, event(qr.id, kind, qr.room, note)] });
        return qr;
      },

      update(id: string, patch: QrPatch, note?: string) {
        const now = read(base);
        const before = now.qrs.find((qr) => qr.id === id);
        if (!before) return;
        const after = { ...before, ...patch };
        write({
          qrs: now.qrs.map((qr) => (qr.id === id ? after : qr)),
          events: [...now.events, ...changes(before, after, note)],
        });
      },

      remove(id: string) {
        const now = read(base);
        write({ qrs: now.qrs.filter((qr) => qr.id !== id), events: now.events.filter((item) => item.qr !== id) });
      },

      /** Applique les lignes valides d'un import (ajouts et mises à jour). */
      importRows(rows: ImportRow[]): number {
        const now = read(base);
        const byId = new Map(now.qrs.map((qr) => [qr.id, qr]));
        const events = [...now.events];
        const stamp = new Date().toISOString();
        let applied = 0;

        for (const row of rows) {
          const next: QrCode = { id: row.id, url: row.url, room: row.room, status: row.status, createdAt: stamp };
          const before = byId.get(row.id);
          if (row.action === "add") {
            byId.set(row.id, next);
            events.push(event(row.id, "imported", row.room, "Import CSV"));
            applied++;
          } else if (row.action === "update" && before) {
            const after = { ...before, room: row.room, url: row.url, status: row.status };
            byId.set(row.id, after);
            events.push(...changes(before, after, "Import CSV"));
            applied++;
          }
        }
        write({ qrs: [...byId.values()], events });
        return applied;
      },

      /** Remet le parc de départ de la démo. */
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

  return { state, ...actions };
}
