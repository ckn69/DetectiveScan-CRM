import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Campagnes" };

export default function CampaignsPage() {
  return <ComingSoon slug="campaigns" />;
}
