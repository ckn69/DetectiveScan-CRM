import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Aide & support" };

export default function SupportPage() {
  return <ComingSoon slug="support" />;
}
