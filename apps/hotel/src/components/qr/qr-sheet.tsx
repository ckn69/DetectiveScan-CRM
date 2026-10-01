"use client";

import { Button, cn, Field, Input, Sheet } from "@detectivescan/ui";
import { Check, CircleAlert, Copy, ExternalLink, X } from "lucide-react";
import { type FormEvent, type Ref, useEffect, useId, useRef, useState } from "react";
import { formatDateTime, formatInteger, formatPercent } from "@/lib/format";
import { checkQr, formatErrors, type QrInput, qrInputSchema } from "@/lib/qr/schema";
import type { QrActivity, QrCode, QrEvent, QrEventKind, QrStatus } from "@/lib/qr/types";
import { qrUrl } from "@/lib/qr/url";
import { Notice } from "../notice";
import { QR_STATUS_LABEL, QrStatusLabel, roomLabel } from "./qr-status";

export type SheetState = { mode: "create" } | { mode: "view" | "edit"; id: string } | null;

const EVENT_VERB: Record<QrEventKind, string> = {
  created: "Enregistré",
  imported: "Importé",
  installed: "Posé",
  assigned: "Déplacé",
  unassigned: "Retiré de sa chambre",
  url_changed: "Adresse modifiée",
  deactivated: "Désactivé",
  reactivated: "Réactivé",
};

const eventTitle = (event: QrEvent) =>
  event.room && event.kind !== "unassigned" && event.kind !== "url_changed"
    ? `${EVENT_VERB[event.kind]} · ${roomLabel(event.room)}`
    : EVENT_VERB[event.kind];

export function QrSheet({
  state,
  qrs,
  events,
  activity,
  template,
  rooms,
  onClose,
  onMode,
  onCreate,
  onUpdate,
  onRemove,
  notice,
}: {
  state: SheetState;
  qrs: QrCode[];
  events: QrEvent[];
  activity: Record<string, QrActivity>;
  template: string;
  rooms: string[];
  onClose: () => void;
  onMode: (state: SheetState) => void;
  onCreate: (input: QrInput) => void;
  onUpdate: (id: string, input: Omit<QrInput, "id">) => void;
  onRemove: (id: string) => void;
  /** Confirmation de la dernière action, affichée et annoncée dans le panneau. */
  notice: string | null;
}) {
  const titleId = useId();
  const qr = state && state.mode !== "create" ? qrs.find((item) => item.id === state.id) : undefined;
  const open = state !== null && (state.mode === "create" || qr !== undefined);

  return (
    <Sheet open={open} onClose={onClose} labelledBy={titleId}>
      {state?.mode === "create" ? (
        <QrForm
          key="create"
          titleId={titleId}
          qrs={qrs}
          template={template}
          rooms={rooms}
          onCancel={onClose}
          onSubmit={(input) => onCreate(input)}
        />
      ) : qr && state?.mode === "edit" ? (
        <QrForm
          key={`edit-${qr.id}`}
          titleId={titleId}
          initial={qr}
          qrs={qrs}
          template={template}
          rooms={rooms}
          onCancel={() => onMode({ mode: "view", id: qr.id })}
          onSubmit={({ id, ...input }) => onUpdate(id, input)}
        />
      ) : qr ? (
        <QrDetail
          key={`view-${qr.id}`}
          titleId={titleId}
          qr={qr}
          history={events.filter((event) => event.qr === qr.id).reverse()}
          activity={activity[qr.id]}
          onClose={onClose}
          onEdit={() => onMode({ mode: "edit", id: qr.id })}
          onStatus={(status) => onUpdate(qr.id, { url: qr.url, room: qr.room, status })}
          onRemove={() => onRemove(qr.id)}
        />
      ) : null}
      <Notice message={notice} placement="sheet" />
    </Sheet>
  );
}

function SheetHeader({
  titleId,
  titleRef,
  title,
  large = false,
  children,
  onClose,
}: {
  titleId: string;
  titleRef?: Ref<HTMLHeadingElement>;
  title: React.ReactNode;
  /** Titre d'une fiche (la chambre) plutôt que d'un formulaire. */
  large?: boolean;
  children?: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-[calc(16px+env(safe-area-inset-top))]">
      <div className="min-w-0">
        <h2
          ref={titleRef}
          id={titleId}
          tabIndex={-1}
          className={cn(
            "font-semibold text-fg outline-none",
            large ? "text-[20px] leading-tight tracking-[-0.01em]" : "text-[15px] leading-snug tracking-[-0.01em]",
          )}
        >
          {title}
        </h2>
        {children}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="-mr-2 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-sm text-fg-2 transition-colors duration-150 hover:bg-white/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X className="size-[18px]" strokeWidth={1.75} aria-hidden />
      </button>
    </header>
  );
}

function SheetFooter({ children }: { children: React.ReactNode }) {
  return (
    <footer className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
      {children}
    </footer>
  );
}

