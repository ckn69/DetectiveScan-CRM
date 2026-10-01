"use client";

import { Button, buttonClasses, Card, cn } from "@detectivescan/ui";
import { ArrowLeft, Copy, Expand, Pause, Pencil, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type RefObject, useEffect, useRef, useState } from "react";
import {
  campaignStatus,
  datesLabel,
  daysLabel,
  hoursLabel,
  overlaps,
  statusDetail,
} from "@/lib/campaigns/schedule";
import type { Campaign, CampaignStats } from "@/lib/campaigns/types";
import type { LocalNow } from "@/lib/dates";
import { formatDateTime, formatInteger, formatPercent } from "@/lib/format";
import { Notice, useNotice } from "../notice";
import { CampaignStatusLabel } from "./campaign-status";
import { useCampaignStore, useHydrated } from "./campaign-store";
import { DisplaysChart } from "./displays-chart";
import { describeScreen, LoadingScreen, PhoneFrame } from "./loading-screen";

/** Messages portés par l'adresse au retour de l'éditeur (`?statut=…`). */
const ARRIVAL: Record<string, string> = {
  publiee: "Campagne publiée.",
  enregistree: "Modifications enregistrées.",
  memoire: "Enregistrée pour cette visite : le navigateur n'a pas pu garder l'image.",
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Fiche d'une campagne : son état, ses affichages jour par jour, sa diffusion, et l'écran
 * exact que voient les clients. Modifier ouvre l'éditeur ; pause, copie et suppression ici.
 */
export function CampaignDetail({
  id,
  base,
  stats,
  now,
  hotelName,
  href,
}: {
  id: string;
  base: Campaign[];
  stats: Record<string, CampaignStats>;
  now: LocalNow;
  hotelName: string;
  /** Adresse de la liste des campagnes. */
  href: string;
}) {
  const store = useCampaignStore(base);
  const hydrated = useHydrated();
  const router = useRouter();
  const notice = useNotice();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [replay, setReplay] = useState(0);
  const confirmTop = useRef<HTMLButtonElement>(null);
  const confirmFoot = useRef<HTMLButtonElement>(null);
  const show = notice.show;

  // La confirmation apparaît à l'endroit visible (tête ou pied) : le focus va à son bouton.
  useEffect(() => {
    if (!confirmDelete) return;
    [confirmTop.current, confirmFoot.current].find((button) => button && button.offsetParent !== null)?.focus();
  }, [confirmDelete]);

  useEffect(() => {
    const arrival = new URLSearchParams(window.location.search).get("statut");
    const message = arrival ? ARRIVAL[arrival] : undefined;
    if (message) {
      show(message);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [show]);

  const campaign = store.campaigns.find((item) => item.id === id);
  if (!campaign) {
    if (!hydrated) return <div role="status" aria-label="Chargement de la campagne" className="min-h-[60vh]" />;
    return (
      <div className="grid max-w-[640px] justify-items-start gap-3 py-8">
        <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-fg">Campagne introuvable</h2>
        <p className="text-[14px] leading-relaxed text-fg-2">Elle a peut-être été supprimée.</p>
        <Link href={href} className={buttonClasses({ variant: "secondary" })}>
          Voir les campagnes
        </Link>
      </div>
    );
  }

  const status = campaignStatus(campaign, now);
  const detail = statusDetail(campaign, status, now);
  const stat = stats[campaign.id];
  const alternates = status === "ended" ? [] : overlaps(campaign, store.campaigns, now.day);

  function togglePause() {
    if (!campaign) return;
    store.update(campaign.id, { paused: !campaign.paused });
    notice.show(campaign.paused ? "Campagne reprise." : "Campagne mise en pause : elle ne s'affiche plus.");
  }

  function remove() {
    if (!campaign) return;
    store.remove(campaign.id);
    router.push(`${href}?statut=supprimee`);
  }

  const preview = (width: number, className: string) => (
    <PhoneFrame
      width={width}
      description={describeScreen(campaign)}
      label={`Aperçu de l'écran de chargement : ${campaign.title}`}
      className={className}
    >
      <LoadingScreen key={replay} content={campaign} hotelName={hotelName} />
    </PhoneFrame>
  );

  // Confirmation de suppression, à la place des boutons : dans la tête de page dès 640 px, au pied en dessous.
  const confirmation = (ref: RefObject<HTMLButtonElement | null>, id: string) => (
    <div className="grid gap-2.5 sm:justify-items-end">
      <p id={id} className="text-[13.5px] text-fg">
        Supprimer cette campagne ? Ses affichages sont effacés avec elle.
      </p>
      <div className="flex gap-2">
        <Button ref={ref} variant="danger" onClick={remove} aria-describedby={id}>
          Supprimer
        </Button>
        <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid max-w-[1280px] gap-5 py-4 md:gap-6 md:py-6">
      <div className="grid gap-3">
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-2 rounded-sm text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
          Campagnes
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="grid min-w-0 gap-1.5">
            <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.015em] text-fg">{campaign.title}</h2>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
              <CampaignStatusLabel status={status} />
              {detail ? <span className="text-fg-3">{detail}</span> : null}
            </p>
          </div>

          {confirmDelete ? (
            <div className="max-sm:hidden">{confirmation(confirmTop, "delete-top")}</div>
          ) : (
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <Link
                href={`${href}/${campaign.id}/edit`}
                className={buttonClasses({ variant: "secondary", className: status === "ended" ? "max-sm:col-span-2" : undefined })}
              >
                <Pencil strokeWidth={1.75} aria-hidden />
                Modifier
              </Link>
              {status === "ended" ? null : (
                <Button variant="ghost" onClick={togglePause}>
                  {campaign.paused ? <Play strokeWidth={1.75} aria-hidden /> : <Pause strokeWidth={1.75} aria-hidden />}
                  {campaign.paused ? "Reprendre" : "Mettre en pause"}
                </Button>
              )}
              <Link
                href={`${href}/new?depuis=${campaign.id}`}
                className={buttonClasses({ variant: "ghost", className: "max-sm:hidden" })}
              >
                <Copy strokeWidth={1.75} aria-hidden />
                Dupliquer
              </Link>
              <Button variant="danger" className="max-sm:hidden" onClick={() => setConfirmDelete(true)}>
                Supprimer
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Les chiffres d'abord : l'aperçu vient à droite dès 1 280 px, en vignette en dessous. */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:grid-rows-[auto_auto_1fr] xl:items-start">
        <Card as="section" aria-label="Résultats" className="grid sm:grid-cols-3 xl:col-start-1 xl:row-start-1">
          {[
            {
              label: "Affichages",
              value: formatInteger(stat?.displays ?? 0),
              note: "depuis le début",
              big: true,
            },
            {
              label: "Part des chasses lancées",
              value: stat?.share != null ? formatPercent(stat.share) : "—",
              note: "pendant ses dates",
              big: true,
            },
            {
              label: "Dernier affichage",
              value: stat?.lastShown ?? "Aucun",
              note: null,
              big: false,
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={cn("grid content-start gap-1.5 p-4 md:p-5", index > 0 && "border-t border-line sm:border-l sm:border-t-0")}
            >
              <p className="text-[13px] font-medium text-fg-2">{item.label}</p>
              <p
                className={cn(
                  "text-fg",
                  item.big ? "text-[28px] font-semibold leading-none tracking-[-0.02em]" : "text-[15px] font-medium tabular-nums",
                )}
              >
                {item.value}
              </p>
              {item.note ? <p className="text-[12.5px] text-fg-3">{item.note}</p> : null}
            </div>
          ))}
        </Card>

        {/* Sous 1 280 px : une vignette compacte, à la largeur de son contenu. */}
        <Card aria-labelledby="preview-title-compact" className="flex w-full max-w-[30rem] items-start gap-4 p-4 md:p-5 xl:hidden">
          {preview(112, "")}
          <div className="grid min-w-0 content-start gap-3">
            <div>
              <h3 id="preview-title-compact" className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-fg">
                Aperçu
              </h3>
              <p className="mt-0.5 text-[12.5px] leading-snug text-fg-3">
                Affiché environ 3 secondes, pendant le chargement de l'enquête.
              </p>
            </div>
            <div className="grid justify-items-start gap-1">
              <Button variant="ghost" size="sm" className="-ml-3" onClick={() => setReplay((value) => value + 1)}>
                <RotateCcw strokeWidth={1.75} aria-hidden />
                Rejouer
              </Button>
              <Link href={`${href}/${campaign.id}/preview`} className={buttonClasses({ variant: "ghost", size: "sm", className: "-ml-3" })}>
                <Expand strokeWidth={1.75} aria-hidden />
                Voir en plein écran
              </Link>
            </div>
          </div>
        </Card>

        {/* Dès 1 280 px : l'aperçu en grand, dans la colonne de droite, qui suit le défilement. */}
        <Card
          aria-labelledby="preview-title"
          className="grid justify-items-center gap-4 p-5 max-xl:hidden xl:sticky xl:top-[88px] xl:col-start-2 xl:row-span-3 xl:row-start-1"
        >
          <header className="flex w-full items-start justify-between gap-3">
            <div>
              <h3 id="preview-title" className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-fg">
                Aperçu
              </h3>
              <p className="mt-0.5 text-[12.5px] leading-snug text-fg-3">
                Affiché environ 3 secondes, pendant le chargement de l'enquête.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="-mr-2 shrink-0" onClick={() => setReplay((value) => value + 1)}>
              <RotateCcw strokeWidth={1.75} aria-hidden />
              Rejouer
            </Button>
          </header>
          {preview(256, "")}
          <Link
            href={`${href}/${campaign.id}/preview`}
            className="inline-flex w-fit items-center gap-2 rounded-sm text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Expand className="size-4" strokeWidth={1.75} aria-hidden />
            Voir en plein écran
          </Link>
        </Card>

        <DisplaysChart
          className="xl:col-start-1 xl:row-start-2"
          points={stat?.daily ?? []}
          emptyText={status === "scheduled" ? "La campagne n'a pas encore commencé." : "Pas encore d'affichage : ils apparaîtront ici."}
        />

        <Card as="section" aria-labelledby="schedule-title" className="p-4 md:p-5 xl:col-start-1 xl:row-start-3">
          <h3 id="schedule-title" className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-fg">
            Diffusion
          </h3>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-[13.5px] sm:grid-cols-[10rem_minmax(0,1fr)]">
            {[
              ["Dates", datesLabel(campaign, now.day)],
              ["Jours", daysLabel(campaign.days)],
              ["Heures", capitalize(hoursLabel(campaign.hours))],
              ["Créée le", formatDateTime(campaign.createdAt)],
            ].map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="text-fg-3">{term}</dt>
                <dd className="-mt-2 text-fg sm:mt-0">{value}</dd>
              </div>
            ))}
            {status === "ended" ? null : (
              <div className="contents">
                <dt className="text-fg-3">Alterne avec</dt>
                <dd className="-mt-2 text-fg sm:mt-0">
                  {alternates.length === 0 ? (
                    <span className="text-fg-2">Aucune autre campagne sur ses créneaux</span>
                  ) : (
                    <ul className="grid gap-1">
                      {alternates.map((other) => (
                        <li key={other.id}>
                          <Link
                            href={`${href}/${other.id}`}
                            className="rounded-sm underline decoration-white/30 underline-offset-4 transition-colors duration-150 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            {other.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            )}
          </dl>
          {alternates.length > 0 ? (
            <p className="mt-4 text-[12.5px] leading-relaxed text-fg-3">
              Quand leurs créneaux se croisent, les campagnes s'affichent à tour de rôle, une par chasse lancée.
            </p>
          ) : null}
        </Card>
      </div>

      {/* Sous 640 px, la copie et la suppression descendent au pied de la fiche. */}
      <div className="border-t border-line pt-5 sm:hidden">
        {confirmDelete ? (
          confirmation(confirmFoot, "delete-foot")
        ) : (
          <div className="flex items-center justify-between gap-3">
            <Link href={`${href}/new?depuis=${campaign.id}`} className={buttonClasses({ variant: "ghost", className: "-ml-4" })}>
              <Copy strokeWidth={1.75} aria-hidden />
              Dupliquer
            </Link>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Supprimer
            </Button>
          </div>
        )}
      </div>

      <Notice message={notice.message} />
    </div>
  );
}
