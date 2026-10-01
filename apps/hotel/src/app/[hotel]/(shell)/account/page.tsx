import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Abonnement" };

export default function AccountPage() {
  return <ComingSoon slug="account" />;
}
