import { buttonClasses, Logo } from "@detectivescan/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[400px] flex-col justify-center gap-8 px-4 py-10">
      <Logo />
      <div className="grid gap-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">Page introuvable</h1>
        <p className="text-[15px] text-fg-2">Cette adresse ne correspond à aucune page de votre espace. Elle a peut-être changé.</p>
      </div>
      <Link href="/" className={buttonClasses({ size: "lg", className: "w-full" })}>
        Revenir à l'accueil
      </Link>
    </main>
  );
}
