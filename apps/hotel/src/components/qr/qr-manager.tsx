"use client";

import { Button, buttonClasses, cn } from "@detectivescan/ui";
import { ArrowDown, ArrowUp, ChevronRight, CircleAlert, Plus, ScanLine, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatInteger, formatPercent } from "@/lib/format";
import type { QrActivity, QrState, QrStatus } from "@/lib/qr/types";
import { compareRooms } from "@/lib/qr/url";
import { Notice, useNotice } from "../notice";
import { QrSheet, type SheetState } from "./qr-sheet";
import { equippedRooms, QrStatusLabel, roomLabel } from "./qr-status";
import { useQrStore } from "./qr-store";

type Filter = "all" | QrStatus | "quiet";
type SortKey = "room" | "scans" | "participation" | "last";
type Sort = { key: SortKey; direction: "asc" | "desc" };

const STATUS_ORDER: Record<QrStatus, number> = { active: 0, pending: 1, inactive: 2 };

const searchable = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^\s*(chambre|ch\.?)\s+/, "")
    .replace(/\s+/g, "");

const searchClasses =
  "h-10 w-full rounded-sm border border-line-strong bg-surface pl-10 pr-3.5 text-[14px] text-fg placeholder:text-fg-3 " +
  "transition-[border-color,box-shadow] duration-150 ease-out hover:border-white/25 " +
  "focus:border-red focus:outline-none focus:ring-3 focus:ring-red/35 [&::-webkit-search-cancel-button]:hidden";

/**
 * QR codes & chambres : quel QR est dans quelle chambre, et combien chacun est scanné.
 * Recherche par QR ou par chambre, filtre par statut, détail et modification en panneau.
 */
