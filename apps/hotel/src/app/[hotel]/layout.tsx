import { notFound, redirect } from "next/navigation";
import { DEMO_HOTEL } from "@/lib/demo";
import { hasDemoSession } from "@/lib/session";

/**
 * Espace d'un hôtel. L'hôtel fait partie de l'URL : chaque requête vérifie
 * que la session a bien accès à cet hôtel avant de rendre quoi que ce soit.
 * La mise en page vient des groupes : `(shell)` (navigation complète) et
 * `(focus)` (plein écran, pour une tâche sur le terrain comme la pose des QR).
 */
export default async function HotelLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ hotel: string }> }>) {
  const { hotel } = await params;
  if (!(await hasDemoSession())) redirect("/login");
  if (hotel !== DEMO_HOTEL.slug) notFound();
  return children;
}