function QrDetail({
  titleId,
  qr,
  history,
  activity,
  onClose,
  onEdit,
  onStatus,
  onRemove,
}: {
  titleId: string;
  qr: QrCode;
  history: QrEvent[];
  activity: QrActivity | undefined;
  onClose: () => void;
  onEdit: () => void;
  onStatus: (status: QrStatus) => void;
  onRemove: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Retour du formulaire au détail : le focus, parti avec le formulaire, revient au titre.
  useEffect(() => {
    const active = document.activeElement;
    if (!active || active === document.body || active.tagName === "DIALOG") titleRef.current?.focus();
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(qr.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <SheetHeader
        titleId={titleId}
        titleRef={titleRef}
        onClose={onClose}
        large
        title={
          qr.room ? (
            roomLabel(qr.room)
          ) : (
            <>
              QR <span className="font-mono font-medium">{qr.id}</span>
            </>
          )
        }
      >
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
          {qr.room ? (
            <span className="text-fg-2">
              QR <span className="font-mono text-[12.5px]">{qr.id}</span>
            </span>
          ) : (
            <span className="text-fg-3">Sans chambre</span>
          )}
          <QrStatusLabel status={qr.status} />
        </div>
      </SheetHeader>

      <div className="grid flex-1 content-start gap-6 overflow-y-auto px-5 py-5">
        <section aria-label="Adresse du QR">
          <p className="text-[12.5px] text-fg-3">Adresse encodée dans le QR</p>
          <p className="mt-1.5 break-all font-mono text-[12.5px] leading-relaxed text-fg-2">{qr.url}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={copy}>
              {copied ? <Check strokeWidth={1.75} aria-hidden /> : <Copy strokeWidth={1.75} aria-hidden />}
              {copied ? "Adresse copiée" : "Copier l'adresse"}
            </Button>
            <a
              href={qr.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-2 rounded-sm px-3 text-[13px] font-semibold text-fg-2 transition-colors duration-150 hover:bg-white/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ExternalLink className="size-4" strokeWidth={1.75} aria-hidden />
              Ouvrir
            </a>
          </div>
        </section>

        <section aria-labelledby={`${titleId}-activity`} className="border-t border-line pt-5">
          <h3 id={`${titleId}-activity`} className="text-[13px] font-medium text-fg-2">
            30 derniers jours
          </h3>
          <dl className="mt-3 grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.7fr)] gap-3">
            {[
              { label: "Scans", value: activity ? formatInteger(activity.scans) : "0" },
              {
                label: "Participation",
                value: activity?.participation != null ? formatPercent(activity.participation) : "—",
              },
              { label: "Dernier scan", value: activity?.lastScan?.label ?? "Aucun" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dt className="text-[12.5px] text-fg-3">{stat.label}</dt>
                <dd className="mt-0.5 text-[14px] font-medium tabular-nums text-fg">{stat.value}</dd>
              </div>
            ))}
          </dl>
          {activity?.quiet && qr.status === "active" ? (
            <p className="mt-3 flex items-start gap-2 text-[13px] leading-snug text-fg-2">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden />
              Aucun scan ces 7 derniers jours : vérifiez que le QR est toujours en place et lisible.
            </p>
          ) : null}
        </section>

        <section aria-labelledby={`${titleId}-history`} className="border-t border-line pt-5">
          <h3 id={`${titleId}-history`} className="text-[13px] font-medium text-fg-2">
            Historique
          </h3>
          {history.length === 0 ? (
            <p className="mt-2 text-[13px] text-fg-3">Aucun événement.</p>
          ) : (
            <ol className="mt-3 grid gap-3.5">
              {history.map((event) => (
                <li key={event.id} className="grid gap-0.5">
                  <p className="text-[13.5px] text-fg">{eventTitle(event)}</p>
                  <p className="text-[12px] tabular-nums text-fg-3">
                    {formatDateTime(event.at)} · {event.by}
                  </p>
                  {event.note ? <p className="text-[12.5px] text-fg-2">{event.note}</p> : null}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <SheetFooter>
        {confirmDelete ? (
          <div className="grid w-full gap-3">
            <p className="text-[13.5px] leading-snug text-fg">
              Supprimer le QR {qr.id} ? Son historique est effacé ; les scans passés restent dans les statistiques.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="danger" onClick={onRemove}>
                Supprimer
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button variant="secondary" onClick={onEdit}>
              Modifier
            </Button>
            {qr.status === "inactive" ? (
              <Button variant="ghost" onClick={() => onStatus(qr.room ? "active" : "pending")}>
                Réactiver
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => onStatus("inactive")}>
                Désactiver
              </Button>
            )}
            <Button variant="danger" className="ml-auto" onClick={() => setConfirmDelete(true)}>
              Supprimer
            </Button>
          </>
        )}
      </SheetFooter>
    </>
  );
}

const STATUS_OPTIONS: QrStatus[] = ["active", "pending", "inactive"];

function QrForm({
  titleId,
  initial,
  qrs,
  template,
  rooms,
  onCancel,
  onSubmit,
}: {
  titleId: string;
  initial?: QrCode;
  qrs: QrCode[];
  template: string;
  rooms: string[];
  onCancel: () => void;
  onSubmit: (input: QrInput) => void;
}) {
  const formId = useId();
  const editing = initial !== undefined;
  const [id, setId] = useState(initial?.id ?? "");
  const [room, setRoom] = useState(initial?.room ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [urlTouched, setUrlTouched] = useState(editing);
  const [status, setStatus] = useState<QrStatus | null>(initial?.status ?? null);
  const [errors, setErrors] = useState<Partial<Record<keyof QrInput, string>>>({});

  // Tant que l'adresse n'a pas été saisie à la main, elle suit l'identifiant ; le statut suit la chambre.
  const shownUrl = urlTouched ? url : id.trim() ? qrUrl(id.trim(), template) : "";
  const shownStatus: QrStatus = status ?? (room.trim() ? "active" : "pending");
  const input = { id: id.trim(), url: shownUrl.trim(), room: room.trim() || null, status: shownStatus };
  const { warning } = checkQr(input, qrs, initial?.id);

  const ids = { id: `${formId}-id`, room: `${formId}-room`, url: `${formId}-url`, rooms: `${formId}-rooms` };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = qrInputSchema.safeParse({ id: input.id, url: input.url, room: room, status: shownStatus });
    const found = { ...checkQr(input, qrs, initial?.id).errors, ...(parsed.success ? {} : formatErrors(parsed)) };
    const first = (["id", "room", "url"] as const).find((field) => found[field]);
    if (!parsed.success || first) {
      setErrors(found);
      if (first) document.getElementById(ids[first])?.focus();
      return;
    }
    onSubmit(parsed.data);
  }

  return (
    <>
      <SheetHeader
        titleId={titleId}
        onClose={onCancel}
        title={
          editing ? (
            <>
              Modifier le QR <span className="font-mono text-[14px] font-medium">{initial.id}</span>
            </>
          ) : (
            "Ajouter un QR code"
          )
        }
      />

      <form id={formId} noValidate onSubmit={submit} className="grid flex-1 content-start gap-5 overflow-y-auto px-5 py-5">
        {editing ? null : (
          <Field id={ids.id} label="Identifiant imprimé" hint="Lettres, chiffres et tirets, comme 01-254-07." error={errors.id}>
            <Input
              id={ids.id}
              value={id}
              onChange={(event) => setId(event.target.value)}
              invalid={Boolean(errors.id)}
              aria-describedby={errors.id ? `${ids.id}-error` : `${ids.id}-hint`}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              autoFocus
              data-autofocus
              className="font-mono"
            />
          </Field>
        )}

        <Field id={ids.room} label="Chambre" hint="Laissez vide si le QR n'est pas encore posé." error={errors.room}>
          <Input
            id={ids.room}
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            list={ids.rooms}
            placeholder="12 ou Suite 5"
            invalid={Boolean(errors.room)}
            aria-describedby={errors.room ? `${ids.room}-error` : `${ids.room}-hint`}
            autoComplete="off"
            autoFocus={editing}
            data-autofocus={editing || undefined}
            className="[&::-webkit-calendar-picker-indicator]:opacity-40"
          />
        </Field>
        <datalist id={ids.rooms}>
          {rooms.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <Field
          id={ids.url}
          label="Adresse encodée dans le QR"
          hint="Propre à ce QR : c'est elle qui dit quelle chambre joue."
          error={errors.url}
        >
          <Input
            id={ids.url}
            type="url"
            inputMode="url"
            value={shownUrl}
            onChange={(event) => {
              setUrlTouched(true);
              setUrl(event.target.value);
            }}
            invalid={Boolean(errors.url)}
            aria-describedby={errors.url ? `${ids.url}-error` : `${ids.url}-hint`}
            autoComplete="off"
            spellCheck={false}
            className="font-mono"
          />
        </Field>

        <fieldset className="grid gap-2">
          <legend className="mb-2 text-[13px] font-medium text-fg-2">Statut</legend>
          <div className="flex w-max gap-0.5 rounded-md border border-line bg-surface p-1">
            {STATUS_OPTIONS.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex h-8 cursor-pointer items-center rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
                  "has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-white",
                  shownStatus === option ? "bg-white/[0.09] text-fg" : "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
                )}
              >
                <input
                  type="radio"
                  name={`${formId}-status`}
                  value={option}
                  checked={shownStatus === option}
                  onChange={() => setStatus(option)}
                  className="sr-only"
                />
                {QR_STATUS_LABEL[option]}
              </label>
            ))}
          </div>
        </fieldset>

        {warning ? (
          <p className="flex items-start gap-2 text-[13px] leading-snug text-fg-2">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={1.75} aria-hidden />
            {warning}
          </p>
        ) : null}
      </form>

      <SheetFooter>
        <Button type="submit" form={formId}>
          {editing ? "Enregistrer" : "Ajouter le QR code"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
      </SheetFooter>
    </>
  );
}
