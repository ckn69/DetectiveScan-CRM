import { formatInteger } from "../format";
import { qrIdSchema, qrUrlSchema, roomSchema } from "./schema";
import type { QrCode, QrStatus } from "./types";
import { qrUrl } from "./url";

/*
 * Import CSV des QR codes. Accepte les exports d'Excel (point-virgule, BOM), de Google
 * Sheets (virgule) ou un copier-coller (tabulation). Une ligne d'en-tête nomme les colonnes :
 * qr (obligatoire), chambre, url, statut. Chaque ligne est vérifiée avant tout import.
 */

export const MAX_IMPORT_ROWS = 2000;

export const CSV_TEMPLATE =
  "qr;chambre;url;statut\n01-254-50;101;https://detectivescan.com/?qr=01-254-50;posé\n01-254-51;102;;à poser\n";

type CsvLine = { line: number; cells: string[] };

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const COLUMNS: { [key in "id" | "room" | "url" | "status"]: string[] } = {
  id: ["qr", "qrcode", "codeqr", "identifiant", "identifiantqr", "id", "code", "numeroqr", "numeroduqr", "nqr", "noqr"],
  room: ["chambre", "room", "numerodechambre", "numerochambre", "nchambre", "nochambre", "numero", "no"],
  url: ["url", "adresse", "adresseurl", "lien", "link"],
  status: ["statut", "status", "etat"],
};

const STATUS_WORDS: { [word: string]: QrStatus } = {
  actif: "active",
  active: "active",
  pose: "active",
  installe: "active",
  aposer: "pending",
  enattente: "pending",
  attente: "pending",
  pending: "pending",
  desactive: "inactive",
  desactivee: "inactive",
  inactif: "inactive",
  inactive: "inactive",
};

export const STATUS_LABEL: { [status in QrStatus]: string } = {
  active: "posé",
  pending: "à poser",
  inactive: "désactivé",
};

/** Découpe un texte CSV en lignes et cellules (guillemets, retours à la ligne et `""` gérés). */
function parseCsv(text: string): CsvLine[] {
  const source = text.replace(/^﻿/, "");
  const firstLine = source.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = [";", ",", "\t"].reduce((best, candidate) =>
    firstLine.split(candidate).length > firstLine.split(best).length ? candidate : best,
  );

  const records: CsvLine[] = [];
  let cells: string[] = [];
  let field = "";
  let quoted = false;
  let line = 1;
  let recordLine = 1;

  const endRecord = () => {
    cells.push(field);
    if (cells.some((cell) => cell.trim() !== "")) records.push({ line: recordLine, cells });
    cells = [];
    field = "";
  };

  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"';
        index++;
      } else if (char === '"') {
        quoted = false;
      } else {
        if (char === "\n") line++;
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      cells.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && source[index + 1] === "\n") index++;
      endRecord();
      line++;
      recordLine = line;
    } else {
      field += char;
    }
  }
  endRecord();
  return records;
}

export type ImportAction = "add" | "update" | "same" | "error";

export type ImportRow = {
  line: number;
  id: string;
  room: string | null;
  url: string;
  status: QrStatus;
  action: ImportAction;
  /** Erreur, ou détail des changements d'une mise à jour. */
  message: string | null;
};

export type ImportPlan = {
  rows: ImportRow[];
  /** Erreur qui empêche de lire le fichier entier. */
  fatal: string | null;
  counts: { [action in ImportAction]: number };
};

const emptyCounts = () => ({ add: 0, update: 0, same: 0, error: 0 });