export function QrManager({
  base,
  activity,
  template,
  rooms,
  totalRooms,
  importHref,
  installHref,
}: {
  base: QrState;
  activity: Record<string, QrActivity>;
  template: string;
  rooms: string[];
  /** Nombre de chambres de l'hôtel, pour dire combien sont équipées. */
  totalRooms: number;
  importHref: string;
  installHref: string;
}) {
  const store = useQrStore(base);
  const { qrs, events } = store.state;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>({ key: "room", direction: "asc" });
  const [sheet, setSheet] = useState<SheetState>(null);
  const notice = useNotice();

  // Un lien `?qr=01-254-00` ouvre directement le détail de ce QR.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("qr");
    if (id) setSheet({ mode: "view", id });
  }, []);

  /** Ouverture depuis la liste : la confirmation d'une action précédente n'a plus lieu d'être. */
  function openFromList(next: SheetState) {
    notice.clear();
    openSheet(next);
  }

  function openSheet(next: SheetState) {
    setSheet(next);
    const url = next && next.mode !== "create" ? `?qr=${encodeURIComponent(next.id)}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }

  const sheetOpen = sheet !== null && (sheet.mode === "create" || qrs.some((qr) => qr.id === sheet.id));
  const isQuiet = (id: string, status: QrStatus) => status === "active" && activity[id]?.quiet === true;

  const counts = useMemo(
    () => ({
      all: qrs.length,
      active: qrs.filter((qr) => qr.status === "active").length,
      pending: qrs.filter((qr) => qr.status === "pending").length,
      inactive: qrs.filter((qr) => qr.status === "inactive").length,
      quiet: qrs.filter((qr) => qr.status === "active" && activity[qr.id]?.quiet === true).length,
    }),
    [qrs, activity],
  );

  const equipped = useMemo(() => equippedRooms(qrs), [qrs]);

  const visible = useMemo(() => {
    const needle = searchable(query);
    const filtered = qrs.filter((qr) => {
      if (filter === "quiet" ? !(qr.status === "active" && activity[qr.id]?.quiet) : filter !== "all" && qr.status !== filter) {
        return false;
      }
      return !needle || searchable(qr.id).includes(needle) || searchable(qr.room ?? "").includes(needle);
    });
    const value = (id: string, key: SortKey): number => {
      const stat = activity[id];
      if (key === "scans") return stat?.scans ?? -1;
      if (key === "participation") return stat?.participation ?? -1;
      return stat?.lastScan?.sort ?? -1;
    };
    const factor = sort.direction === "asc" ? 1 : -1;
    return filtered.sort((a, b) => {
      const primary =
        sort.key === "room" ? compareRooms(a.room, b.room) : value(a.id, sort.key) - value(b.id, sort.key);
      // À chambre égale, le QR posé passe avant celui qu'il a remplacé.
      return (
        primary * factor ||
        compareRooms(a.room, b.room) ||
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        a.id.localeCompare(b.id)
      );
    });
  }, [qrs, query, filter, sort, activity]);

  const roomOptions = useMemo(
    () => [...new Set([...rooms, ...qrs.flatMap((qr) => (qr.room ? [qr.room] : []))])].sort(compareRooms),
    [rooms, qrs],
  );

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Tous", count: counts.all },
    { key: "active", label: "Posés", count: counts.active },
    { key: "pending", label: "À poser", count: counts.pending },
    { key: "inactive", label: "Désactivés", count: counts.inactive },
  ];

  return (
    <div className="grid max-w-[1600px] gap-4 py-4 md:gap-5 md:py-6">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="text-[14px] text-fg-2">
          <span className="font-semibold tabular-nums text-fg">{equipped}</span>{" "}
          {equipped > 1 ? "chambres équipées" : "chambre équipée"}
          {equipped <= totalRooms ? (
            <>
              {" "}
              sur <span className="tabular-nums">{totalRooms}</span>
            </>
          ) : null}
        </p>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <Link href={installHref} className={buttonClasses({ variant: "secondary", className: "col-span-2" })}>
            <ScanLine strokeWidth={1.75} aria-hidden />
            Mode installation
          </Link>
          <Button variant="secondary" onClick={() => openFromList({ mode: "create" })}>
            <Plus strokeWidth={1.75} aria-hidden />
            <span className="sm:hidden">Ajouter un QR</span>
            <span className="max-sm:hidden">Ajouter un QR code</span>
          </Button>
          <Link href={importHref} className={buttonClasses({ variant: "ghost" })}>
            <Upload strokeWidth={1.75} aria-hidden />
            Importer un CSV
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-3" strokeWidth={1.75} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="QR code ou chambre"
            aria-label="Rechercher un QR code ou une chambre"
            className={searchClasses}
          />
        </div>

        <div role="group" aria-label="Filtrer par statut" className="max-w-full overflow-x-auto">
          <div className="flex w-max items-center gap-0.5 rounded-md border border-line bg-surface p-1">
            {filters.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={filter === option.key}
                onClick={() => setFilter(option.key)}
                className={cn(
                  "flex h-8 items-center gap-1.5 whitespace-nowrap rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
                  filter === option.key ? "bg-white/[0.09] text-fg" : "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
                )}
              >
                {option.label}
                <span className="tabular-nums text-fg-3">{option.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {counts.quiet > 0 && filter !== "quiet" ? (
        <p className="flex flex-wrap items-start gap-x-2.5 gap-y-1 rounded-md border border-line-strong bg-surface px-4 py-3 text-[13.5px] leading-snug text-fg-2">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden />
          <span className="min-w-0 flex-1">
            {counts.quiet === 1
              ? "1 QR posé n'a pas été scanné ces 7 derniers jours : vérifiez qu'il est toujours en place et lisible."
              : `${counts.quiet} QR posés n'ont pas été scannés ces 7 derniers jours : vérifiez qu'ils sont toujours en place et lisibles.`}{" "}
            <button
              type="button"
              onClick={() => setFilter("quiet")}
              className="rounded-sm font-medium text-fg underline underline-offset-4 transition-colors duration-150 hover:text-fg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {counts.quiet === 1 ? "Voir ce QR" : "Voir ces QR"}
            </button>
          </span>
        </p>
      ) : null}

      {filter === "quiet" ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-2">
          QR posés sans scan ces 7 derniers jours.
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="rounded-sm font-medium text-fg underline underline-offset-4 hover:text-fg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Voir tous les QR
          </button>
        </p>
      ) : null}

      <section aria-labelledby="qr-list-title" className="rounded-md border border-line bg-surface">
        <h2 id="qr-list-title" className="sr-only">
          Liste des QR codes
        </h2>
        <p className="sr-only" aria-live="polite">
          {visible.length} QR code{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}.
        </p>

        {visible.length === 0 ? (
          <EmptyState
            searching={query.trim() !== "" || filter !== "all"}
            query={query}
            onClear={() => {
              setQuery("");
              setFilter("all");
            }}
            onAdd={() => openFromList({ mode: "create" })}
            importHref={importHref}
          />
        ) : (
          <>
            <table className="hidden w-full text-[13.5px] md:table">
              <thead className="text-[12px] text-fg-3">
                <tr>
                  <SortHeader label="Chambre" sortKey="room" sort={sort} onSort={setSort} className="pl-5" />
                  <th scope="col" className="px-3 py-3 text-left font-medium">
                    QR code
                  </th>
                  <th scope="col" className="px-3 py-3 text-left font-medium">
                    Statut
                  </th>
                  <SortHeader label="Scans 30 j" sortKey="scans" sort={sort} onSort={setSort} align="right" />
                  <SortHeader label="Participation" sortKey="participation" sort={sort} onSort={setSort} align="right" className="max-lg:hidden" />
                  <SortHeader label="Dernier scan" sortKey="last" sort={sort} onSort={setSort} />
                  <th scope="col" className="w-12 py-3 pr-5">
                    <span className="sr-only">Détail</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((qr) => {
                  const stat = activity[qr.id];
                  const quiet = isQuiet(qr.id, qr.status);
                  return (
                    <tr
                      key={qr.id}
                      onClick={() => openFromList({ mode: "view", id: qr.id })}
                      className="cursor-pointer border-t border-line transition-colors duration-150 hover:bg-white/[0.05]"
                    >
                      <th scope="row" className="py-2.5 pl-5 pr-3 text-left align-baseline font-medium">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openFromList({ mode: "view", id: qr.id });
                          }}
                          className={cn(
                            "rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                            qr.room ? "text-fg" : "text-fg-3",
                          )}
                        >
                          {roomLabel(qr.room)}
                        </button>
                      </th>
                      <td className="px-3 py-2.5 align-baseline font-mono text-[12.5px] text-fg-2">{qr.id}</td>
                      <td className="px-3 py-2.5 align-baseline text-[13px]">
                        <QrStatusLabel status={qr.status} />
                      </td>
                      <td className="px-3 py-2.5 text-right align-baseline tabular-nums text-fg">
                        {formatInteger(stat?.scans ?? 0)}
                      </td>
                      <td className="px-3 py-2.5 text-right align-baseline tabular-nums text-fg-2 max-lg:hidden">
                        {stat?.participation != null ? formatPercent(stat.participation) : "—"}
                      </td>
                      <td className="px-3 py-2.5 align-baseline tabular-nums">
                        <LastScan label={stat?.lastScan?.label ?? null} quiet={quiet} />
                      </td>
                      <td className="py-2.5 pr-5 text-right align-middle text-fg-3">
                        <ChevronRight className="ml-auto size-4" strokeWidth={1.75} aria-hidden />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <ul className="md:hidden">
              {visible.map((qr, index) => {
                const stat = activity[qr.id];
                return (
                  <li key={qr.id}>
                    <button
                      type="button"
                      onClick={() => openFromList({ mode: "view", id: qr.id })}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-white/[0.05]",
                        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
                        index > 0 && "border-t border-line",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <span className={cn("text-[14px] font-medium", qr.room ? "text-fg" : "text-fg-3")}>
                            {roomLabel(qr.room)}
                          </span>
                          <span className="text-[12.5px]">
                            <QrStatusLabel status={qr.status} />
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] text-fg-3">
                          <span className="font-mono">{qr.id}</span> ·{" "}
                          <span className="tabular-nums">{formatInteger(stat?.scans ?? 0)} scans</span>
                          {isQuiet(qr.id, qr.status) ? <span className="text-warning"> · sans scan depuis 7 j</span> : null}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-fg-3">
        Démo : vos changements restent dans ce navigateur.
        <button
          type="button"
          onClick={() => {
            store.reset();
            notice.show("Parc de QR de la démo rétabli.");
          }}
          className="rounded-sm text-fg-2 underline underline-offset-4 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Revenir au parc de départ
        </button>
      </p>

      <QrSheet
        state={sheet}
        qrs={qrs}
        events={events}
        activity={activity}
        template={template}
        rooms={roomOptions}
        onClose={() => openSheet(null)}
        onMode={openSheet}
        onCreate={(input) => {
          store.add(input);
          notice.show(`QR ${input.id} ajouté.`);
          openSheet({ mode: "view", id: input.id });
        }}
        onUpdate={(id, input) => {
          const before = qrs.find((qr) => qr.id === id);
          store.update(id, input);
          notice.show(
            before && before.status !== input.status && input.status === "inactive"
              ? `QR ${id} désactivé.`
              : before && before.status === "inactive" && input.status !== "inactive"
                ? `QR ${id} réactivé.`
                : "Modifications enregistrées.",
          );
          openSheet({ mode: "view", id });
        }}
        onRemove={(id) => {
          store.remove(id);
          openSheet(null);
          notice.show(`QR ${id} supprimé.`);
        }}
        notice={sheetOpen ? notice.message : null}
      />
      <Notice message={sheetOpen ? null : notice.message} />
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = "left",
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: Sort;
  onSort: (sort: Sort) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const active = sort.key === sortKey;
  const Arrow = sort.direction === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.direction === "asc" ? "ascending" : "descending") : undefined}
      className={cn("px-3 py-3 font-medium", align === "right" ? "text-right" : "text-left", className)}
    >
      <button
        type="button"
        onClick={() =>
          onSort({
            key: sortKey,
            // Chambres de A à Z d'abord ; chiffres du plus grand au plus petit d'abord.
            direction: active ? (sort.direction === "asc" ? "desc" : "asc") : sortKey === "room" ? "asc" : "desc",
          })
        }
        className={cn(
          "inline-flex items-center gap-1 rounded-sm transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
          active && "text-fg-2",
        )}
      >
        {label}
        {active ? <Arrow className="size-3.5" strokeWidth={1.75} aria-hidden /> : null}
      </button>
    </th>
  );
}

function LastScan({ label, quiet }: { label: string | null; quiet: boolean }) {
  if (quiet) {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-warning">
        <CircleAlert className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        {label ?? "Aucun"}
        <span className="sr-only">, il y a plus de 7 jours</span>
      </span>
    );
  }
  return <span className={cn("whitespace-nowrap", label ? "text-fg-2" : "text-fg-3")}>{label ?? "Aucun"}</span>;
}

function EmptyState({
  searching,
  query,
  onClear,
  onAdd,
  importHref,
}: {
  searching: boolean;
  query: string;
  onClear: () => void;
  onAdd: () => void;
  importHref: string;
}) {
  if (searching) {
    return (
      <div className="grid justify-items-start gap-3 px-5 py-8">
        <p className="text-[14px] text-fg-2">
          {query.trim() ? `Aucun QR code ni aucune chambre ne correspond à « ${query.trim()} ».` : "Aucun QR code dans ce statut."}
        </p>
        <Button variant="secondary" size="sm" onClick={onClear}>
          Tout afficher
        </Button>
      </div>
    );
  }
  return (
    <div className="grid justify-items-start gap-3 px-5 py-10">
      <p className="text-[15px] font-semibold text-fg">Aucun QR code enregistré</p>
      <p className="max-w-[56ch] text-[14px] leading-relaxed text-fg-2">
        Enregistrez les QR codes de l'hôtel un par un, importez-les d'un fichier CSV, ou posez-les chambre par chambre
        avec le mode installation.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onAdd}>
          <Plus strokeWidth={1.75} aria-hidden />
          Ajouter un QR code
        </Button>
        <Link href={importHref} className={buttonClasses({ variant: "ghost" })}>
          <Upload strokeWidth={1.75} aria-hidden />
          Importer un CSV
        </Link>
      </div>
    </div>
  );
}
