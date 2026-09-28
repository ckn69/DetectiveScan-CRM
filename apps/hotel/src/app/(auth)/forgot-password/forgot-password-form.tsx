"use client";

import { Button, buttonClasses, describedBy, Field, Input } from "@detectivescan/ui";
import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, type ResetState } from "@/lib/auth-actions";

const initialState: ResetState = { status: "idle" };

const backLinkClasses =
  "inline-flex items-center gap-2 justify-self-start rounded-sm text-[13px] text-fg-2 transition-colors hover:text-fg " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.status === "sent") {
    return (
      <div className="grid gap-8" role="status">
        <span className="flex size-12 items-center justify-center rounded-md bg-white/8 text-fg">
          <MailCheck className="size-6" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="grid gap-2">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">Demande enregistrée</h1>
          <p className="text-[15px] leading-relaxed text-fg-2">
            En mode démo, aucun e-mail n'est envoyé. Une fois les comptes activés, un lien pour choisir un nouveau mot
            de passe arrivera à <span className="font-medium text-fg">{state.email}</span>.
          </p>
        </div>
        <Link href="/login" className={buttonClasses({ variant: "secondary", size: "lg", className: "w-full" })}>
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <Link href="/login" className={backLinkClasses}>
        <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
        Connexion
      </Link>
      <div className="grid gap-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">Mot de passe oublié</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Saisissez l'adresse e-mail de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.
        </p>
      </div>
      <form action={formAction} noValidate className="grid gap-5">
        <Field id="email" label="Adresse e-mail" error={state.error}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@votre-hotel.fr"
            defaultValue={state.email}
            required
            invalid={Boolean(state.error)}
            aria-describedby={describedBy("email", { error: state.error })}
          />
        </Field>
        <Button type="submit" size="lg" loading={pending} className="w-full">
          {pending ? "Envoi…" : "Envoyer le lien"}
        </Button>
      </form>
    </div>
  );
}
