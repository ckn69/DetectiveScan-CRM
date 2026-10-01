"use client";

import { Button, buttonClasses, cn, Field, Input } from "@detectivescan/ui";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useCallback, useId, useMemo, useRef, useState } from "react";
import type { QrCode, QrState } from "@/lib/qr/types";
import { compareRooms, qrIdFromScan, qrUrl } from "@/lib/qr/url";
import { DemoBanner } from "../shell/demo-banner";
import { QrScanner } from "./qr-scanner";
import { equippedRooms, roomLabel } from "./qr-status";
import { useQrStore } from "./qr-store";

type Step =
  | { kind: "scan"; error: string | null }
  | { kind: "confirm"; id: string; url: string; known: QrCode | null }
  | { kind: "done"; id: string; room: string; replaced: string | null };

/** Champ de 48 px en 16 px : sur iPhone, un champ plus petit fait zoomer la page. */
const bigInput =
  "h-12 w-full rounded-sm border border-line-strong bg-surface px-3.5 text-[16px] text-fg placeholder:text-fg-3 " +
  "transition-[border-color,box-shadow] duration-150 ease-out hover:border-white/25 " +
  "focus:border-red focus:outline-none focus:ring-3 focus:ring-red/35 aria-invalid:border-red-text aria-invalid:focus:ring-red-text/30";

/**
 * Mode installation : sur place, téléphone en main. On scanne le QR qu'on vient de poser,
 * on indique la chambre, on enregistre, et on passe à la chambre suivante.
 */
