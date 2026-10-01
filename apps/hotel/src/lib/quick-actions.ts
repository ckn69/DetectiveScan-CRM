import { LifeBuoy, type LucideIcon, Megaphone, ScanLine } from "lucide-react";

/**
 * Actions rapides, partagées par la barre haute (desktop) et le bouton central (mobile).
 * `path` mène à une page précise de la section (sinon, à son accueil).
 */
export const QUICK_ACTIONS: Array<{ slug: string; path?: string; title: string; detail: string; icon: LucideIcon }> = [
  { slug: "campaigns", title: "Nouvelle campagne", detail: "Restaurant, spa, événement…", icon: Megaphone },
  {
    slug: "qr-codes",
    path: "installation",
    title: "Scanner un QR code",
    detail: "L'associer à une chambre",
    icon: ScanLine,
  },
  { slug: "support", title: "Signaler un problème", detail: "QR abîmé, jeu bloqué…", icon: LifeBuoy },
];
