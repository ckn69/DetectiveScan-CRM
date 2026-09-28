# DetectiveScan · Plateforme

Plateforme SaaS B2B pour les hôtels membres : espace hôtelier, back-office DetectiveScan et API joueur (QR codes en chambre).

## Où on en est

Le développement avance étape par étape : chaque étape livre une section complète avant d'ouvrir la suivante.

| Étape | Contenu | Statut |
| --- | --- | --- |
| 1 | Fondations, design system, connexion, navigation de l'espace hôtelier | Livrée (mode démo) |
| 2 | Dashboard : chiffres clés, courbe, entonnoir, chambres, dernières parties, filtre de période | Livrée (mode démo) |
| 3 | QR codes & chambres : saisie, import CSV, mode installation | À venir |
| 4 | Campagnes (écran de 3 secondes) | À venir |
| 5 | Avis clients, Analytics | À venir |
| 6 | Abonnement Stripe, support, paramètres, notifications | À venir |
| 7 | Back-office : hôtels, onboarding clients | À venir |
| 8 | API joueur + script du site du jeu | À venir |
| — | Comptes réels (Supabase) | Dès que le projet Supabase existe |

## Structure

```
apps/hotel        Espace hôtelier (Next.js) → app.detectivescan.com
packages/ui       Design system : tokens (styles.css) et composants
docs/cadrage      Dossier de cadrage v1.2 (HTML)
PRODUCT.md        Fiche produit
DESIGN.md         Design system documenté
.impeccable/      Brief de surface et direction visuelle
```

## Lancer en local

Prérequis : Node 20.9 ou plus, pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm dev          # http://localhost:3000 puis « Explorer la démo »
pnpm build        # build de production
pnpm typecheck    # vérification TypeScript
```

## Déployer sur Vercel

1. Vercel → **Add New → Project** → importer `ckn69/DetectiveScan-CRM`.
2. **Root Directory** : `apps/hotel` (Next.js est détecté automatiquement).
3. Aucune variable d'environnement n'est nécessaire tant que le mode démo est actif.
4. **Settings → Domains** : ajouter `app.detectivescan.com`.

## Mode démo

Tant que la base de données n'est pas branchée, l'espace s'ouvre avec le bouton « Explorer la démo » et affiche des données fictives, étiquetées « Hôtel Démo ». La connexion par e-mail et mot de passe s'activera avec Supabase (voir `apps/hotel/.env.example`).
