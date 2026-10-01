import type { Metadata } from "next";
import { QrManager } from "@/components/qr/qr-manager";
import { DEMO_ROOMS, demoQrActivity } from "@/lib/dashboard/demo-data";
import { hotelNow } from "@/lib/dates";
import { DEMO_HOTEL } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";
import { demoQrBase } from "@/lib/qr/demo-qr";
import { QR_URL_TEMPLATE } from "@/lib/qr/url";

export const metadata: Metadata = { title: "QR codes & chambres" };

/** Quel QR est dans quelle chambre, combien chacun est scanné ; ajout, import CSV et mode installation. */
export default async function QrCodesPage({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params;
  const href = sectionHref(hotel, "qr-codes");

  return (
    <QrManager
      base={demoQrBase()}
      activity={demoQrActivity(hotelNow())}
      template={QR_URL_TEMPLATE}
      rooms={DEMO_ROOMS.map(({ room }) => room)}
      totalRooms={DEMO_HOTEL.rooms}
      importHref={`${href}/import`}
      installHref={`${href}/installation`}
    />
  );
}