export function Installation({
  base,
  template,
  rooms,
  totalRooms,
  hotelName,
  backHref,
}: {
  base: QrState;
  template: string;
  rooms: string[];
  totalRooms: number;
  hotelName: string;
  backHref: string;
}) {
  const store = useQrStore(base);
  const { qrs } = store.state;
  const [step, setStep] = useState<Step>({ kind: "scan", error: null });

  const equipped = useMemo(() => equippedRooms(qrs), [qrs]);
  const roomOptions = useMemo(
    () => [...new Set([...rooms, ...qrs.flatMap((qr) => (qr.room ? [qr.room] : []))])].sort(compareRooms),
    [rooms, qrs],
  );

  const resolve = useCallback(
    (raw: string) => {
      const id = qrIdFromScan(raw, qrs, template);
      if (!id) {
        setStep({
          kind: "scan",
          error: "Ce QR n'est pas un QR DetectiveScan : son adresse ne correspond à aucun QR de l'hôtel.",
        });
        return;
      }
      const known = qrs.find((qr) => qr.id.toLowerCase() === id.toLowerCase()) ?? null;
      const scannedUrl = /^https?:\/\//i.test(raw.trim()) ? raw.trim() : null;
      setStep({ kind: "confirm", id: known?.id ?? id, url: known?.url ?? scannedUrl ?? qrUrl(id, template), known });
    },
    [qrs, template],
  );

  function save(room: string, replaced: string | null) {
    if (step.kind !== "confirm") return;
    if (step.known) {
      store.update(step.known.id, { room, status: "active" }, "Mode installation");
    } else {
      store.add({ id: step.id, url: step.url, room, status: "active" }, "Mode installation");
    }
    if (replaced) store.update(replaced, { status: "inactive" }, `Remplacé par le QR ${step.id}.`);
    setStep({ kind: "done", id: step.id, room, replaced });
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-canvas pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-[520px] items-center gap-3 px-4">
          <Link
            href={backHref}
            aria-label="Quitter le mode installation"
            className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-md text-fg-2 transition-colors duration-150 hover:bg-white/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="size-5" strokeWidth={1.75} aria-hidden />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[17px] font-semibold leading-tight tracking-[-0.01em]">Mode installation</h1>
            <p className="truncate text-[12px] text-fg-3">
              {hotelName} · <span className="tabular-nums">{equipped}</span>{" "}
              {equipped > 1 ? "chambres équipées" : "chambre équipée"}
              {equipped <= totalRooms ? (
                <>
                  {" "}
                  sur <span className="tabular-nums">{totalRooms}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </header>
      <DemoBanner />

      <main id="contenu" className="mx-auto grid w-full max-w-[520px] gap-6 px-4 pb-[calc(32px+env(safe-area-inset-bottom))] pt-5">
        {step.kind === "scan" ? (
          <ScanStep error={step.error} onResult={resolve} />
        ) : step.kind === "confirm" ? (
          <ConfirmStep
            key={step.id}
            step={step}
            qrs={qrs}
            rooms={roomOptions}
            onSave={save}
            onCancel={() => setStep({ kind: "scan", error: null })}
          />
        ) : (
          <section role="status" aria-labelledby="done-title" className="grid justify-items-start gap-4 pt-2">
            <span className="flex size-12 items-center justify-center rounded-md bg-white/[0.06] text-success ring-1 ring-inset ring-line">
              <CircleCheck className="size-6" strokeWidth={1.75} aria-hidden />
            </span>
            <h2 id="done-title" className="text-[22px] font-semibold leading-snug tracking-[-0.015em]">
              {roomLabel(step.room)} équipée
            </h2>
            <p className="text-[14px] leading-relaxed text-fg-2">
              QR <span className="font-mono text-[13px]">{step.id}</span> posé
              {step.replaced ? (
                <>
                  {" ;"} l'ancien QR <span className="font-mono text-[13px]">{step.replaced}</span> est désactivé.
                </>
              ) : (
                "."
              )}
            </p>
            <div className="grid w-full gap-2 sm:flex sm:w-auto">
              <Button size="lg" autoFocus onClick={() => setStep({ kind: "scan", error: null })}>
                Scanner le QR suivant
              </Button>
              <Link href={backHref} className={buttonClasses({ variant: "ghost", size: "lg" })}>
                Voir tous les QR codes
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function ScanStep({ error, onResult }: { error: string | null; onResult: (text: string) => void }) {
  const fieldId = useId();
  const [manual, setManual] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (manual.trim()) onResult(manual);
  }

  return (
    <>
      <section aria-labelledby="scan-title" className="grid gap-4">
        <div className="grid gap-1.5">
          <h2 id="scan-title" className="text-[22px] font-semibold leading-snug tracking-[-0.015em]">
            Scannez le QR de la chambre
          </h2>
          <p className="text-[14px] leading-relaxed text-fg-2">
            Posez le QR, visez-le avec le téléphone, puis indiquez la chambre.
          </p>
        </div>
        <QrScanner onResult={onResult} />
        {error ? (
          <p role="alert" className="flex items-start gap-2 text-[13.5px] leading-snug text-red-text">
            <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
            {error}
          </p>
        ) : null}
      </section>

      <form onSubmit={submit} className="grid gap-2 border-t border-line pt-5">
        <Field id={fieldId} label="Ou saisissez l'identifiant imprimé" hint="Comme 01-254-07, ou l'adresse complète du QR.">
          <div className="flex gap-2">
            <input
              id={fieldId}
              value={manual}
              onChange={(event) => setManual(event.target.value)}
              aria-describedby={`${fieldId}-hint`}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              enterKeyHint="go"
              className={cn(bigInput, "font-mono")}
            />
            <Button type="submit" variant="secondary" size="lg" disabled={!manual.trim()}>
              Valider
            </Button>
          </div>
        </Field>
      </form>
    </>
  );
}

function ConfirmStep({
  step,
  qrs,
  rooms,
  onSave,
  onCancel,
}: {
  step: Extract<Step, { kind: "confirm" }>;
  qrs: QrCode[];
  rooms: string[];
  onSave: (room: string, replaced: string | null) => void;
  onCancel: () => void;
}) {
  const fieldId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [room, setRoom] = useState(step.known?.room ?? "");
  const [replace, setReplace] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const trimmed = room.trim();
  const occupant = trimmed
    ? qrs.find((qr) => qr.status === "active" && qr.id !== step.id && qr.room?.toLowerCase() === trimmed.toLowerCase())
    : undefined;

  const current = step.known
    ? step.known.status === "active"
      ? `Actuellement posé : ${roomLabel(step.known.room).toLowerCase().startsWith("chambre") ? roomLabel(step.known.room).toLowerCase() : roomLabel(step.known.room)}.`
      : step.known.status === "pending"
        ? "Enregistré, pas encore posé."
        : "Désactivé : il sera réactivé."
    : "Pas encore enregistré : il le sera avec cette pose.";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = !trimmed ? "Indiquez la chambre où le QR est posé." : trimmed.length > 20 ? "20 caractères au plus." : null;
    if (problem) {
      setError(problem);
      input.current?.focus();
      return;
    }
    onSave(trimmed, occupant && replace ? occupant.id : null);
  }

  return (
    <section aria-labelledby="confirm-title" className="grid gap-5">
      <div className="grid gap-1.5">
        <h2 id="confirm-title" className="text-[22px] font-semibold leading-snug tracking-[-0.015em]">
          QR <span className="font-mono text-[20px] font-medium">{step.id}</span>
        </h2>
        <p className="text-[14px] leading-relaxed text-fg-2">{current}</p>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-4">
        <Field id={fieldId} label="Chambre" hint="Le numéro ou le nom, comme 12 ou Suite 5." error={error ?? undefined}>
          <input
            ref={input}
            id={fieldId}
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
              setError(null);
            }}
            list={`${fieldId}-rooms`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : `${fieldId}-hint`}
            autoComplete="off"
            enterKeyHint="done"
            autoFocus
            className={cn(bigInput, "[&::-webkit-calendar-picker-indicator]:opacity-40")}
          />
        </Field>
        <datalist id={`${fieldId}-rooms`}>
          {rooms.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        {occupant ? (
          <div className="grid gap-3 rounded-md border border-line-strong bg-surface px-4 py-3">
            <p className="flex items-start gap-2 text-[13.5px] leading-snug text-fg-2">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden />
              <span>
                {roomLabel(occupant.room)} a déjà le QR <span className="font-mono text-[12.5px]">{occupant.id}</span>.
              </span>
            </p>
            <label className="flex items-center gap-2.5 text-[13.5px] text-fg">
              <input
                type="checkbox"
                checked={replace}
                onChange={(event) => setReplace(event.target.checked)}
                className="size-4 accent-red"
              />
              Désactiver l'ancien QR (il est remplacé)
            </label>
          </div>
        ) : null}

        <div className="grid gap-2 sm:flex">
          <Button type="submit" size="lg">
            Enregistrer la pose
          </Button>
          <Button variant="ghost" size="lg" onClick={onCancel}>
            Scanner un autre QR
          </Button>
        </div>
      </form>
    </section>
  );
}
