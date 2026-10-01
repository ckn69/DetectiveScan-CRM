import type { Metadata } from "next";
import { Installation } from "@/components/qr/installation";
import { DEMO_ROOMS } from "@/lib/dashboard/demo-data";
import { DEMO_HOTEL } from "@/lib/demo";
import { sectionHref } from "@/lib/nav";
import { demoQrBase } from "@/lib/qr/demo-qr";
import { QR_URL_TEMPLATE } from "@/lib/qr/url";

export const metadata: Metadata = { title: "Mode installation" };

export default async function InstallationPage({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params;
  return (
    <Installation
      base={demoQrBase()}
      template={QR_URL_TEMPLATE}
      rooms={DEMO_ROOMS.map(({ room }) => room)}
      totalRooms={DEMO_HOTEL.rooms}
      hotelName={DEMO_HOTEL.name}
      backHref={sectionHref(hotel, "qr-codes")}
    />
  );
}
