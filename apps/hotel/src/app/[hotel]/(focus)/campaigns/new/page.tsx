import type { Metadata } from "next";
import { CampaignEditor } from "@/components/campaigns/campaign-editor";
import { demoCampaignsBase } from "@/lib/campaigns/demo-campaigns";
import { hotelNow } from "@/lib/dates";
import { DEMO_HOTEL } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";

export const metadata: Metadata = { title: "Nouvelle campagne" };

/** Création d'une campagne ; `?depuis=<id>` part d'une copie (« Dupliquer »). */
export default async function NewCampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ hotel: string }>;
  searchParams: Promise<{ depuis?: string | string[] }>;
}) {
  const { hotel } = await params;
  const { depuis } = await searchParams;
  return (
    <CampaignEditor
      base={demoCampaignsBase()}
      now={hotelNow()}
      hotelName={DEMO_HOTEL.name}
      listHref={sectionHref(hotel, "campaigns")}
      sourceId={typeof depuis === "string" ? depuis : undefined}
    />
  );
}
