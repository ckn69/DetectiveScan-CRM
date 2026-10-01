"use client";

import { Button, buttonClasses, Card, cn } from "@detectivescan/ui";
import { ChevronLeft, ChevronRight, Expand, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { campaignStatus, datesLabel, nextShowing, nextShowingLabel, slotLabel, statusDetail } from "@/lib/campaigns/schedule";
import type { Campaign, CampaignStats, CampaignStatus } from "@/lib/campaigns/types";
import type { LocalNow } from "@/lib/dates";
import { formatInteger, plural } from "@/lib/format";
import { Notice, useNotice } from "../notice";
import { CampaignStatusLabel } from "./campaign-status";
import { useCampaignStore } from "./campaign-store";
import { describeScreen, LoadingScreen, PhoneFrame, ScreenThumb } from "./loading-screen";

type Tab = "current" | "scheduled" | "ended";

const TAB_OF: Record<CampaignStatus, Tab> = {
  live: "current",
  waiting: "current",
  paused: "current",
  scheduled: "scheduled",
  ended: "ended",
};

/** Dans l'onglet « En cours » : ce qui passe maintenant d'abord, puis ce qui attend son créneau, puis la pause. */
const ORDER: Record<CampaignStatus, number> = { live: 0, waiting: 1, paused: 2, scheduled: 3, ended: 4 };

/**
 * Campagnes de l'hôtel : ce que voient les clients en ce moment, puis la liste par état
 * (en cours, programmées, terminées), chaque campagne avec sa vignette d'écran exacte.
 */
export function CampaignList({
  base,
  stats,
  now,
  hotelName,
  href,
}: {
  base: Campaign[];
  stats: Record<string, CampaignStats>;
  now: LocalNow;
  hotelName: string;
  href: string;
}) {
  const store = useCampaignStore(base);
  /** À état égal : la prochaine à passer d'abord ; les terminées, de la plus récente à la plus ancienne. */
  function within(a: { campaign: Campaign; status: CampaignStatus }, b: { campaign: Campaign; status: CampaignStatus }) {
    if (a.status === "ended") return (b.campaign.end ?? "").localeCompare(a.campaign.end ?? "");
    if (a.status === "waiting" || a.status === "scheduled") {
      const next = (campaign: Campaign) => {
        const at = nextShowing(campaign, now);
        return at ? at.day * 1440 + at.minutes : Number.POSITIVE_INFINITY;
      };
      return next(a.campaign) - next(b.campaign);
    }
    return a.campaign.title.localeCompare(b.campaign.title, "fr");
  }
  const rows = useMemo(
    () =>
      store.campaigns
        .map((campaign) => ({ campaign, status: campaignStatus(campaign, now) }))
        .sort((a, b) => ORDER[a.status] - ORDER[b.status] || within(a, b)),
    [store.campaigns, now],
  );
  const [tab, setTab] = useState<Tab>("current");
  const notice = useNotice();

  const show = notice.show;

  // Retour d'une suppression : la confirmation s'affiche ici, sur la liste.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("statut") === "supprimee") {
      show("Campagne supprimée.");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [show]);

  const counts = { current: 0, scheduled: 0, ended: 0 };
  for (const row of rows) counts[TAB_OF[row.status]] += 1;
  const visible = rows.filter((row) => TAB_OF[row.status] === tab);
  const live = rows.filter((row) => row.status === "live").map((row) => row.campaign);

  const tabs: { key: Tab; label: string }[] = [
    { key: "current", label: "En cours" },
    { key: "scheduled", label: "Programmées" },
    { key: "ended", label: "Terminées" },
  ];

  return (
    <div className="grid max-w-[1600px] gap-4 py-4 md:gap-5 md:py-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
      <NowPanel
        live={live}
        upcoming={rows.filter((row) => row.status === "waiting" || row.status === "scheduled").map((row) => row.campaign)}
        now={now}
        hotelName={hotelName}
        href={href}
        className="xl:sticky xl:top-[88px] xl:col-start-2 xl:row-start-1"
      />

      <div className="grid min-w-0 content-start gap-4 md:gap-5 xl:col-start-1 xl:row-start-1">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-[14px] text-fg-2">
            <span className="font-semibold tabular-nums text-fg">{counts.current}</span>{" "}
            {counts.current > 1 ? "campagnes en cours" : "campagne en cours"}
            {counts.scheduled > 0 ? (
              <>
                {" · "}
                <span className="tabular-nums">{counts.scheduled}</span>{" "}
                {counts.scheduled > 1 ? "programmées" : "programmée"}
              </>
            ) : null}
          </p>
          <Link href={`${href}/new`} className={buttonClasses({ variant: "secondary", className: "max-sm:w-full" })}>
            <Plus strokeWidth={1.75} aria-hidden />
            Nouvelle campagne
          </Link>
        </div>

        <div role="group" aria-label="Filtrer par état" className="max-w-full overflow-x-auto">
          <div className="flex w-max items-center gap-0.5 rounded-md border border-line bg-surface p-1">
            {tabs.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={tab === option.key}
                onClick={() => setTab(option.key)}
                className={cn(
                  "flex h-8 items-center gap-1.5 whitespace-nowrap rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white",
                  tab === option.key ? "bg-white/[0.09] text-fg" : "text-fg-2 hover:bg-white/[0.05] hover:text-fg",
                )}
              >
                {option.label}
                <span className="tabular-nums text-fg-3">{counts[option.key]}</span>
              </button>
            ))}
          </div>
        </div>

        <section aria-labelledby="campaigns-title" className="rounded-md border border-line bg-surface">
          <h2 id="campaigns-title" className="sr-only">
            {tabs.find((option) => option.key === tab)?.label}
          </h2>
          {visible.length === 0 ? (
            <Empty tab={tab} total={rows.length} href={href} />
          ) : (
            <ul>
              {visible.map(({ campaign, status }, index) => {
                const detail = statusDetail(campaign, status, now);
                const displays = stats[campaign.id]?.displays ?? 0;
                return (
                  <li key={campaign.id} className={cn(index > 0 && "border-t border-line")}>
                    <Link
                      href={`${href}/${campaign.id}`}
                      className="flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white md:px-5"
                    >
                      <ScreenThumb width={52} content={campaign} hotelName={hotelName} />
                      <span className="grid min-w-0 flex-1 gap-1">
                        <span className="truncate text-[15px] font-semibold tracking-[-0.01em] text-fg">{campaign.title}</span>
                        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
                          <CampaignStatusLabel status={status} />
                          {detail ? <span className="text-fg-3">{detail}</span> : null}
                        </span>
                        <span className="text-[13px] leading-snug text-fg-3">
                          {datesLabel(campaign, now.day)} · {slotLabel(campaign).toLowerCase()}
                        </span>
                        <span className="text-[13px] tabular-nums text-fg-2 sm:hidden">{plural(displays, "affichage")}</span>
                      </span>
                      <span className="hidden shrink-0 text-right sm:grid">
                        <span className="text-[15px] font-semibold tabular-nums text-fg">{formatInteger(displays)}</span>
                        <span className="text-[12px] text-fg-3">{displays >= 2 ? "affichages" : "affichage"}</span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-fg-3" strokeWidth={1.75} aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-fg-3">
          Démo : vos campagnes restent dans ce navigateur, et les images sont des exemples.
          <button
            type="button"
            onClick={store.reset}
            className="rounded-sm text-fg-2 underline underline-offset-4 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Revenir aux campagnes de départ
          </button>
        </p>
      </div>
      <Notice message={notice.message} />
    </div>
  );
}

function Empty({ tab, total, href }: { tab: Tab; total: number; href: string }) {
  if (total === 0) {
    return (
      <div className="grid justify-items-start gap-3 px-5 py-10">
        <p className="text-[15px] font-semibold text-fg">Aucune campagne pour l'instant</p>
        <p className="max-w-[56ch] text-[14px] leading-relaxed text-fg-2">
          Au lancement d'une chasse, vos clients attendent quelques secondes sur un écran noir. Profitez-en pour leur
          parler de votre restaurant, de votre spa ou d'une soirée.
        </p>
        <Link href={`${href}/new`} className={buttonClasses({ variant: "secondary" })}>
          <Plus strokeWidth={1.75} aria-hidden />
          Créer une campagne
        </Link>
      </div>
    );
  }
  const text = {
    current: "Aucune campagne en cours.",
    scheduled: "Aucune campagne programmée.",
    ended: "Aucune campagne terminée.",
  }[tab];
  return <p className="px-5 py-8 text-[14px] text-fg-2">{text}</p>;
}

/**
 * Ce que voit un client qui lance une chasse maintenant : la campagne en créneau, chacune à
 * son tour quand plusieurs se chevauchent. Hors créneau, la prochaine qui passera ; sans
 * campagne à venir, l'écran de chargement reste noir.
 */
function NowPanel({
  live,
  upcoming,
  now,
  hotelName,
  href,
  className,
}: {
  live: Campaign[];
  upcoming: Campaign[];
  now: LocalNow;
  hotelName: string;
  href: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [replay, setReplay] = useState(0);

  const next = upcoming
    .map((campaign) => ({ campaign, at: nextShowing(campaign, now) }))
    .filter((item): item is { campaign: Campaign; at: { day: number; minutes: number } } => item.at !== null)
    .sort((a, b) => a.at.day - b.at.day || a.at.minutes - b.at.minutes)[0]?.campaign;
  const isLive = live.length > 0;
  const shown = isLive ? live[index % live.length] : next;
  const status = shown ? campaignStatus(shown, now) : null;

  const heading = isLive ? "En ce moment" : next ? "Prochaine campagne" : "À l'écran";
  const subtitle = isLive
    ? "Ce que voit un client qui lance une chasse."
    : next
      ? `Ce que verront vos clients ${nextShowingLabel(next, now)}.`
      : "Aucune campagne à venir.";

  const frame = (width: number, className: string) => (
    <PhoneFrame width={width} description={describeScreen(shown ?? null)} label={shown ? `Aperçu de l'écran de chargement : ${shown.title}` : "Aperçu de l'écran de chargement, sans campagne"} className={className}>
      <LoadingScreen key={`${shown?.id ?? "none"}-${replay}`} content={shown ?? null} hotelName={hotelName} />
    </PhoneFrame>
  );

  return (
    <Card aria-labelledby="now-title" className={cn("p-4 md:p-5", className)}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 id="now-title" className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-fg">
            {heading}
          </h2>
          <p className="mt-0.5 text-[12.5px] leading-snug text-fg-3">{subtitle}</p>
        </div>
        <Button variant="ghost" size="sm" className="-mr-2 shrink-0" onClick={() => setReplay((value) => value + 1)}>
          <RotateCcw strokeWidth={1.75} aria-hidden />
          Rejouer
        </Button>
      </header>

      <div className="mt-4 flex items-start gap-4 xl:grid xl:justify-items-center">
        {frame(236, "max-xl:hidden")}
        {frame(112, "xl:hidden")}

        <div className="grid min-w-0 flex-1 content-start gap-1.5 xl:w-full xl:justify-items-start">
          {shown && status ? (
            <>
              <Link
                href={`${href}/${shown.id}`}
                className="w-fit rounded-sm text-[15px] font-semibold tracking-[-0.01em] text-fg underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {shown.title}
              </Link>
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px]">
                <CampaignStatusLabel status={status} />
                <span className="text-fg-3">{statusDetail(shown, status, now)}</span>
              </p>
              {live.length > 1 ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <p className="text-[13px] text-fg-2">
                    En alternance, une par chasse : <span className="tabular-nums">{(index % live.length) + 1}</span> sur{" "}
                    <span className="tabular-nums">{live.length}</span>
                  </p>
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label="Campagne précédente"
                      className="w-8 px-0"
                      onClick={() => setIndex((value) => (value + live.length - 1) % live.length)}
                    >
                      <ChevronLeft strokeWidth={1.75} aria-hidden />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      aria-label="Campagne suivante"
                      className="w-8 px-0"
                      onClick={() => setIndex((value) => (value + 1) % live.length)}
                    >
                      <ChevronRight strokeWidth={1.75} aria-hidden />
                    </Button>
                  </div>
                </div>
              ) : null}
              <Link
                href={`${href}/${shown.id}/preview`}
                className="mt-1.5 inline-flex w-fit items-center gap-2 rounded-sm text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Expand className="size-4" strokeWidth={1.75} aria-hidden />
                Voir en plein écran
              </Link>
            </>
          ) : (
            <>
              <p className="text-[13px] leading-snug text-fg-2">
                Sans campagne, le client ne voit que le chargement de l'enquête.
              </p>
              <Link
                href={`${href}/new`}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-sm text-[13px] font-medium text-fg underline underline-offset-4 hover:text-fg-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Créer une campagne
              </Link>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
