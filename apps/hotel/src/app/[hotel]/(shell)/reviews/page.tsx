import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Avis clients" };

export default function ReviewsPage() {
  return <ComingSoon slug="reviews" />;
}
