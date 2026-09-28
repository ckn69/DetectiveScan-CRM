"use client";

import { Button, describedBy, Field, Input, PasswordInput } from "@detectivescan/ui";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enterDemo, type LoginState, signIn } from "@/lib/auth-actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const emailError = state.fieldErrors?.email;
  const passwordError = state.fieldErrors?.password;

  return (
    <div className="grid gap-7">
      <form action={formAction} noValidate className="grid gap-5">
        {state.message ? (
          <div
            role="alert"
            className="flex gap-3 rounded-md border border-red-text/30 bg-red-soft p-3.5 text-[13.5px] leading-relaxed text-fg"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-text" strokeWidth={1.75} aria-hidden />
            <p>{state.message}</p>
          </div>
        ) : null}

        <Field id="email" label="Adresse e-mail" error={emailError}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@votre-hotel.fr"
            defaultValue={state.email}
            required
            invalid={Boolean(emailError)}
            aria-describedby={describedBy("email", { error: emailError })}
          />
        </Field>

        <Field id="password" label="Mot de passe" error={passwordError}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            invalid={Boolean(passwordError)}
            aria-describedby={describedBy("password", { error: passwordError })}
          />
        </Field>

        <Button type="submit" size="lg" loading={pending} className="mt-1 w-full">
          {pending ? "Connexion…" : "Se connecter"}
        </Button>

        <Link
          href="/forgot-password"
          className="justify-self-center rounded-sm text-[13px] text-fg-2 underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Mot de passe oublié ?
        </Link>
      </form>

      <div className="flex items-center gap-3 text-[12px] text-fg-3" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <form action={enterDemo} className="grid gap-3">
        <p className="text-[13px] leading-relaxed text-fg-3">
          Les comptes des hôtels ne sont pas encore activés. Découvrez l'espace avec les données fictives de l'Hôtel Démo.
        </p>
        <DemoButton />
      </form>
    </div>
  );
}

function DemoButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" size="lg" loading={pending} className="w-full">
      {pending ? "Ouverture…" : "Explorer la démo"}
    </Button>
  );
}
