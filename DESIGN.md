---
name: DetectiveScan
description: "Espace des hôtels membres : un dashboard SaaS classique joué droit, fond noir, textes blancs et gris, rouge réservé à l'action."
colors:
  red: "#e50914"
  red-hover: "#c8070f"
  red-press: "#a8060d"
  red-text: "#ff4d55"
  red-soft: "rgb(229 9 20 / 0.14)"
  chrome: "#000000"
  canvas: "#0a0a0a"
  surface: "#141414"
  raised: "#1c1c1c"
  line: "rgb(255 255 255 / 0.08)"
  line-strong: "rgb(255 255 255 / 0.14)"
  fg: "#ffffff"
  fg-2: "#b3b3b3"
  fg-3: "#8c8c8c"
  success: "#46d369"
  warning: "#f5a524"
typography:
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.015em"
  page-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  nav:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13.5px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  group-label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "9999px"
spacing:
  "0.5": "2px"
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "7": "28px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.fg}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
  button-primary-active:
    backgroundColor: "{colors.red-press}"
  button-secondary:
    backgroundColor: "rgb(255 255 255 / 0.10)"
    textColor: "{colors.fg}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-secondary-hover:
    backgroundColor: "rgb(255 255 255 / 0.16)"
  button-secondary-active:
    backgroundColor: "rgb(255 255 255 / 0.22)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg-2}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-ghost-hover:
    backgroundColor: "rgb(255 255 255 / 0.08)"
    textColor: "{colors.fg}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.red-text}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-danger-hover:
    backgroundColor: "{colors.red-soft}"
  button-sm:
    height: "32px"
    padding: "0 12px"
  button-lg:
    height: "48px"
    padding: "0 20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 14px"
  badge:
    backgroundColor: "rgb(255 255 255 / 0.08)"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.full}"
    height: "24px"
    padding: "0 10px"
  badge-red:
    backgroundColor: "{colors.red-soft}"
    textColor: "{colors.red-text}"
  badge-success:
    backgroundColor: "rgb(70 211 105 / 0.12)"
    textColor: "{colors.success}"
  badge-warning:
    backgroundColor: "rgb(245 165 36 / 0.12)"
    textColor: "{colors.warning}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.fg-2}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 12px"
  nav-item-hover:
    backgroundColor: "rgb(255 255 255 / 0.05)"
    textColor: "{colors.fg}"
  nav-item-active:
    backgroundColor: "rgb(255 255 255 / 0.09)"
    textColor: "{colors.fg}"
  sidebar:
    backgroundColor: "{colors.chrome}"
    width: "248px"
  sidebar-rail:
    backgroundColor: "{colors.chrome}"
    width: "72px"
  topbar:
    backgroundColor: "{colors.canvas}"
    height: "64px"
    padding: "0 32px"
  topbar-mobile:
    backgroundColor: "{colors.canvas}"
    height: "56px"
    padding: "0 16px"
  mobile-nav:
    backgroundColor: "{colors.chrome}"
    height: "64px"
  mobile-nav-action:
    backgroundColor: "{colors.red}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    size: "52px"
  mobile-nav-action-open:
    backgroundColor: "{colors.red-press}"
  tooltip:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  popover-actions:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.lg}"
    padding: "8px"
    width: "320px"
  menu-account:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.md}"
    padding: "6px"
    width: "256px"
  menu-item:
    backgroundColor: "transparent"
    textColor: "{colors.fg-2}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 12px"
  menu-item-hover:
    backgroundColor: "rgb(255 255 255 / 0.08)"
    textColor: "{colors.fg}"
  avatar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    size: "36px"
  demo-banner:
    backgroundColor: "rgb(20 20 20 / 0.70)"
    textColor: "{colors.fg-2}"
    padding: "10px 32px"
---

# Design System: DetectiveScan

## Overview

**Creative North Star: "La réception de nuit"**

