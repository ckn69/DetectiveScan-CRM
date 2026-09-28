"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DEMO_HOTEL } from "./demo";
import { DEMO_COOKIE } from "./session";

const EMAIL_ERROR = "Saisissez une adresse e-mail valide, par exemple nom@hotel.fr.";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
};

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const parsed = z
    .object({
      email: z.email({ error: EMAIL_ERROR }),
      password: z.string().min(1, { error: "Saisissez votre mot de passe." }),
    })
    .safeParse({ email, password });

  if (!parsed.success) {
    const errors = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      email,
      fieldErrors: { email: errors.email?.[0], password: errors.password?.[0] },
    };
  }

  // Étape « comptes réels » : Supabase Auth (signInWithPassword) puis redirection
  // vers l'hôtel du membre. En attendant, la plateforme tourne en mode démo.
  return {
    status: "error",
    email,
    message: "Connexion indisponible en mode démo. Utilisez « Explorer la démo » ci-dessous.",
  };
}

export async function enterDemo(): Promise<void> {
  const store = await cookies();
  store.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(`/${DEMO_HOTEL.slug}/dashboard`);
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(DEMO_COOKIE);
  redirect("/login");
}

export type ResetState = {
  status: "idle" | "error" | "sent";
  error?: string;
  email?: string;
};

export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!z.email().safeParse(email).success) {
    return { status: "error", email, error: EMAIL_ERROR };
  }

  // Étape « comptes réels » : envoi du lien de réinitialisation (Supabase resetPasswordForEmail).
  return { status: "sent", email };
}
