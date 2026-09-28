import { Logo } from "@detectivescan/ui";
import Link from "next/link";

/** Écrans d'accès : fond noir, colonne centrée de 400 px. */
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-chrome">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(56%_70%_at_50%_0%,rgb(229_9_20/0.16),transparent_72%)]"
      />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[432px] flex-col px-4 py-8 sm:py-10">
        <header>
          <Link
            href="/login"
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Logo />
          </Link>
        </header>
        <main className="flex flex-1 flex-col justify-center py-12">{children}</main>
        <footer className="text-[12px] text-fg-3">© 2026 DetectiveScan · Espace réservé aux hôtels membres</footer>
      </div>
    </div>
  );
}