DetectiveScan est un dashboard SaaS classique, joué droit, au niveau de finition de Linear, Stripe et Ramp, dans la palette inspirée de Netflix choisie par l'utilisateur : fond noir, textes blancs et gris, rouge pour les boutons. L'image directrice est une réception d'hôtel la nuit : ce qui ne sert pas est éteint, chaque chose est à sa place, et une seule lumière rouge indique où agir. La métaphore règle l'ambiance (calme, sombre, précise), jamais l'imagerie : l'interface ne montre ni décor d'hôtel, ni cinéma, ni enquête.

La densité est celle d'un outil de travail : corps de 14px, éléments de navigation de 40px, une seule famille (Geist). La profondeur vient de quatre paliers de noir et de filets blancs translucides ; une seule ombre existe, pour ce qui flotte. Le rouge a trois rôles : agir (l'aplat du bouton principal, le focus des champs), situer (l'icône de l'élément actif), alerter (erreurs, déconnexion) ; il signe aussi la marque. Tout le reste est blanc ou gris. Le mouvement est bref et fonctionnel (150ms) et s'efface quand l'utilisateur demande moins d'animations.

Le thème est unique et sombre, par choix de l'utilisateur (`color-scheme: dark`, aucun thème clair). Tokens et composants vivent dans `packages/ui` (`@detectivescan/ui` : bloc `@theme` Tailwind v4 dans `styles.css`, composants React) ; la seule surface construite à ce jour est l'espace hôtelier (`apps/hotel`). Refus confirmés par le contrat de direction : le SaaS blanc générique à accent bleu, et le thème décoratif (cinéma, néon, jeu vidéo). La marque est provisoire : aucun logo officiel n'a été fourni.

**Key Characteristics:**
- Cadre noir absolu, contenu sur un noir à peine plus clair, surfaces en deux paliers au-dessus.
- Un seul aplat rouge d'action par vue ; tout rouge en texte ou en icône passe au rouge lisible.
- Geist seul, titres en 600–700 à interlettrage négatif, corps de 14px.
- Plat au repos : filets à 8% et 14% de blanc, `shadow-pop` pour les seuls calques flottants.
- Rayons de 6, 10 et 14px, icônes Lucide au trait 1.75.
- Navigation en trois formes : sidebar de 248px, rail de 72px, barre du bas à bouton central rouge.
- Transitions de 150ms, coupées par `prefers-reduced-motion`.

## Colors

Un noir en quatre paliers, deux gris de texte, et un rouge qui ne sert qu'à agir, situer ou alerter.

