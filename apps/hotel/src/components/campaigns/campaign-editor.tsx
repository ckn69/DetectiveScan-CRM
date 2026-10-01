"use client";

import { Button, buttonClasses, cn, Spinner } from "@detectivescan/ui";
import { CircleAlert, Eye, ImagePlus, Info, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import {
  campaignStatus,
  DAY_NAMES,
  inputFromMinutes,
  minutesFromInput,
  nextShowingLabel,
  overlaps,
  WEEK,
} from "@/lib/campaigns/schedule";
import { type CampaignField, campaignErrors, campaignInputSchema, MESSAGE_MAX, TITLE_MAX } from "@/lib/campaigns/schema";
import type { Campaign, Weekday } from "@/lib/campaigns/types";
import { dayFromIso, isoFromDay, type LocalNow } from "@/lib/dates";
import { formatDay } from "@/lib/format";
import { DemoBanner } from "../shell/demo-banner";
import { useCampaignStore, useHydrated } from "./campaign-store";
import { PreviewStage } from "./full-screen-preview";
import { describeScreen, LoadingScreen, PhoneFrame } from "./loading-screen";

type Draft = {
  title: string;
  message: string;
  image: string | null;
  start: string;
  end: string;
  noEnd: boolean;
  days: Weekday[];
  allDay: boolean;
  from: string;
  to: string;
};

const fieldClasses =
  "w-full rounded-sm border border-line-strong bg-surface px-3.5 text-[15px] text-fg placeholder:text-fg-3 " +
  "transition-[border-color,box-shadow] duration-150 ease-out hover:border-white/25 " +
  "focus:border-red focus:outline-none focus:ring-3 focus:ring-red/35 aria-invalid:border-red-text aria-invalid:focus:ring-red-text/30";

const pickerClasses =
  "h-10 rounded-sm border border-line-strong bg-surface px-3 text-[14px] tabular-nums text-fg " +
  "transition-[border-color,box-shadow] duration-150 ease-out hover:border-white/25 " +
  "focus:border-red focus:outline-none focus:ring-3 focus:ring-red/35 aria-invalid:border-red-text aria-invalid:focus:ring-red-text/30";

function draftOf(source: Campaign | undefined, today: string, copy: boolean): Draft {
  if (!source) {
    return {
      title: "",
      message: "",
      image: null,
      start: today,
      end: "",
      noEnd: true,
      days: [...WEEK],
      allDay: true,
      from: "18:00",
      to: "21:00",
    };
  }
  // Une copie repart d'aujourd'hui ; une date de fin déjà passée ne la suit pas.
  const start = copy && source.start < today ? today : source.start;
  const end = source.end && (!copy || source.end >= today) ? source.end : "";
  return {
    title: source.title,
    message: source.message,
    image: source.image,
    start,
    end,
    noEnd: !end,
    days: [...source.days],
    allDay: source.hours === null,
    from: source.hours ? inputFromMinutes(source.hours.from) : "18:00",
    to: source.hours ? inputFromMinutes(source.hours.to) : "21:00",
  };
}

/** Réduit l'image (1 080 × 1 350 au plus) et la garde en JPEG : assez net pour un téléphone, assez léger pour la démo. */
async function prepareImage(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Format non pris en charge : JPG, PNG ou WebP.");
  if (file.size > 15_000_000) throw new Error("Image trop lourde : 15 Mo au plus.");
  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Image illisible. Essayez un autre fichier."));
      element.src = url;
    });
    const scale = Math.min(1, 1080 / image.naturalWidth, 1350 / image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.82);
    return data.length > 600_000 ? canvas.toDataURL("image/jpeg", 0.68) : data;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Éditeur de campagne, en plein écran : le message et la diffusion à gauche, l'écran exact
 * du client à droite, mis à jour à chaque frappe. Sous 1 024 px, l'aperçu s'ouvre en grand.
 */
