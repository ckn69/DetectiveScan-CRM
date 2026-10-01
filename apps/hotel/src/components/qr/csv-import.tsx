"use client";

import { Badge, type BadgeTone, Button, buttonClasses, Card, cn } from "@detectivescan/ui";
import { ArrowLeft, CircleAlert, CircleCheck, Download, Upload } from "lucide-react";
import Link from "next/link";
import { type ChangeEvent, type DragEvent, useId, useMemo, useState } from "react";
import { type ImportAction, type ImportPlan, type ImportRow, planImport } from "@/lib/qr/csv";
import type { QrState } from "@/lib/qr/types";
import { useQrStore } from "./qr-store";
import { roomLabel } from "./qr-status";

const MAX_BYTES = 1_000_000;

const ACTION: Record<ImportAction, { label: (count: number) => string; tone: BadgeTone }> = {
  add: { label: (n) => `${n} à ajouter`, tone: "success" },
  update: { label: (n) => `${n} à mettre à jour`, tone: "neutral" },
  same: { label: (n) => `${n} déjà à jour`, tone: "neutral" },
  error: { label: (n) => `${n} en erreur`, tone: "red" },
};

/** Lit le fichier en UTF-8, ou en Windows-1252 s'il vient d'un Excel qui n'enregistre pas en UTF-8. */
async function readText(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
}