### Primary
- **Rouge DetectiveScan** (#e50914, `red`) : aplat du bouton d'action principale (« Se connecter », « Envoyer le lien », « Actions rapides », bouton central mobile) et fond de la marque. Sert aussi de bordure de focus des champs (avec un halo `rgb(229 9 20 / 0.35)` de 3px), de curseur de saisie (`caret-color`) et, à 55%, de fond de sélection de texte. Texte blanc dessus : 4.79:1.
- **Rouge survol** (#c8070f, `red-hover`) : bouton principal au survol (texte blanc 6.01:1).
- **Rouge pressé** (#a8060d, `red-press`) : bouton principal au clic, et bouton central mobile tant que ses actions sont ouvertes (texte blanc 7.79:1).
- **Rouge lisible** (#ff4d55, `red-text`) : tout rouge porté par un trait fin : icône de l'élément de navigation actif, bordure et message d'erreur, « Se déconnecter », variante `danger`, badge rouge. 6.08:1 sur `canvas`, 5.23:1 sur `raised`.
- **Voile rouge** (`rgb(229 9 20 / 0.14)`, `red-soft`) : fond de l'alerte de formulaire, du badge rouge et du survol `danger`, toujours sous du blanc ou du `red-text`.

### Neutral
- **Noir absolu** (#000000, `chrome`) : le cadre : sidebar, barre du bas, écrans d'accès, fond de `html` et `theme-color`.
- **Noir de page** (#0a0a0a, `canvas`) : fond du contenu et de la barre haute.
- **Charbon** (#141414, `surface`) : champs de saisie, avatars, bandeau démo (à 70%).
- **Graphite** (#1c1c1c, `raised`) : popovers, menu du compte, info-bulles : tout ce qui flotte.
- **Filet** (`rgb(255 255 255 / 0.08)`, `line`) : filets de structure (bords de la sidebar, de la barre haute, de la barre du bas et du bandeau démo, séparateurs de listes et de menus, anneau des tuiles d'icône).
- **Filet appuyé** (`rgb(255 255 255 / 0.14)`, `line-strong`) : bordure des champs, des popovers et des info-bulles, anneau des avatars, bordure de la cloche au survol.
- **Blanc** (#ffffff, `fg`) : titres, texte principal, élément actif, texte des boutons. 19.8:1 sur `canvas`.
- **Gris argent** (#b3b3b3, `fg-2`) : texte secondaire, navigation au repos, libellés de champ, textes d'introduction. 9.44:1 sur `canvas`.
- **Gris fumée** (#8c8c8c, `fg-3`) : métadonnées, aides, placeholders, icônes au repos, libellés de groupe, pied de page. 5.48:1 sur `surface`, 5.07:1 sur `raised`.

Les états interactifs posent un voile blanc (`rgb(255 255 255 / x)`) plutôt qu'un nouveau gris : 5% (survol de la navigation), 6% (tuiles d'icône, squelette, survol du déclencheur de compte), 8% (badge neutre, tuiles d'actions rapides, survol des menus et du bouton `ghost`), 9% (élément de navigation actif, cloche active), 10%, 16% et 22% (bouton secondaire au repos, au survol, au clic), 25% (bordure de champ au survol). La barre de défilement est fine, curseur #333333 sur piste transparente.

### Status
- **Vert validé** (#46d369, `success`) et **Ambre** (#f5a524, `warning`) : réservés aux tons du `Badge` (fond à 12%, texte plein), toujours avec un libellé. Aucun écran ne les affiche encore. `--color-info` (#6ea8ff) est déclaré dans `styles.css` mais aucun composant ne l'emploie : il n'est pas repris ici.

### Named Rules
**La règle du rouge réservé.** Hors marque, un seul aplat rouge par vue : celui de l'action principale (dans l'espace hôtelier, « Actions rapides » dès 768px, le bouton central en dessous). La deuxième action d'une vue prend la variante `secondary`, et une section à venir reste entièrement neutre.

**La règle du rouge lisible.** Le rouge en texte, en icône ou en bordure d'erreur est toujours `red-text` (#ff4d55). `red` (#e50914) ne tient que 4.13:1 sur `canvas` : il reste un fond.

**La règle du plancher gris.** Aucun texte plus sombre que `fg-3` (#8c8c8c). Les gris plus sombres (filets, #333333 de la barre de défilement) ne portent jamais de lecture.

## Typography

**Display Font:** Geist (paquet `geist`, chargé par `next/font/local`, fonte variable 100–900 exposée en `--font-geist-sans`), avec ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
**Body Font:** Geist, même pile
**Label/Mono Font:** aucune en usage. Geist Mono est chargée (`--font-mono`) mais aucun élément ne l'emploie.

**Character:** Une grotesque technique, nette et neutre, qui laisse le noir et le rouge porter l'identité. La hiérarchie tient au poids et à l'interlettrage négatif des titres, jamais à une seconde voix.

### Hierarchy
- **Headline** (700, 28px, 1.25, -0.02em) : titre des écrans d'accès et d'erreur (« Connexion », « Mot de passe oublié », « Demande enregistrée », « Page introuvable »).
- **Title** (600, 22px, 1.375, -0.015em) : titre de contenu d'une section, limité à 34ch.
- **Page title** (600, 20px dès 768px et 17px en dessous, 1.25, -0.01em) : titre de page dans la barre haute, sur une seule ligne tronquée.
- **Body large** (400, 15px, 1.5 à 1.625) : texte d'introduction des écrans d'accès, texte saisi dans les champs ; les boutons `lg` sont en 15px/600.
- **Body** (400, 14px, 1.5) : corps de base de `body`, listes de contenu ; 14px/600 pour les boutons `md` et les titres d'actions rapides.
- **Nav** (500, 13.5px) : éléments de la sidebar et du menu du compte ; 13.5px/400 pour l'alerte de formulaire.
- **Label** (500, 13px) : libellés de champ ; en 400 pour les aides, les erreurs, les liens secondaires et les notes ; les boutons `sm` sont en 13px/600.
- **Caption** (400, 12px) : métadonnées (ville, rôle, e-mail), pied de page, séparateur « ou » ; 12px/500 pour les badges, 12px/600 pour le titre d'un popover. Les info-bulles (500), le bandeau démo et le détail des actions rapides sont en 12.5px.
- **Group label** (600, 11px, 0.08em, capitales) : libellés de groupe de la sidebar (Pilotage, Expérience, Compte). Les onglets de la barre du bas sont en 11px/500, sans capitales.

Le mot-symbole « DetectiveScan » est en 700, 17px (16px dans la sidebar), -0.02em ; il appartient à la marque provisoire.

### Named Rules
**La règle de la famille unique.** Geist seul, en 400, 500, 600 et 700. Titres en 600–700 avec un interlettrage de -0.01em à -0.02em, texte courant sans interlettrage, `text-wrap: balance` sur h1–h3.

**La règle de la capitale rare.** Les capitales espacées n'existent que pour les libellés de groupe de la sidebar. Aucun sur-titre en capitales au-dessus d'un titre.

Le contrat de direction prévoit des chiffres tabulaires. Aucun écran livré n'affiche encore de données chiffrées : la règle n'est pas encore exercée dans le code, elle sera à confirmer avec le premier écran chiffré.

## Layout

L'application est une grille à deux colonnes, navigation puis contenu (`minmax(0, 1fr)`), qui change de forme à deux seuils :

- **≥ 1280px (`xl`)** : sidebar de 248px avec libellés, collante sur toute la hauteur (`100dvh`).
- **768–1279px (`md`)** : rail d'icônes de 72px ; les libellés passent en info-bulles.
- **< 768px** : plus de colonne de navigation ; barre du bas fixe de 64px (plus la zone sûre) à cinq colonnes : deux onglets, le bouton central rouge, deux onglets.

Gabarits :

- **Barre haute** : collante, 56px sous 768px et 64px au-dessus, marges latérales de 16px puis 32px, filet inférieur, `env(safe-area-inset-top)`. Le bandeau démo la suit sur toute la largeur.
- **Contenu** : marges latérales de 16px puis 32px, 8px en haut, 112px en bas sous 768px (pour dégager la barre du bas) puis 48px.
- **Colonne de lecture** : 640px au maximum, centrée, 32px puis 56px de marge verticale, 28px entre les blocs.
- **Écrans d'accès** : page `chrome`, colonne de 400px de contenu (432px avec ses marges de 16px) centrée horizontalement et ancrée en haut (56px, puis 14vh dès 640px) pour que le titre ne bouge pas quand une erreur apparaît ; marque en haut, mention légale en bas.

**Rythme.** Base de 4px (`--spacing: 0.25rem` de Tailwind v4). Pas récurrents : 2px entre les éléments d'une liste (navigation, menus), 8px entre un libellé et son champ, 12px entre une icône et son texte, 20px entre deux champs, 28 à 32px entre les blocs d'un écran. Cibles : 40px (navigation, menus, bouton `md`), 44px (champs, bouton d'affichage du mot de passe), 48px (bouton `lg`), 52px (bouton central), 64px (onglets mobiles).

**Empilement.** Barre haute `z-30`, barre du bas `z-40`, popovers, info-bulles et lien d'évitement `z-50`. Zones sûres gérées (`viewport-fit=cover`) en haut, en bas et sous le popover mobile.

### Named Rules
**La règle du libellé jamais perdu.** Dans le rail, chaque libellé reste dans le DOM (`sr-only`) et réapparaît en info-bulle au survol comme au focus clavier ; les libellés de groupe y deviennent un filet centré de 32px.

**La règle de l'action au pouce.** Sous 768px, l'action principale quitte la barre haute pour le bouton central de la barre du bas ; les sections absentes de la barre (Analytics, Abonnement) passent dans le menu du compte.

## Elevation & Depth

La profondeur est tonale : quatre paliers de noir, du cadre au flottant, `chrome` (#000000), `canvas` (#0a0a0a), `surface` (#141414), `raised` (#1c1c1c). Le cadre est plus sombre que la page : la navigation recule, le contenu avance. Les états interactifs ajoutent un voile blanc translucide, et les zones se séparent par des filets de 1px. Une seule ombre existe, et elle marque ce qui flotte.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 18px 44px -12px rgb(0 0 0 / 0.85), 0 2px 10px rgb(0 0 0 / 0.55)`, `shadow-pop`) : popover d'actions rapides, menu du compte, info-bulles du rail, bouton central mobile. Rien d'autre.

Les calques flottants sont des popovers natifs (`popover="auto"` : fermeture au clic extérieur et sur Échap). Ils entrent par un fondu et une montée de 4px en 150ms, courbe `ease-out-quint` (`cubic-bezier(0.22, 1, 0.36, 1)`), via `@starting-style` (classe `ds-popover`).

### Named Rules
**La règle de l'ombre unique.** `shadow-pop` est réservée à ce qui flotte au-dessus du contenu. Champs, boutons en ligne, barres et conteneurs restent plats : au repos, la profondeur vient du palier de noir et du filet.

## Shapes

Des rectangles aux angles adoucis, des bordures de 1px, aucune découpe ni silhouette oblique.

- **6px (`rounded-sm`)** : contrôles en ligne (boutons, champs, éléments de navigation et de menu), info-bulles, lien d'évitement, lignes du squelette.
- **10px (`rounded-md`)** : tuiles d'icône de 40 à 48px, cloche, lignes d'actions rapides, menu du compte, déclencheur du compte, alerte de formulaire.
- **14px (`rounded-lg`)** : grandes pièces flottantes : popover d'actions rapides, bouton central mobile.
- **Pilule (`rounded-full`)** : badges, et avatar de l'utilisateur dans la barre haute mobile.

Champs, popovers, info-bulles et cloche portent une vraie bordure de 1px ; avatars, tuiles d'icône et variante `danger` portent un anneau inset de 1px (`ring-inset`). La marque est un carré rouge de 32px aux coins de 7px portant une loupe blanche dont la lentille contient deux modules de QR code ; elle sert aussi de favicon.

### Named Rules
**La règle du rayon qui suit la taille.** 6px pour ce qui s'aligne en ligne, 10px pour les tuiles et les menus, 14px pour les grandes pièces flottantes. Hors de cette échelle, seuls la pilule des badges et le cercle de l'avatar mobile.

## Components

### Buttons
Nets et compacts : aplat, poids 600, aucun relief.
- **Shape:** coins de 6px (`rounded-sm`), icône et libellé espacés de 8px, jamais de retour à la ligne.
- **Sizes:** `sm` 32px de haut, marges de 12px, 13px, icônes de 16px ; `md` 40px, 16px, 14px, icônes de 18px ; `lg` 48px, 20px, 15px, icônes de 20px (boutons pleine largeur des écrans d'accès).
- **Primary:** aplat `red`, texte blanc ; survol `red-hover` ; clic `red-press` et descente de 1px.
- **Secondary:** voile blanc de 10% (16% au survol, 22% au clic), texte `fg` ; la deuxième action d'une vue (« Explorer la démo », « Retour à la connexion »).
- **Ghost:** transparent, texte `fg-2` ; voile de 8% et texte `fg` au survol, 12% au clic. Disponible dans `@detectivescan/ui`, pas encore employé à l'écran.
- **Danger:** transparent, texte `red-text`, anneau inset de 1px en `red-text` à 40%, `red-soft` au survol et au clic. Disponible, pas encore employé ; « Se déconnecter » applique le même `red-text` dans le menu du compte.
- **Hover / Focus:** fond, couleur, ombre et position en 150ms `ease-out` (`cubic-bezier(0, 0, 0.2, 1)`) ; focus clavier en contour blanc de 2px décalé de 2px.
- **Disabled / Loading:** opacité de 45%, sans pointeur. En chargement : `aria-busy`, spinner (rotation de 1s, linéaire) avant le libellé, libellé suivi de points de suspension (« Connexion… », « Envoi… », « Ouverture… »).
- **Lien en bouton:** `buttonClasses({ variant, size })` habille un `<Link>` (« Revenir à l'accueil », « Retour à la connexion »).
- **« Actions rapides » (barre haute):** `primary` `md`, « + », libellé et chevron (marges de 12px à gauche et 10px à droite) ; le chevron pivote de 180° en 200ms quand le popover est ouvert. Masqué sous 768px.

### Chips
- **Style:** badge en pilule de 24px, marges de 10px, 12px/500, sans bordure. Tons : neutre (voile de 8% et `fg-2`), rouge (`red-soft` et `red-text`), succès (`success` à 12% et `success`), alerte (`warning` à 12% et `warning`).
- **State:** étiquette statique, jamais cliquable. En usage : neutre, « Prévu à l'étape N ».

### Cards / Containers
Pas encore de composant carte. Conteneurs présents dans le build :
- **Alerte de formulaire** (`role="alert"`) : coins de 10px, bordure `red-text` à 30%, fond `red-soft`, marge de 14px, texte 13.5px `fg` à 1.625, icône d'alerte de 16px en `red-text`.
- **Tuile d'icône** : 48px, coins de 10px, voile de 6% avec anneau `line` (section à venir) ou voile de 8% (confirmation d'envoi), icône de 24px.
- **Colonne de section** : 640px, blocs espacés de 28px, liste encadrée de deux filets `line` (20px de marge, 12px entre les lignes).
- **Séparateur « ou »** : 12px `fg-3` entre deux filets `line`, sur les écrans d'accès.

### Inputs / Fields
- **Style:** 44px de haut, coins de 6px, bordure de 1px `line-strong`, fond `surface`, marge de 14px, texte 15px `fg`, placeholder `fg-3`, curseur `red`.
- **Focus:** bordure `red` et halo de 3px `rgb(229 9 20 / 0.35)`, sans contour : le seul focus rouge du système. Survol : bordure blanche à 25%. Bordure et halo en 150ms `ease-out`.
- **Error / Disabled:** `aria-invalid` passe la bordure en `red-text` (halo `red-text` à 30% au focus) ; le message s'affiche dessous en 13px `red-text` avec une icône d'alerte de 14px, relié par `aria-describedby`, et remplace l'aide. Désactivé : opacité de 50%, curseur interdit.
- **Field:** grille de 8px : libellé 13px/500 `fg-2`, champ, puis aide 13px `fg-3` ou erreur. Les liens associés (« Mot de passe oublié ? ») se placent après le champ, jamais avant.
- **Password:** bouton d'affichage de 44px dans le bord droit, icône œil de 18px `fg-3` puis `fg` au survol, `aria-pressed`, focus en contour blanc inset.

### Navigation
- **Sidebar (≥ 1280px):** 248px, `chrome`, filet droit, collante. En-tête de 64px : symbole de 32px et mot-symbole. Bloc hôtel : avatar, nom 13px/600 `fg`, ville et chambres 12px `fg-3`. Groupes : libellé 11px en capitales `fg-3`, 20px entre deux groupes. Éléments : 40px, marges de 12px, icône de 18px et libellé 13.5px/500 espacés de 12px. Repos : texte `fg-2`, icône `fg-3`. Survol : voile de 5%, texte `fg`, icône `fg-2`. Actif (`aria-current="page"`) : voile de 9%, texte `fg`, icône `red-text`. Focus : contour blanc inset (-2px). Pied : déclencheur du compte (avatar, nom court 13px/600, rôle 12px `fg-3`, chevrons haut-bas), filet supérieur, marge de 12px.
- **Rail (768–1279px):** 72px, icônes centrées, libellés `sr-only`, groupes séparés par un filet centré de 32px, symbole seul en tête. Info-bulle : `raised`, bordure `line-strong`, coins de 6px, marges de 6px et 10px, 12.5px/500 `fg`, `shadow-pop`, à 12px à droite de l'élément, fondu de 150ms au survol et au `focus-visible`, `aria-hidden` (le libellé est déjà dans le lien) ; masquée dès 1280px.
- **Barre haute:** `canvas`, filet inférieur ; titre de page ; cloche carrée de 36px (40px dès 768px), coins de 10px, bordure `line` (`line-strong` et `fg` au survol ; `line-strong`, voile de 9% et `fg` sur la page Notifications) ; bouton rouge « Actions rapides » dès 768px. Sous 768px : avatar de l'hôtel (32px) à gauche, nom de l'hôtel en 12px `fg-3` sous le titre, avatar rond de l'utilisateur (32px) à droite, qui ouvre le menu du compte.
- **Barre du bas (< 768px):** fixe, `chrome`, filet supérieur, 64px plus la zone sûre, cinq colonnes. Onglets : icône de 22px et libellé court 11px/500 (« QR », « Avis ») espacés de 4px ; repos `fg-3`, survol `fg-2`, actif `fg` avec icône `red-text` ; focus en contour blanc inset (-4px).
- **Liens secondaires:** 13px `fg-2`, `fg` au survol ; « Mot de passe oublié ? » se souligne au survol (décalage de 4px), le lien retour porte une flèche de 16px.
- **Lien d'évitement:** « Aller au contenu », fixé à 16px du coin haut gauche, aplat blanc, texte noir 14px/600, coins de 6px, caché au-dessus de l'écran jusqu'au focus, contour rouge de 2px au focus : le seul aplat blanc du système.

### Actions rapides
La pièce signature : une même liste de trois raccourcis, ouverte depuis la barre haute (≥ 768px) ou le bouton central (< 768px).
- **Bouton central:** 52px, coins de 14px, `red`, `shadow-pop`, relevé de 28px au-dessus de la barre ; « + » de 24px au trait 2, qui pivote de 45° (et devient ×) en 200ms à l'ouverture ; fond `red-press` tant que la liste est ouverte ; nom accessible « Actions rapides » puis « Fermer les actions rapides ».
- **Popover:** `raised`, bordure `line-strong`, coins de 14px, marge de 8px, `shadow-pop`. 320px, sous la barre haute, à 32px du bord droit (desktop) ; pleine largeur moins 12px de chaque côté, à 84px du bas plus la zone sûre (mobile).
- **Contenu:** titre « Actions rapides » 12px/600 `fg-3` ; lignes à marge de 10px, coins de 10px, voile de 8% au survol ; tuile de 40px (coins de 10px, voile de 8%, icône de 20px `fg`) ; intitulé 14px/600 `fg` et détail 12.5px `fg-3`. Le popover se referme au choix d'une action.

### Menu du compte
- 256px, `raised`, bordure `line-strong`, coins de 10px, marge de 6px, `shadow-pop` ; au-dessus du pied de la sidebar (76px du bas, 12px de la gauche) ou sous la barre haute mobile (60px du haut, 12px de la droite).
- En-tête : nom 13.5px/600 `fg`, e-mail 12px `fg-3`, filet inférieur. Éléments : 40px, 13.5px/500 `fg-2`, icône de 16px `fg-3` ; survol voile de 8% et `fg`. Un filet isole « Se déconnecter », en `red-text`.

### Bandeau démo
- Bande pleine largeur sous la barre haute : `surface` à 70%, filet inférieur, marges de 10px et 16px (32px dès 768px). Icône d'information de 16px `fg-3`, texte 12.5px `fg-2` à 1.375, « Mode démo » en 600 `fg` ; la seconde phrase n'apparaît que dès 768px. Présent tant que les données sont fictives.

### Section à venir et squelette
- **Section à venir:** colonne de 640px ; tuile d'icône de 48px ; titre de 22px ; contenus prévus entre deux filets, chacun précédé d'un cercle pointillé de 16px `fg-3`, texte 14px `fg-2` ; badge neutre « Prévu à l'étape N » et note 13px `fg-3`. Volontairement sans rouge.
- **Squelette** (`loading.tsx`) : même gabarit, blocs en voile de 5 à 6%, coins de 6px et 10px, pulsation `animate-pulse` (2s) coupée sous `prefers-reduced-motion`, `role="status"`.

### Avatars et marque
- **Avatar:** pastille d'initiales de 36px (32px dans la barre haute mobile), fond `surface`, anneau inset de 1px `line-strong`, initiales 12px/700 à 0.02em `fg`. Rayon actuel de 8px, hors échelle : écart relevé, pas une règle. L'avatar de l'utilisateur est rond dans la barre haute mobile.
- **Marque (provisoire):** symbole rouge de 32px et mot-symbole blanc espacés de 10px ; le symbole seul dans le rail.

### Icônes
- Lucide (`lucide-react`), au trait. Trait de 1.75 posé explicitement sur la navigation, les menus, les actions rapides, les tuiles et le bandeau. Tailles : 14px (erreur de champ), 16px (menus, bandeau, alertes, boutons `sm`), 18px (sidebar, cloche, boutons `md`, œil), 20px (actions rapides, boutons `lg`), 22px (onglets mobiles), 24px (tuiles, bouton central).
- Toujours `aria-hidden` : le libellé porte le sens. Exception voulue : le « + » du bouton central, au trait 2. Les icônes utilitaires (chevrons, œil, flèche retour, alerte) héritent aujourd'hui du trait par défaut de Lucide (2) : écart relevé, pas une règle.

## Do's and Don'ts

### Do:
- **Réserver** l'aplat `red` (#e50914) à une seule action principale par vue, hors marque ; la deuxième action prend la variante `secondary`.
- **Écrire** tout rouge de texte, d'icône ou de bordure d'erreur en `red-text` (#ff4d55).
- **Marquer** le focus clavier d'un contour blanc de 2px décalé de 2px (inset dans les listes) ; pour les champs, bordure `red` et halo de 3px à 35%.
- **Accompagner** chaque erreur ou état d'une icône et d'un texte, reliés au champ par `aria-describedby` : jamais la couleur seule.
- **Séparer** les zones par un palier de noir et un filet (`line` à 8%, `line-strong` à 14%), pas par une ombre.
- **Poser** les icônes Lucide au trait 1.75, en `aria-hidden`.
- **Tenir** les transitions d'état à 150ms (200ms pour les rotations de chevron et de « + ») et laisser `prefers-reduced-motion` les couper.
- **Garder** chaque destination nommée à toutes les tailles : libellé visible (≥ 1280px), info-bulle au survol et au focus (rail), libellé court (barre du bas).

### Don't:
- **Ne pas** poser un second aplat rouge dans une vue, ni employer le rouge en décor (fond de section, illustration, section à venir).
- **Ne pas** écrire de texte en `red` (#e50914) sur noir : 4.13:1 sur `canvas`, sous le seuil AA.
- **Ne pas** écrire de texte plus sombre que `fg-3` (#8c8c8c).
- **Ne pas** donner d'ombre à ce qui repose dans la page (champs, boutons en ligne, barres, conteneurs) : `shadow-pop` est réservée aux popovers, aux info-bulles et au bouton central mobile.
- **Ne pas** introduire de thème clair, d'accent bleu pour les liens ou les actions, ni de famille de caractères autre que Geist.
- **Ne pas** habiller l'interface d'un thème décoratif (cinéma, néon, jeu vidéo) : ni grain, ni lueur, ni texture, ni typographie fantaisie.
- **Ne pas** placer de sur-titre en capitales au-dessus d'un titre : les capitales espacées sont réservées aux libellés de groupe de la sidebar.
- **Ne pas** remplacer une icône par un caractère ou un emoji : toute icône est un SVG Lucide, la marque mise à part.
