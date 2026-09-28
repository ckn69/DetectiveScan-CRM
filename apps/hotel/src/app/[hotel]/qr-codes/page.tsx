import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "QR codes & chambres" };

export default function QrCodesPage() {
  return <ComingSoon slug="qr-codes" />;
}