/** Lit le CSV et dit, ligne par ligne, ce que l'import fera, sans rien modifier. */
export function planImport(text: string, existing: QrCode[], template: string): ImportPlan {
  const records = parseCsv(text);
  const [header, ...rows] = records;
  if (!header) return { rows: [], fatal: "Le fichier est vide.", counts: emptyCounts() };

  const names = header.cells.map(normalize);
  const column = (key: keyof typeof COLUMNS) => names.findIndex((name) => COLUMNS[key].includes(name));
  const index = { id: column("id"), room: column("room"), url: column("url"), status: column("status") };

  if (index.id < 0) {
    return {
      rows: [],
      fatal: "Colonne des QR codes introuvable : la première ligne doit nommer les colonnes, dont « qr ».",
      counts: emptyCounts(),
    };
  }
  if (rows.length === 0) return { rows: [], fatal: "Aucune ligne sous l'en-tête.", counts: emptyCounts() };
  if (rows.length > MAX_IMPORT_ROWS) {
    return { rows: [], fatal: `Fichier trop long : ${formatInteger(MAX_IMPORT_ROWS)} lignes au plus.`, counts: emptyCounts() };
  }

  const byId = new Map(existing.map((qr) => [qr.id.toLowerCase(), qr]));
  const byUrl = new Map(existing.map((qr) => [qr.url.toLowerCase(), qr]));
  const seenIds = new Map<string, number>();
  const seenUrls = new Map<string, number>();
  const counts = emptyCounts();

  const planned = rows.map(({ line, cells }): ImportRow => {
    const cell = (at: number) => (at >= 0 ? (cells[at] ?? "").trim() : "");
    const rawId = cell(index.id);
    const fail = (message: string, partial: Partial<ImportRow> = {}): ImportRow => {
      counts.error++;
      return { line, id: rawId, room: null, url: "", status: "pending", action: "error", message, ...partial };
    };

    const id = qrIdSchema.safeParse(rawId);
    if (!id.success) return fail(rawId ? (id.error.issues[0]?.message ?? "Identifiant invalide.") : "Identifiant manquant.");
    const key = id.data.toLowerCase();
    const twin = seenIds.get(key);
    if (twin) return fail(`En double : déjà ligne ${twin}.`);
    seenIds.set(key, line);

    const room = roomSchema.safeParse(cell(index.room));
    if (!room.success) return fail(`Chambre : ${room.error.issues[0]?.message ?? "invalide."}`);

    const url = qrUrlSchema.safeParse(cell(index.url) || qrUrl(id.data, template));
    if (!url.success) return fail(url.error.issues[0]?.message ?? "Adresse invalide.", { room: room.data });
    const urlKey = url.data.toLowerCase();
    const urlTwin = seenUrls.get(urlKey);
    if (urlTwin) return fail(`Adresse en double : déjà ligne ${urlTwin}.`, { room: room.data });
    seenUrls.set(urlKey, line);
    const urlOwner = byUrl.get(urlKey);
    if (urlOwner && urlOwner.id.toLowerCase() !== key) {
      return fail(`Adresse déjà utilisée par le QR ${urlOwner.id}.`, { room: room.data });
    }

    const statusWord = cell(index.status);
    const status = statusWord ? STATUS_WORDS[normalize(statusWord)] : room.data ? "active" : "pending";
    if (!status) {
      return fail(`Statut inconnu « ${statusWord} » : posé, à poser ou désactivé.`, { room: room.data, url: url.data });
    }
    if (status === "active" && !room.data) return fail("Un QR posé doit avoir une chambre.", { url: url.data });

    const row = { line, id: id.data, room: room.data, url: url.data, status };
    const current = byId.get(key);
    if (!current) {
      counts.add++;
      return { ...row, action: "add", message: null };
    }

    const changes = [
      current.room !== row.room ? `chambre ${current.room ?? "aucune"} → ${row.room ?? "aucune"}` : null,
      current.url !== row.url ? "nouvelle adresse" : null,
      current.status !== row.status ? `${STATUS_LABEL[current.status]} → ${STATUS_LABEL[row.status]}` : null,
    ].filter((change): change is string => change !== null);

    if (changes.length === 0) {
      counts.same++;
      return { ...row, id: current.id, action: "same", message: "Déjà à jour." };
    }
    counts.update++;
    return { ...row, id: current.id, action: "update", message: changes.join(" · ") };
  });

  return { rows: planned, fatal: null, counts };
}
