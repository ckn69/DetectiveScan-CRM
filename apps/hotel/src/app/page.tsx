import { redirect } from "next/navigation";
import { DEMO_HOTEL } from "@/lib/demo";
import { hasDemoSession } from "@/lib/session";

export default async function Home() {
  redirect((await hasDemoSession()) ? `/${DEMO_HOTEL.slug}/dashboard` : "/login");
}
