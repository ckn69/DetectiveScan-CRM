# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Validé par l'utilisateur (cadrage v1.2) : monorepo Turborepo + pnpm, Next.js (App Router) + TypeScript strict, Tailwind CSS, Supabase en région UE (Postgres + RLS, Auth, Storage) via Drizzle ORM, déploiement Vercel, dépôt GitHub `ckn69/DetectiveScan-CRM`. On commence par l'espace hôtelier ; le back-office et l'API joueur suivent. Pas encore de projet Supabase : le développement avance en **mode démo** (données fictives), les clés seront branchées plus tard.

## Users

- **Hôteliers membres** (directeur, responsable marketing, réception) : vérifient si leurs clients jouent, s'ils aiment l'expérience, et poussent les services de l'hôtel (restaurant, spa, bar) via des campagnes. Ordinateur au bureau, téléphone pour un coup d'œil ou pendant l'installation des QR.
- **Équipe DetectiveScan** (fondateurs, ops, support, commerciaux) : crée et installe les hôtels, suit l'onboarding et l'essai d'un mois, gère QR, abonnements, support.
- **Joueurs** (clients de l'hôtel) : scannent un QR en chambre et jouent une enquête sur le site du jeu, sans compte, souvent le soir sur téléphone.

## Product Purpose

DetectiveScan installe des chasses au trésor / enquêtes immersives via QR codes en chambre d'hôtel pour augmenter la satisfaction client et le chiffre d'affaires de l'hôtel. La plateforme donne à l'hôtelier la preuve que ça marche (scans, joueurs, participation, satisfaction, clics sur ses campagnes) et donne à l'équipe DetectiveScan un outil pour intégrer, suivre et convertir chaque hôtel. Succès : un hôtel voit en 10 secondes si l'expérience fonctionne chez lui, et un essai se convertit en abonnement.

## Positioning

La seule plateforme qui relie un QR code physique posé dans une chambre précise à un scan, un joueur, une partie, un avis et une campagne de l'hôtel (chaîne QR → chambre → scan → joueur → partie → résultat → avis → campagne → performance). L'hôtel communique pendant les 3 secondes qui précèdent l'enquête, au moment où le client est le plus disponible.

## Operating Context

- Modèle : **essai gratuit d'un mois, puis abonnement Stripe à 50 € par hôtel** (prix ajustable hôtel par hôtel ; Qonto s'ajoutera plus tard). HT/TTC, périodicité et engagement restent à confirmer.
- L'espace hôtelier est **réservé aux hôtels membres**. En fin d'essai sans paiement, l'équipe DetectiveScan **coupe les QR** de l'hôtel depuis le back-office ; le paiement les réactive.
- Vente accompagnée : l'équipe crée l'hôtel, enregistre chambres et QR (saisie manuelle ou import CSV), installe, teste, puis invite l'hôtelier. Module **Onboarding clients** côté back-office.
- Le jeu tourne déjà sur le site DetectiveScan (HTML statique sur Vercel, domaine personnalisé, code sur GitHub). La plateforme s'y branche par un **script** (scan, campagne 3 s, suivi des parties, avis) sans redirection.
- Format d'identifiant QR connu : `01-254-00` (QR) associé à une chambre (ex. `12`).

## Capabilities and Constraints

- Trois applications : `app.` (espace hôtelier), `admin.` (back-office), `go.` (API joueur + script). Multi-tenant par `hotel_id` avec Row Level Security.
- Rôles : Super Admin, Admin, Support, Sales (plateforme) ; Hotel Admin, Hotel Staff (hôtel).
- Données joueurs pseudonymes par défaut ; nom/téléphone uniquement avec consentement, masqués pour le staff, purgés automatiquement (RGPD, hébergement UE).
- Navigateurs cibles : Chrome, Safari, Firefox, Edge ; desktop, tablette, mobile. Pas d'application native.
- MVP / V2 / V3 définis dans `docs/cadrage/index.html` (CRM, agenda, signature, coffre-fort en V2).
- **Ouvert** : chaque QR posé a-t-il sa propre URL (nécessaire pour savoir quelle chambre joue) ; accès au dépôt GitHub du site du jeu ; tarif HT ou TTC.

## Brand Commitments

- Nom : **DetectiveScan**.
- Direction visuelle imposée par l'utilisateur : **inspirée de Netflix** — fond noir, textes blancs et gris, rouge pour les boutons ; le reste est délégué.
- Ton : direct, pro, neutre, en français. Premium, hôtelier, mystérieux, élégant, jamais « jeu vidéo kitsch ».

## Evidence on Hand

- Dossier de cadrage v1.2 : `docs/cadrage/index.html` (analyse, rôles, sitemap, parcours, dashboards, base de données, architecture, risques).
- Aucun client, témoignage, logo officiel, capture ou chiffre réel n'est disponible dans le dépôt : toute donnée affichée est **fictive et étiquetée comme telle** (« Hôtel Démo »). Ne pas inventer de clients, de résultats ou de prix autres que les 50 € confirmés.

## Product Principles

1. **La preuve avant tout** : chaque écran hôtelier répond à « mes clients jouent-ils, aiment-ils, est-ce que ça rapporte ? ».
2. **Un hôtel ne voit que son hôtel** : isolation des données garantie par la base, pas seulement par le code.
3. **Discret par défaut** : aucune donnée personnelle affichée sans nécessité ni droit.
4. **Étape par étape** : on livre une section complète et utilisable avant d'ouvrir la suivante.
5. **Sans friction pour le joueur** : l'enquête démarre en quelques secondes, sans compte.

## Accessibility & Inclusion

Cible WCAG 2.2 AA : contrastes ≥ 4,5:1 pour le texte, navigation clavier complète, focus visible, respect de « réduire les animations », libellés explicites (pas d'information portée par la couleur seule).
