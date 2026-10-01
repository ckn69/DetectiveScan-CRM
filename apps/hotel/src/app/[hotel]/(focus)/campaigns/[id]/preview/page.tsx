import type { Metadata } from "next";
import { CampaignFullPreview } from "@/components/campaigns/campaign-full-preview";
import { demoCampaignsBase } from "@/lib/campaigns/demo-campaigns";
import { DEMO_HOTEL } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";

export const metadata: Metadata = { title: "Aperçu de la campagne" };

/** L'écran de chargement en plein écran : sur un téléphone, exactement ce que voit le client. */
export default async function CampaignPreviewPage({ params }: { params: Promise<{ hotel: string; id: string }> }) {
  const { hotel, id } = await params;
  return (
    <CampaignFullPreview
      id={id}
      base={demoCampaignsBase()}
      hotelName={DEMO_HOTEL.name}
      backHref={`${sectionHref(hotel, "campaigns")}/${id}`}
    />
  );
}
