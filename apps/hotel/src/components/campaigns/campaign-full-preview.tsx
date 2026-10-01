"use client";

import { buttonClasses } from "@detectivescan/ui";
import Link from "next/link";
import type { Campaign } from "@/lib/campaigns/types";
import { useCampaignStore, useHydrated } from "./campaign-store";
import { PreviewStage } from "./full-screen-preview";

export function CampaignFullPreview({
  id,
  base,
  hotelName,
  backHref,
}: {
  id: string;
  base: Campaign[];
  hotelName: string;
  backHref: string;
}) {
  const { campaigns } = useCampaignStore(base);
  const hydrated = useHydrated();
  const campaign = campaigns.find((item) => item.id === id);

  if (!campaign) {
    if (!hydrated) return <div className="fixed inset-0 bg-black" />;
    return (
      <main id="contenu" className="mx-auto grid max-w-[640px] justify-items-start gap-3 px-4 py-10">
        <h1 className="text-[22px] font-semibold tracking-[-0.015em]">Campagne introuvable</h1>
        <p className="text-[14px] text-fg-2">Elle a peut-être été supprimée.</p>
        <Link href={backHref} className={buttonClasses({ variant: "secondary" })}>
          Retour
        </Link>
      </main>
    );
  }

  return (
    <main id="contenu">
      <h1 className="sr-only">Aperçu de la campagne « {campaign.title} »</h1>
      <PreviewStage content={campaign} hotelName={hotelName} close={{ href: backHref }} />
    </main>
  );
}