/** Import CSV en trois temps : choisir le fichier, vérifier chaque ligne, confirmer. */
export function CsvImport({
  base,
  template,
  backHref,
  templateHref,
}: {
  base: QrState;
  template: string;
  backHref: string;
  templateHref: string;
}) {
  const store = useQrStore(base);
  const inputId = useId();
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState<number | null>(null);

  const plan: ImportPlan | null = useMemo(
    () => (file ? planImport(file.text, store.state.qrs, template) : null),
    [file, store.state.qrs, template],
  );
  const ready = plan ? plan.counts.add + plan.counts.update : 0;

  async function accept(next: File | undefined) {
    setProblem(null);
    setImported(null);
    if (!next) return;
    if (next.size > MAX_BYTES) {
      setProblem("Fichier trop lourd : 1 Mo au plus.");
      return;
    }
    if (!/\.(csv|txt)$/i.test(next.name) && !/^text\//.test(next.type)) {
      setProblem("Ce fichier n'est pas un CSV. Enregistrez votre tableau au format CSV, puis réessayez.");
      return;
    }
    setFile({ name: next.name, text: await readText(next) });
  }

  function confirm() {
    if (!plan) return;
    const count = store.importRows(plan.rows);
    setImported(count);
    setFile(null);
  }

  return (
    <div className="grid max-w-[880px] gap-6 py-4 md:py-6">
      <div className="grid gap-3">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-2 rounded-sm text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
          QR codes & chambres
        </Link>
        <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.015em] text-fg">Importer des QR codes</h2>
        <p className="max-w-[62ch] text-[14px] leading-relaxed text-fg-2">
          Un fichier CSV, une ligne par QR code. Chaque ligne est vérifiée et rien n'est enregistré avant votre
          confirmation.
        </p>
      </div>

      {imported !== null ? (
        <Card as="div" role="status" className="grid justify-items-start gap-3 p-5">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold text-fg">
            <CircleCheck className="size-5 text-success" strokeWidth={1.75} aria-hidden />
            {imported === 1 ? "1 QR code importé." : `${imported} QR codes importés.`}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={backHref} className={buttonClasses({ variant: "secondary" })}>
              Voir les QR codes
            </Link>
            <Button variant="ghost" onClick={() => setImported(null)}>
              Importer un autre fichier
            </Button>
          </div>
        </Card>
      ) : null}

      {!file && imported === null ? (
        <>
          <label
            htmlFor={inputId}
            onDragOver={(event: DragEvent) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event: DragEvent) => {
              event.preventDefault();
              setDragging(false);
              void accept(event.dataTransfer.files[0]);
            }}
            className={cn(
              "grid cursor-pointer justify-items-center gap-3 rounded-md border border-dashed px-6 py-10 text-center transition-colors duration-150",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-white",
              dragging ? "border-fg-2 bg-white/[0.05]" : "border-line-strong bg-surface hover:border-white/25",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-md bg-white/[0.06] text-fg-2 ring-1 ring-inset ring-line">
              <Upload className="size-6" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="text-[15px] font-semibold text-fg">Déposez le fichier ici, ou choisissez-le</span>
            <span className="text-[13px] text-fg-3">CSV ou texte, 1 Mo au plus.</span>
            <input
              id={inputId}
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              onChange={(event: ChangeEvent<HTMLInputElement>) => void accept(event.target.files?.[0])}
              className="sr-only"
            />
          </label>

          {problem ? (
            <p role="alert" className="flex items-start gap-2 text-[13.5px] leading-snug text-red-text">
              <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {problem}
            </p>
          ) : null}

          <Card as="section" aria-labelledby={`${inputId}-format`} className="grid gap-4 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 id={`${inputId}-format`} className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
                Format du fichier
              </h3>
              <a href={templateHref} download className={buttonClasses({ variant: "ghost", size: "sm", className: "-mr-2" })}>
                <Download strokeWidth={1.75} aria-hidden />
                Télécharger le modèle
              </a>
            </div>
            <p className="text-[13.5px] leading-relaxed text-fg-2">
              La première ligne nomme les colonnes. Séparateur point-virgule (Excel) ou virgule.
            </p>
            <dl className="grid gap-3 text-[13.5px] sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6">
              {[
                ["qr", "Obligatoire. L'identifiant imprimé, comme 01-254-07."],
                ["chambre", "La chambre où le QR est posé. Vide s'il n'est pas encore posé."],
                ["url", "L'adresse encodée dans le QR. Vide : elle est déduite de l'identifiant."],
                ["statut", "posé, à poser ou désactivé. Vide : posé s'il y a une chambre, sinon à poser."],
              ].map(([name, text]) => (
                <div key={name} className="contents">
                  <dt className="font-mono text-[12.5px] text-fg">{name}</dt>
                  <dd className="-mt-2 text-fg-2 sm:mt-0">{text}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[13px] leading-relaxed text-fg-3">
              Un QR déjà enregistré est mis à jour (chambre, adresse, statut) ; les autres sont ajoutés.
            </p>
          </Card>
        </>
      ) : null}

      {file && plan ? (
        <section aria-labelledby={`${inputId}-check`} className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id={`${inputId}-check`} className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
              Vérification de <span className="font-mono text-[14px] font-medium">{file.name}</span>
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="-mr-2">
              Changer de fichier
            </Button>
          </div>

          {plan.fatal ? (
            <p role="alert" className="flex items-start gap-2 text-[13.5px] leading-snug text-red-text">
              <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {plan.fatal}
            </p>
          ) : (
            <>
              <ul aria-label="Résumé" className="flex flex-wrap gap-2">
                {(Object.keys(ACTION) as ImportAction[])
                  .filter((action) => plan.counts[action] > 0)
                  .map((action) => (
                    <li key={action}>
                      <Badge tone={ACTION[action].tone}>{ACTION[action].label(plan.counts[action])}</Badge>
                    </li>
                  ))}
              </ul>

              <Card as="div" className="md:max-h-[32rem] md:overflow-auto">
                <ul className="md:hidden">
                  {plan.rows.map((row, index) => (
                    <li key={row.line} className={cn("flex gap-3 px-4 py-3", index > 0 && "border-t border-line")}>
                      <span className="w-7 shrink-0 pt-px text-right text-[12.5px] tabular-nums text-fg-3">
                        <span className="sr-only">Ligne </span>
                        {row.line}
                      </span>
                      <span className="grid min-w-0 flex-1 gap-0.5">
                        <span className="flex flex-wrap items-baseline gap-x-2.5">
                          <span className="whitespace-nowrap font-mono text-[12.5px] text-fg-2">{row.id || "—"}</span>
                          <span className="text-[13.5px] text-fg">{rowRoom(row)}</span>
                        </span>
                        <RowResult row={row} />
                      </span>
                    </li>
                  ))}
                </ul>
                <table className="hidden w-full text-[13.5px] md:table">
                  <thead className="sticky top-0 bg-surface text-[12px] text-fg-3">
                    <tr>
                      <th scope="col" className="py-3 pl-5 pr-3 text-right font-medium">
                        Ligne
                      </th>
                      <th scope="col" className="px-3 py-3 text-left font-medium">
                        QR code
                      </th>
                      <th scope="col" className="px-3 py-3 text-left font-medium">
                        Chambre
                      </th>
                      <th scope="col" className="py-3 pl-3 pr-5 text-left font-medium">
                        Résultat
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.rows.map((row) => (
                      <tr key={row.line} className="border-t border-line">
                        <td className="py-2.5 pl-5 pr-3 text-right align-baseline tabular-nums text-fg-3">{row.line}</td>
                        <td className="whitespace-nowrap px-3 py-2.5 align-baseline font-mono text-[12.5px] text-fg-2">
                          {row.id || "—"}
                        </td>
                        <td className="px-3 py-2.5 align-baseline text-fg">{rowRoom(row)}</td>
                        <td className="py-2.5 pl-3 pr-5 align-baseline">
                          <RowResult row={row} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={confirm} variant="secondary" disabled={ready === 0}>
                  {ready === 0 ? "Rien à importer" : ready === 1 ? "Importer 1 QR code" : `Importer ${ready} QR codes`}
                </Button>
                <Button variant="ghost" onClick={() => setFile(null)}>
                  Annuler
                </Button>
                {plan.counts.error > 0 ? (
                  <p className="text-[13px] text-fg-3">Les lignes en erreur ne sont pas importées.</p>
                ) : null}
              </div>
            </>
          )}
        </section>
      ) : null}
    </div>
  );
}

const rowRoom = (row: ImportRow) => (row.action === "error" && !row.room ? "—" : roomLabel(row.room));

/** Ce que l'import fera de la ligne, ou pourquoi il l'écarte. */
function RowResult({ row }: { row: ImportRow }) {
  if (row.action === "error") {
    return (
      <span className="inline-flex items-start gap-1.5 text-[13.5px] text-red-text">
        <CircleAlert className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        {row.message}
      </span>
    );
  }
  if (row.action === "add") return <span className="text-[13.5px] text-fg">À ajouter</span>;
  return (
    <span className="text-[13.5px] text-fg-2">{row.action === "update" ? `Mise à jour : ${row.message}` : row.message}</span>
  );
}
