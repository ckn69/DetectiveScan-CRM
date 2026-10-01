import type { Metadata } from "next";
import { CampaignEditor } from "@/components/campaigns/campaign-editor";
import { demoCampaignsBase } from "@/lib/campaigns/demo-campaigns";
import { hotelNow } from "@/lib/dates";
import { DEMO_HOTEL } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";

export const metadata: Metadata = { title: "Modifier la campagne" };

export default async function EditCampaignPage({ params }: { params: Promise<{ hotel: string; id: string }> }) {
  const { hotel, id } = await params;
  return (
    <CampaignEditor
      base={demoCampaignsBase()}
      now={hotelNow()}
      hotelName={DEMO_HOTEL.name}
      listHref={sectionHref(hotel, "campaigns")}
      campaignId={id}
    />
  );
}
