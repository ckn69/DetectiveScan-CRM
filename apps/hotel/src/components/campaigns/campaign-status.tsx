import { Badge } from "@detectivescan/ui";
import type { CampaignStatus } from "@/lib/campaigns/types";

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  live: "En diffusion",
  waiting: "Hors créneau",
  scheduled: "Programmée",
  paused: "En pause",
  ended: "Terminée",
};

/**
 * État d'une campagne. La diffusion en cours est le seul état vivant : une pastille verte et
 * un libellé ; la pause, à traiter, prend un badge ambre ; le reste, un badge neutre.
 */
export function CampaignStatusLabel({ status }: { status: CampaignStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-fg-2">
        <span aria-hidden className="size-1.5 rounded-full bg-success" />
        {CAMPAIGN_STATUS_LABEL.live}
      </span>
    );
  }
  return <Badge tone={status === "paused" ? "warning" : "neutral"}>{CAMPAIGN_STATUS_LABEL[status]}</Badge>;
}