export function CampaignEditor({
  base,
  now,
  hotelName,
  listHref,
  campaignId,
  sourceId,
}: {
  base: Campaign[];
  now: LocalNow;
  hotelName: string;
  /** Adresse de la liste des campagnes. */
  listHref: string;
  /** Campagne modifiée ; absente pour une création. */
  campaignId?: string;
  /** Campagne copiée (« Dupliquer »). */
  sourceId?: string;
}) {
  const store = useCampaignStore(base);
  const hydrated = useHydrated();
  const today = isoFromDay(now.day);

  const editing = campaignId ? store.campaigns.find((campaign) => campaign.id === campaignId) : undefined;
  const source = sourceId ? store.campaigns.find((campaign) => campaign.id === sourceId) : undefined;
  const backHref = campaignId ? `${listHref}/${campaignId}` : sourceId ? `${listHref}/${sourceId}` : listHref;

  const header = (title: string, detail: ReactNode, action?: ReactNode) => (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-3 px-4 md:px-8">
        <Link
          href={backHref}
          aria-label="Quitter sans enregistrer"
          className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-md text-fg-2 transition-colors duration-150 hover:bg-white/8 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="size-5" strokeWidth={1.75} aria-hidden />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-semibold leading-tight tracking-[-0.01em]">{title}</h1>
          <p className="truncate text-[12px] text-fg-3">{detail}</p>
        </div>
        {action}
      </div>
    </header>
  );

  if ((campaignId || sourceId) && !hydrated) {
    return header(campaignId ? "Modifier la campagne" : "Nouvelle campagne", hotelName);
  }
  if (campaignId && !editing) {
    return (
      <>
        {header("Modifier la campagne", hotelName)}
        <main id="contenu" className="mx-auto grid max-w-[640px] justify-items-start gap-3 px-4 py-10">
          <h2 className="text-[22px] font-semibold tracking-[-0.015em]">Campagne introuvable</h2>
          <p className="text-[14px] text-fg-2">Elle a peut-être été supprimée.</p>
          <Link href={listHref} className={buttonClasses({ variant: "secondary" })}>
            Voir les campagnes
          </Link>
        </main>
      </>
    );
  }

  return (
    <EditorForm
      key={editing?.id ?? source?.id ?? "new"}
      initial={draftOf(editing ?? source, today, !editing)}
      editing={editing}
      campaigns={store.campaigns}
      now={now}
      hotelName={hotelName}
      listHref={listHref}
      backHref={backHref}
      header={header}
      onSave={(input) => {
        if (editing) return { id: editing.id, saved: store.update(editing.id, input) };
        return store.add(input);
      }}
    />
  );
}

