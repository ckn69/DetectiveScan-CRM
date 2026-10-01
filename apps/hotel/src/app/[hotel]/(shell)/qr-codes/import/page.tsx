import type { Metadata } from "next";
import { CsvImport } from "@/components/qr/csv-import";
import { sectionHref } from "@/lib/nav";
import { demoQrBase } from "@/lib/qr/demo-qr";
import { QR_URL_TEMPLATE } from "@/lib/qr/url";

export const metadata: Metadata = { title: "Importer des QR codes" };

export default async function QrImportPage({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params;
  return (
    <CsvImport
      base={demoQrBase()}
      template={QR_URL_TEMPLATE}
      backHref={sectionHref(hotel, "qr-codes")}
      templateHref="/modele-qr-codes.csv"
    />
  );
}
