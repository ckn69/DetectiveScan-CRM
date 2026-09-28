import { cookies } from "next/headers";

/**
 * Session du mode démo (étape 1). Les comptes réels (Supabase Auth) remplaceront
 * ce cookie à l'étape « comptes » ; l'espace hôtelier est déjà protégé par ce contrôle.
 */
export const DEMO_COOKIE = "ds_demo";

export async function hasDemoSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value === "1";
}