function EditorForm({
  initial,
  editing,
  campaigns,
  now,
  hotelName,
  listHref,
  backHref,
  header,
  onSave,
}: {
  initial: Draft;
  editing: Campaign | undefined;
  campaigns: Campaign[];
  now: LocalNow;
  hotelName: string;
  listHref: string;
  backHref: string;
  header: (title: string, detail: ReactNode, action?: ReactNode) => ReactNode;
  onSave: (input: Omit<Campaign, "id" | "paused" | "createdAt">) => { id: string; saved: boolean };
}) {
  const router = useRouter();
  const formId = useId();
  const ids = {
    title: `${formId}-title`,
    message: `${formId}-message`,
    image: `${formId}-image`,
    start: `${formId}-start`,
    end: `${formId}-end`,
    days: `${formId}-days`,
    hours: `${formId}-hours`,
  };
  const [draft, setDraft] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Partial<Record<CampaignField, string>>>({});
  const [imageState, setImageState] = useState<{ busy: boolean; error: string | null }>({ busy: false, error: null });
  const [replay, setReplay] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const today = isoFromDay(now.day);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    const field = (key === "noEnd" ? "end" : key === "allDay" || key === "from" || key === "to" ? "hours" : key) as CampaignField;
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const hours = draft.allDay
    ? null
    : (() => {
        const from = minutesFromInput(draft.from);
        const to = minutesFromInput(draft.to);
        return from === null || to === null ? undefined : { from, to };
      })();

  // La campagne telle qu'elle serait publiée : sert à l'aperçu, à l'état annoncé et aux chevauchements.
  const shaped: Campaign | null =
    dayFromIso(draft.start) !== null && hours !== undefined && draft.days.length > 0
      ? {
          id: editing?.id ?? "brouillon",
          title: draft.title,
          message: draft.message,
          image: draft.image,
          start: draft.start,
          end: draft.noEnd || !draft.end ? null : draft.end,
          days: draft.days,
          hours,
          paused: editing?.paused ?? false,
          createdAt: editing?.createdAt ?? new Date(0).toISOString(),
        }
      : null;
  const alternates = shaped ? overlaps(shaped, campaigns, now.day) : [];
  const outlook = shaped ? describeOutlook(shaped, now) : null;
  const content = { title: draft.title, message: draft.message, image: draft.image };

  async function pickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImageState({ busy: true, error: null });
    try {
      const data = await prepareImage(file);
      set("image", data);
      setImageState({ busy: false, error: null });
    } catch (error) {
      setImageState({ busy: false, error: error instanceof Error ? error.message : "Image illisible." });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Partial<Record<CampaignField, string>> = {};
    if (!draft.allDay && hours === undefined) found.hours = "Indiquez l'heure de début et l'heure de fin.";
    if (!draft.noEnd && !draft.end) found.end = "Indiquez la date de fin, ou cochez « Sans date de fin ».";
    const end = draft.noEnd || !draft.end ? null : draft.end;
    if (end && end < today && (!editing || end !== editing.end)) found.end = "Cette date est déjà passée.";

    const parsed = campaignInputSchema.safeParse({
      title: draft.title,
      message: draft.message,
      image: draft.image,
      start: draft.start,
      end,
      days: draft.days,
      hours: hours ?? null,
    });
    const all = { ...(parsed.success ? {} : campaignErrors(parsed)), ...found };
    const first = (["title", "message", "start", "end", "days", "hours"] as const).find((field) => all[field]);
    if (!parsed.success || first) {
      setErrors(all);
      if (first) document.getElementById(ids[first])?.focus();
      return;
    }

    setSaving(true);
    const { id, saved } = onSave(parsed.data);
    router.push(`${listHref}/${id}?statut=${!saved ? "memoire" : editing ? "enregistree" : "publiee"}`);
  }

  const counter = (length: number, max: number) => (
    <span aria-hidden className={cn("text-[12.5px] tabular-nums", length >= max ? "text-fg-2" : "text-fg-3")}>
      {length}/{max}
    </span>
  );

  return (
    <>
      {header(
        editing ? "Modifier la campagne" : "Nouvelle campagne",
        <>
          {hotelName} · {draft.title.trim() || "Sans titre"}
        </>,
        <Button variant="ghost" size="sm" className="-mr-2 lg:hidden" onClick={() => setPreviewOpen(true)}>
          <Eye strokeWidth={1.75} aria-hidden />
          Aperçu
        </Button>,
      )}
      <DemoBanner />

      <main
        id="contenu"
        className="mx-auto grid w-full max-w-[1120px] gap-10 px-4 pt-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:pt-8"
      >
        <form noValidate onSubmit={submit} className="grid min-w-0 max-w-[600px] content-start gap-8">
          <section aria-labelledby={`${formId}-message-title`} className="grid gap-5">
            <div className="grid gap-1">
              <h2 id={`${formId}-message-title`} className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
                Message
              </h2>
              <p className="text-[13px] leading-snug text-fg-3">
                En 3 secondes, on lit un titre et une quinzaine de mots : allez à l'essentiel.
              </p>
            </div>

            <div className="grid gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={ids.title} className="text-[13px] font-medium text-fg-2">
                  Titre
                </label>
                {counter(draft.title.length, TITLE_MAX)}
              </div>
              <input
                id={ids.title}
                value={draft.title}
                onChange={(event) => set("title", event.target.value)}
                maxLength={TITLE_MAX}
                placeholder="Ex. : Ce soir, dîner au restaurant"
                autoComplete="off"
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={errors.title ? `${ids.title}-error` : `${ids.title}-hint`}
                className={cn(fieldClasses, "h-11")}
              />
              <FieldNote id={ids.title} error={errors.title} hint={`${TITLE_MAX} caractères au plus, affichés en grand.`} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={ids.message} className="text-[13px] font-medium text-fg-2">
                  Texte <span className="font-normal text-fg-3">(facultatif)</span>
                </label>
                {counter(draft.message.length, MESSAGE_MAX)}
              </div>
              <textarea
                id={ids.message}
                value={draft.message}
                onChange={(event) => set("message", event.target.value)}
                maxLength={MESSAGE_MAX}
                rows={3}
                placeholder="Ex. : Menu de saison et vins de la région. Réservez à la réception."
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? `${ids.message}-error` : `${ids.message}-hint`}
                className={cn(fieldClasses, "min-h-[96px] resize-y py-2.5 leading-relaxed")}
              />
              <FieldNote id={ids.message} error={errors.message} hint={`${MESSAGE_MAX} caractères au plus.`} />
            </div>

            <div className="grid gap-2">
              <p id={`${ids.image}-label`} className="text-[13px] font-medium text-fg-2">
                Image <span className="font-normal text-fg-3">(facultative)</span>
              </p>
              {draft.image ? (
                <div className="flex items-center gap-4 rounded-md border border-line bg-surface p-3">
                  {/* L'image importée, telle qu'elle remplira le haut de l'écran. */}
                  <img src={draft.image} alt="Image de la campagne" className="h-20 w-16 shrink-0 rounded-sm object-cover" />
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <label
                      className={cn(
                        buttonClasses({ variant: "secondary", size: "sm" }),
                        "cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-white",
                      )}
                    >
                      Remplacer
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} className="sr-only" />
                    </label>
                    <Button variant="ghost" size="sm" onClick={() => set("image", null)}>
                      Retirer
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  aria-labelledby={`${ids.image}-label`}
                  className={cn(
                    "flex cursor-pointer items-center gap-3.5 rounded-md border border-dashed border-line-strong bg-surface px-4 py-3.5 transition-colors duration-150 hover:border-white/25",
                    "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-white",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-fg-2 ring-1 ring-inset ring-line">
                    {imageState.busy ? <Spinner /> : <ImagePlus className="size-5" strokeWidth={1.75} aria-hidden />}
                  </span>
                  <span className="grid gap-0.5">
                    <span className="text-[14px] font-semibold text-fg">
                      {imageState.busy ? "Préparation de l'image…" : "Ajouter une image"}
                    </span>
                    <span className="text-[12.5px] text-fg-3">JPG, PNG ou WebP. Elle remplit le haut de l'écran.</span>
                  </span>
                  <input
                    id={ids.image}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={pickImage}
                    disabled={imageState.busy}
                    className="sr-only"
                  />
                </label>
              )}
              {imageState.error ? (
                <p role="alert" className="flex items-start gap-1.5 text-[13px] leading-snug text-red-text">
                  <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
                  {imageState.error}
                </p>
              ) : null}
            </div>
          </section>

          <section aria-labelledby={`${formId}-schedule-title`} className="grid gap-5 border-t border-line pt-8">
            <div className="grid gap-1">
              <h2 id={`${formId}-schedule-title`} className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
                Diffusion
              </h2>
              <p className="text-[13px] leading-snug text-fg-3">Quand le message s'affiche, à l'heure de l'hôtel.</p>
            </div>

            <div className="grid gap-2">
              <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                <div className="grid gap-2">
                  <label htmlFor={ids.start} className="text-[13px] font-medium text-fg-2">
                    Début
                  </label>
                  <input
                    id={ids.start}
                    type="date"
                    value={draft.start}
                    onChange={(event) => set("start", event.target.value)}
                    aria-invalid={errors.start ? true : undefined}
                    aria-describedby={errors.start ? `${ids.start}-error` : undefined}
                    className={cn(pickerClasses, "w-[9.75rem]")}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor={ids.end} className="text-[13px] font-medium text-fg-2">
                    Fin
                  </label>
                  <input
                    id={ids.end}
                    type="date"
                    value={draft.noEnd ? "" : draft.end}
                    min={draft.start}
                    disabled={draft.noEnd}
                    onChange={(event) => set("end", event.target.value)}
                    aria-invalid={errors.end ? true : undefined}
                    aria-describedby={errors.end ? `${ids.end}-error` : undefined}
                    className={cn(pickerClasses, "w-[9.75rem] disabled:cursor-not-allowed disabled:opacity-50")}
                  />
                </div>
                <label className="flex h-10 items-center gap-2.5 text-[13.5px] text-fg">
                  <input
                    type="checkbox"
                    checked={draft.noEnd}
                    onChange={(event) => {
                      set("noEnd", event.target.checked);
                      if (!event.target.checked && !draft.end) set("end", draft.start > today ? draft.start : today);
                    }}
                    className="size-4 accent-red"
                  />
                  Sans date de fin
                </label>
              </div>
              <FieldNote id={ids.start} error={errors.start} />
              <FieldNote id={ids.end} error={errors.end} />
            </div>

            <fieldset className="grid gap-2.5" aria-describedby={errors.days ? `${ids.days}-error` : undefined}>
              <legend className="mb-2 text-[13px] font-medium text-fg-2">Jours</legend>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                <div id={ids.days} tabIndex={-1} className="flex gap-1.5 rounded-sm outline-none">
                  {WEEK.map((day) => {
                    const on = draft.days.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        aria-pressed={on}
                        aria-label={DAY_NAMES[day].long}
                        onClick={() =>
                          set(
                            "days",
                            on ? draft.days.filter((item) => item !== day) : WEEK.filter((item) => item === day || draft.days.includes(item)),
                          )
                        }
                        className={cn(
                          "flex size-10 items-center justify-center rounded-sm border text-[13px] font-semibold transition-colors duration-150",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                          on
                            ? "border-white/25 bg-white/[0.12] text-fg"
                            : "border-line bg-transparent text-fg-3 hover:border-line-strong hover:text-fg-2",
                        )}
                      >
                        <span aria-hidden>{DAY_NAMES[day].letter}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    { label: "Tous les jours", days: WEEK },
                    { label: "En semaine", days: [1, 2, 3, 4, 5] as Weekday[] },
                    { label: "Le week-end", days: [6, 0] as Weekday[] },
                  ].map((preset) => (
                    <Button key={preset.label} variant="ghost" size="sm" onClick={() => set("days", [...preset.days])}>
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <FieldNote id={ids.days} error={errors.days} />
            </fieldset>

            <fieldset className="grid gap-2.5">
              <legend className="mb-2 text-[13px] font-medium text-fg-2">Heures</legend>
              <div className="flex w-max gap-0.5 rounded-md border border-line bg-surface p-1">
                {[
                  { value: true, label: "Toute la journée" },
                  { value: false, label: "Certaines heures" },
                ].map((option) => (
                  <label
                    key={option.label}
                    className={cn(
                      "flex h-8 cursor-pointer items-center rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
                      "has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-white",
                      draft.allDay === option.value ? "bg-white/[0.09] text-fg" : "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${formId}-hours`}
                      checked={draft.allDay === option.value}
                      onChange={() => set("allDay", option.value)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {draft.allDay ? null : (
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13.5px] text-fg-2">
                  <label htmlFor={ids.hours}>De</label>
                  <input
                    id={ids.hours}
                    type="time"
                    step={900}
                    value={draft.from}
                    onChange={(event) => set("from", event.target.value)}
                    aria-invalid={errors.hours ? true : undefined}
                    aria-describedby={errors.hours ? `${ids.hours}-error` : `${ids.hours}-hint`}
                    className={cn(pickerClasses, "w-[7.5rem]")}
                  />
                  <label htmlFor={`${ids.hours}-to`}>à</label>
                  <input
                    id={`${ids.hours}-to`}
                    type="time"
                    step={900}
                    value={draft.to}
                    onChange={(event) => set("to", event.target.value)}
                    aria-invalid={errors.hours ? true : undefined}
                    aria-describedby={errors.hours ? `${ids.hours}-error` : `${ids.hours}-hint`}
                    className={cn(pickerClasses, "w-[7.5rem]")}
                  />
                </div>
              )}
              {draft.allDay ? null : (
                <FieldNote id={ids.hours} error={errors.hours} hint="Une plage peut passer minuit, de 22 h à 2 h par exemple." />
              )}
            </fieldset>

            {alternates.length > 0 ? (
              <p className="flex items-start gap-2 text-[13px] leading-snug text-fg-2">
                <Info className="mt-px size-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden />
                <span>
                  Elle alternera avec {alternates.map((other) => `« ${other.title} »`).join(", ")} quand leurs créneaux se
                  croisent : une campagne par chasse lancée.
                </span>
              </p>
            ) : null}
          </section>

          {/* Toujours à portée : ce qui se passera, et le bouton qui le fait. */}
          <div className="sticky bottom-0 z-20 -mx-4 grid gap-3 border-t border-line bg-canvas px-4 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 md:-mx-8 md:px-8 lg:mx-0 lg:px-0">
            {outlook ? <p className="text-[13.5px] leading-snug text-fg-2">{outlook}</p> : null}
            <div className="grid gap-2 sm:flex">
              <Button type="submit" size="lg" loading={saving}>
                {editing ? "Enregistrer" : "Publier la campagne"}
              </Button>
              <Link href={backHref} className={buttonClasses({ variant: "ghost", size: "lg", className: "max-sm:hidden" })}>
                Annuler
              </Link>
            </div>
          </div>
        </form>

        <aside aria-labelledby={`${formId}-preview-title`} className="max-lg:hidden">
          <div className="sticky top-[88px] grid justify-items-center gap-4">
            <div className="flex w-full items-start justify-between gap-3">
              <div>
                <h2 id={`${formId}-preview-title`} className="text-[15px] font-semibold tracking-[-0.01em] text-fg">
                  Aperçu
                </h2>
                <p className="mt-0.5 text-[12.5px] leading-snug text-fg-3">L'écran exact, sur un téléphone.</p>
              </div>
              <Button variant="ghost" size="sm" className="-mr-2 shrink-0" onClick={() => setReplay((value) => value + 1)}>
                <RotateCcw strokeWidth={1.75} aria-hidden />
                Rejouer
              </Button>
            </div>
            <PhoneFrame width={300} label="Aperçu de l'écran de chargement" description={describeScreen(content)}>
              <LoadingScreen key={replay} content={content} hotelName={hotelName} />
            </PhoneFrame>
          </div>
        </aside>
      </main>

      {previewOpen ? (
        <PreviewDialog onClose={() => setPreviewOpen(false)}>
          <PreviewStage content={content} hotelName={hotelName} close={{ onClose: () => setPreviewOpen(false) }} />
        </PreviewDialog>
      ) : null}
    </>
  );
}

/** Ce qui se passera à la publication : « Elle s'affichera aujourd'hui à 17 h. » */
function describeOutlook(campaign: Campaign, now: LocalNow): string | null {
  const status = campaignStatus(campaign, now);
  if (status === "ended") return "Ses dates sont passées : elle ne s'affichera plus.";
  if (status === "paused") return "Elle est en pause : elle s'affichera de nouveau une fois reprise.";
  if (status === "live") return "Elle s'affichera dès la publication.";
  const next = nextShowingLabel(campaign, now);
  if (status === "scheduled") {
    const start = dayFromIso(campaign.start);
    return next ? `Elle s'affichera pour la première fois ${next}.` : start !== null ? `Elle commencera le ${formatDay(start)}.` : null;
  }
  return next ? `Elle s'affichera ${next}.` : "Aucun créneau dans les deux semaines qui viennent : vérifiez les jours et les heures.";
}

function FieldNote({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] leading-snug text-red-text">
        <CircleAlert className="mt-px size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
        {error}
      </p>
    );
  }
  return hint ? (
    <p id={`${id}-hint`} className="text-[13px] leading-snug text-fg-3">
      {hint}
    </p>
  ) : null;
}

/** Aperçu en grand dans un `<dialog>` modal : le focus y reste, Échap le ferme. */
function PreviewDialog({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      opener?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label="Aperçu en plein écran"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 backdrop:bg-black"
    >
      {children}
    </dialog>
  );
}
