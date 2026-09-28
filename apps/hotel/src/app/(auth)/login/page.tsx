import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DEMO_HOTEL } from "@/lib/demo";
import { hasDemoSession } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await hasDemoSession()) redirect(`/${DEMO_HOTEL.slug}/dashboard`);

  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">Connexion</h1>
        <p className="text-[15px] text-fg-2">Accédez à l'espace de votre hôtel.</p>
      </div>
      <LoginForm />
    </div>
  );
}
