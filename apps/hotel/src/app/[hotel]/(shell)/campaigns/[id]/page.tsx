import type { Metadata } from "next";
import { CampaignDetail } from "@/components/campaigns/campaign-detail";
import { demoCampaignsBase } from "@/lib/campaigns/demo-campaigns";
import { demoCampaignStats } from "@/lib/dashboard/demo-data";
import { hotelNow } from "@/lib/dates";
import { DEMO_HOTEL } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";

export const metadata: Metadata = { title: "Campagne" };

export default async function CampaignPage({ params }: { params: Promise<{ hotel: string; id: string }> }) {
  const { hotel, id } = await params;
  const now = hotelNow();
  const base = demoCampaignsBase();
  return (
    <CampaignDetail
      id={id}
      base={base}
      stats={demoCampaignStats(base, now)}
      now={now}
      hotelName={DEMO_HOTEL.name}
      href={sectionHref(hotel, "campaigns")}
    />
  );
}
