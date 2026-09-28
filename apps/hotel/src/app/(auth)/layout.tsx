import { Logo } from "@detectivescan/ui";
import Link from "next/link";

/**
 * Écrans d'accès : fond noir, colonne de 400 px ancrée en haut
 * (le titre ne bouge pas quand une erreur apparaît).
 */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-chrome">
      <div className="mx-auto flex min-h-dvh w-full max-w-[432px] flex-col px-4 py-8 sm:py-10">
        <header>
          <Link
            href="/login"
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Logo />
          </Link>
        </header>
        <main className="flex-1 pb-12 pt-14 sm:pt-[14vh]">{children}</main>
        <footer className="text-[12px] text-fg-3">© 2026 DetectiveScan · Espace réservé aux hôtels membres</footer>
      </div>
    </div>
  );
}
