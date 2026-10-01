---
name: DetectiveScan
description: "Espace des hôtels membres : un dashboard SaaS classique joué droit, fond noir, textes blancs et gris, rouge réservé à l'action, données en un seul bleu."
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
  viz-1: "#256abf"
  viz-2: "#6da7ec"
  viz-3: "#9ec5f4"
  viz-4: "#cde2fb"
typography:
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  metric:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1
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
  page-title-mobile:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  panel-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.375
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
  input-touch:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
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
  axis:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  group-label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
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
  "6": "24px"
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
  input-date:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 12px"
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
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "20px"
  card-mobile:
    padding: "16px"
  notice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg-2}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  segmented:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "4px"
  segmented-item:
    backgroundColor: "transparent"
    textColor: "{colors.fg-2}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "32px"
    padding: "0 12px"
  segmented-item-hover:
    backgroundColor: "rgb(255 255 255 / 0.05)"
    textColor: "{colors.fg}"
  segmented-item-active:
    backgroundColor: "rgb(255 255 255 / 0.09)"
    textColor: "{colors.fg}"
  chart-tooltip:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
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
    rounded: "{rounded.md}"
    size: "36px"
  demo-banner:
    backgroundColor: "rgb(20 20 20 / 0.70)"
    textColor: "{colors.fg-2}"
    padding: "10px 32px"
  sheet:
    backgroundColor: "{colors.raised}"
    width: "440px"
  toast:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  input-touch:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.input-touch}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 14px"
  dropzone:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "40px 24px"
  scanner:
    backgroundColor: "{colors.chrome}"
    rounded: "{rounded.md}"
---

# Design System: DetectiveScan

## Overview

**Creative North Star: "La réception de nuit"**

DetectiveScan est un dashboard SaaS classique, joué droit, au niveau de finition de Linear, Stripe et Ramp, dans la palette inspirée de Netflix choisie par l'utilisateur : fond noir, textes blancs et gris, rouge pour les boutons. L'image directrice est une réception d'hôtel la nuit : ce qui ne sert pas est éteint, chaque chose est à sa place, et une seule lumière rouge indique où agir. La métaphore règle l'ambiance (calme, sombre, précise), jamais l'imagerie : l'interface ne montre ni décor d'hôtel, ni cinéma, ni enquête.

La densité est celle d'un outil de travail : corps de 14px, éléments de navigation de 40px, une seule famille (Geist). La profondeur vient de quatre paliers de noir et de filets blancs translucides ; une seule ombre existe, pour ce qui flotte. Le rouge a trois rôles : agir (l'aplat du bouton principal, le focus des champs), situer (l'icône de l'élément actif), alerter (erreurs, baisses, déconnexion) ; il signe aussi la marque. Le texte et la structure sont blancs ou gris ; les données, elles, prennent un seul bleu en quatre nuances, et seulement dans les graphiques : puisque le rouge est réservé à l'action, les chiffres tracés ne peuvent pas le porter. Le mouvement est bref et fonctionnel (150ms) et s'efface quand l'utilisateur demande moins d'animations.

Le thème est unique et sombre, par choix de l'utilisateur (`color-scheme: dark`, aucun thème clair). Tokens et composants vivent dans `packages/ui` (`@detectivescan/ui` : bloc `@theme` Tailwind v4 dans `styles.css`, composants React) ; la seule surface construite à ce jour est l'espace hôtelier (`apps/hotel`) : connexion, navigation, dashboard, et QR codes & chambres (liste, fiche, import CSV, mode installation). Refus confirmés par le contrat de direction : le SaaS blanc générique à accent bleu, et le thème décoratif (cinéma, néon, jeu vidéo). La marque est provisoire : aucun logo officiel n'a été fourni.

**Key Characteristics:**
- Cadre noir absolu, contenu sur un noir à peine plus clair, panneaux et surfaces en deux paliers au-dessus.
- Un seul aplat rouge d'action par vue ; tout rouge en texte ou en icône passe au rouge lisible.
- Données en un seul bleu, quatre nuances ordonnées du scan à la victoire, jamais en dehors des graphiques.
- Geist seul pour le texte, titres en 600–700 à interlettrage négatif, corps de 14px ; Geist Mono pour les seuls codes : identifiants et adresses de QR, colonnes et fichiers CSV.
- Chiffres tabulaires partout où des nombres s'alignent.
- Plat au repos : filets à 8% et 14% de blanc, `shadow-pop` pour les seuls calques flottants.
- Rayons de 6, 10 et 14px, icônes Lucide au trait 1.75.
- Navigation en trois formes : sidebar de 248px, rail de 72px, barre du bas à bouton central rouge ; un écran plein, sans navigation, pour les tâches de terrain.
- La fiche d'un objet s'ouvre dans un panneau latéral modal, par-dessus la liste qu'elle prolonge.
- Transitions de 150ms, coupées par `prefers-reduced-motion`.

## Colors

Un noir en quatre paliers, deux gris de texte, un rouge qui ne sert qu'à agir, situer ou alerter, et un bleu qui ne sert qu'aux données.

### Primary
- **Rouge DetectiveScan** (#e50914, `red`) : aplat du bouton d'action principale (« Se connecter », « Envoyer le lien », « Actions rapides », bouton central mobile) et fond de la marque. Sert aussi de bordure de focus des champs (avec un halo `rgb(229 9 20 / 0.35)` de 3px), de curseur de saisie (`caret-color`) et, à 55%, de fond de sélection de texte. Texte blanc dessus : 4.79:1.
- **Rouge survol** (#c8070f, `red-hover`) : bouton principal au survol (texte blanc 6.01:1).
- **Rouge pressé** (#a8060d, `red-press`) : bouton principal au clic, et bouton central mobile tant que ses actions sont ouvertes (texte blanc 7.79:1).
- **Rouge lisible** (#ff4d55, `red-text`) : tout rouge porté par un trait fin : icône de l'élément de navigation actif, bordure et message d'erreur, « Se déconnecter », variante `danger` (« Supprimer »), badge rouge, évolution en baisse d'un chiffre clé, pouce baissé d'un avis, ligne en erreur d'un import. 6.08:1 sur `canvas`, 5.23:1 sur `raised`.
- **Voile rouge** (`rgb(229 9 20 / 0.14)`, `red-soft`) : fond de l'alerte de formulaire, du badge rouge et du survol `danger`, toujours sous du blanc ou du `red-text`.

### Secondary
- **Bleu des données**, quatre nuances d'une même teinte, rangées de la plus sourde à la plus claire le long du parcours du joueur :
  - **Bleu scan** (#256abf, `viz-1`) : scans (courbe et première barre de l'entonnoir). La nuance la plus sombre, 3.41:1 sur `surface`.
  - **Bleu partie** (#6da7ec, `viz-2`) : parties commencées (courbe et barre).
  - **Bleu fin de partie** (#9ec5f4, `viz-3`) : parties terminées.
  - **Bleu victoire** (#cde2fb, `viz-4`) : parties gagnées, la nuance la plus claire, là où mène le parcours.
- Validées comme rampe ordinale sur `surface` (#141414) : clarté monotone, écarts de clarté OKLCH d'au moins 0.09 entre deux nuances voisines, teinte unique. Les deux courbes (scans et parties) sont séparées par 0.19 de clarté.

### Neutral
- **Noir absolu** (#000000, `chrome`) : le cadre : sidebar, barre du bas, écrans d'accès, fond de `html` et `theme-color`.
- **Noir de page** (#0a0a0a, `canvas`) : fond du contenu et de la barre haute.
- **Charbon** (#141414, `surface`) : panneaux du dashboard et chiffres clés, champs de saisie, contrôle de période, avatars, bandeau démo (à 70%). C'est aussi le fond des graphiques : aucun aplat de couleur sous les courbes.
- **Graphite** (#1c1c1c, `raised`) : popovers, menu du compte, info-bulles du rail et du graphique : tout ce qui flotte.
- **Filet** (`rgb(255 255 255 / 0.08)`, `line`) : filets de structure (bords de la sidebar, de la barre haute, de la barre du bas, du bandeau démo et des panneaux, séparateurs de listes, de tableaux et de menus, lignes de grille des graphiques, anneau des tuiles d'icône).
- **Filet appuyé** (`rgb(255 255 255 / 0.14)`, `line-strong`) : bordure des champs, des popovers, des info-bulles et du bandeau d'information, anneau des avatars, bordure de la cloche au survol, ligne de base des graphiques.
- **Blanc** (#ffffff, `fg`) : titres, texte principal, chiffres, élément actif, texte des boutons. 19.8:1 sur `canvas`.
- **Gris argent** (#b3b3b3, `fg-2`) : texte secondaire, navigation au repos, libellés de champ et de chiffres clés, légendes et étiquettes de fin de courbe, textes d'introduction. 9.44:1 sur `canvas`.
- **Gris fumée** (#8c8c8c, `fg-3`) : métadonnées, aides, placeholders, icônes au repos, libellés de groupe, graduations, valeurs de la période précédente, notes, pied de page. 5.48:1 sur `surface`, 5.07:1 sur `raised`.

Les états interactifs posent un voile blanc (`rgb(255 255 255 / x)`) plutôt qu'un nouveau gris : 5% (survol de la navigation et du contrôle de période), 6% (tuiles d'icône, squelette, survol du déclencheur de compte), 8% (badge neutre, tuiles d'actions rapides, survol des menus et du bouton `ghost`), 9% (élément actif de la navigation et du contrôle de période, cloche active), 10%, 16% et 22% (bouton secondaire au repos, au survol, au clic), 25% (bordure de champ au survol, réticule du graphique). La barre de défilement est fine, curseur #333333 sur piste transparente.

### Status
- **Vert validé** (#46d369, `success`) et **Ambre** (#f5a524, `warning`) : tons du `Badge` (fond à 12%, texte plein : partie « Gagnée » en vert, « Abandonnée » en ambre) ; en trait, évolution en hausse d'un chiffre clé (vert, flèche montante), pouce levé d'un avis (vert), icône du bandeau de période refusée (ambre). Statut d'un QR : « Posé » est une pastille `success` de 6px suivie du libellé (l'état normal reste discret), « À poser » un badge alerte, « Désactivé » un badge neutre ; un QR posé sans scan depuis 7 jours passe son dernier scan en `warning`, précédé d'une icône d'alerte. Une confirmation porte une icône `success`. Toujours avec une icône ou un libellé : jamais la couleur seule. `--color-info` (#6ea8ff) est déclaré dans `styles.css` mais aucun composant ne l'emploie : il n'est pas repris ici.

### Named Rules
**La règle du rouge réservé.** Hors marque, un seul aplat rouge par vue : celui de l'action principale (dans l'espace hôtelier, « Actions rapides » dès 768px, le bouton central en dessous). La deuxième action d'une vue prend la variante `secondary`, et une section à venir reste entièrement neutre. Un panneau modal ou un écran plein est une vue à part : il porte l'aplat de sa propre validation (« Ajouter le QR code », « Enregistrer », « Enregistrer la pose », « Scanner le QR suivant »), puisque la page derrière est inerte ou absente. Les actions d'une page de l'espace (« Mode installation », « Ajouter un QR code », « Importer N QR codes ») restent `secondary` : « Actions rapides » garde l'aplat.

**La règle du rouge lisible.** Le rouge en texte, en icône ou en bordure d'erreur est toujours `red-text` (#ff4d55). `red` (#e50914) ne tient que 4.13:1 sur `canvas` : il reste un fond.

**La règle du bleu des données.** Le rouge sert à agir, situer et alerter : les données prennent donc une seule autre teinte, le bleu `viz-1` à `viz-4`, dans l'ordre du parcours et uniquement dans les graphiques. Jamais pour une action, un lien, un état ni un texte : valeurs, libellés et légendes restent en blanc et en gris, le bleu n'est porté que par le trait, la barre ou la pastille à côté.

**La règle du plancher gris.** Aucun texte plus sombre que `fg-3` (#8c8c8c). Les gris plus sombres (filets, #333333 de la barre de défilement) ne portent jamais de lecture.

## Typography

**Display Font:** Geist (paquet `geist`, chargé par `next/font/local`, fonte variable 100–900 exposée en `--font-geist-sans`), avec ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
**Body Font:** Geist, même pile
**Label/Mono Font:** Geist Mono (`--font-mono`), réservée aux codes : identifiants de QR (`01-254-00`, 12.5px dans les tableaux et les listes, 12px dans la liste mobile du dashboard, 14px dans un titre de formulaire, à la taille du titre ailleurs), adresses encodées dans les QR, noms des colonnes et du fichier CSV.

**Character:** Une grotesque technique, nette et neutre, qui laisse le noir et le rouge porter l'identité. La hiérarchie tient au poids et à l'interlettrage négatif des titres, jamais à une seconde voix.

### Hierarchy
- **Headline** (700, 28px, 1.25, -0.02em) : titre des écrans d'accès et d'erreur (« Connexion », « Mot de passe oublié », « Demande enregistrée », « Page introuvable »).
- **Metric** (600, 28px, 1, -0.02em) : valeur d'un chiffre clé (« 1 238 », « 61 % »), en chiffres proportionnels.
- **Title** (600, 22px, 1.375, -0.015em) : titre de contenu d'une section, limité à 34ch.
- **Page title** (600, 20px dès 768px et 17px en dessous, 1.25, -0.01em) : titre de page dans la barre haute, sur une seule ligne tronquée ; titre d'une fiche en panneau latéral (la chambre, « Chambre 12 »), en 20px. Le titre de l'écran plein (« Mode installation ») garde 17px à toutes les tailles.
- **Panel title** (600, 15px, 1.375, -0.01em) : titre d'un panneau du dashboard (« Scans et parties commencées », « Du scan à la victoire »), suivi d'une précision en 12.5px `fg-3` ; titre d'un formulaire en panneau latéral (« Ajouter un QR code ») et d'un bloc de page (« Format du fichier »).
- **Body large** (400, 15px, 1.5 à 1.625) : texte d'introduction des écrans d'accès, texte saisi dans les champs ; les boutons `lg` sont en 15px/600.
- **Input touch** (400, 16px, 1.5) : texte saisi dans les champs de l'écran plein, utilisé au téléphone : sous 16px, Safari sur iPhone agrandit la page au focus.
- **Body** (400, 14px, 1.5) : corps de base de `body`, listes de contenu, champs de date ; 14px/600 pour les boutons `md`, les titres d'actions rapides et les valeurs de l'entonnoir, 14px/500 pour le titre d'une ligne de la liste mobile.
- **Nav** (500, 13.5px) : éléments de la sidebar et du menu du compte ; 13.5px/400 pour l'alerte de formulaire et le bandeau d'information ; 13.5px pour les cellules de tableau et les valeurs des sous-indicateurs (500).
- **Label** (500, 13px) : libellés de champ, libellés de chiffre clé, contrôle de période ; en 400 pour les aides, les erreurs, les liens secondaires, les notes, la phrase de période et les étapes de l'entonnoir ; les boutons `sm` sont en 13px/600.
- **Caption** (400, 12px) : métadonnées (ville, rôle, e-mail), en-têtes de tableau (500), notes de l'entonnoir, notes de bas de panneau, valeurs de la période précédente, pied de page, séparateur « ou » ; 12px/500 pour les badges, 12px/600 pour le titre d'un popover. Les info-bulles (500), le bandeau démo, les libellés des sous-indicateurs, les légendes, l'évolution d'un chiffre clé (600 pour la valeur) et le détail des actions rapides sont en 12.5px.
- **Axis** (400, 11.5px, chiffres tabulaires) : graduations et dates des axes des graphiques, en `fg-3`.
- **Group label** (600, 11px, 0.08em, capitales) : libellés de groupe de la sidebar (Pilotage, Expérience, Compte). Les onglets de la barre du bas sont en 11px/500, sans capitales.

Le mot-symbole « DetectiveScan » est en 700, 17px (16px dans la sidebar), -0.02em ; il appartient à la marque provisoire.

Les nombres suivent l'usage français : espace fine insécable pour les milliers et avant « % », virgule décimale, signe moins typographique (−), « 1er » pour le premier du mois, heures en « 21 h 42 ».

### Named Rules
**La règle de la famille unique.** Geist seul pour tout le texte, en 400, 500, 600 et 700 ; Geist Mono n'existe que pour les codes : identifiants et adresses de QR, colonnes et fichiers CSV. Titres en 600–700 avec un interlettrage de -0.01em à -0.02em, texte courant sans interlettrage, `text-wrap: balance` sur h1–h3.

**La règle de la capitale rare.** Les capitales espacées n'existent que pour les libellés de groupe de la sidebar. Aucun sur-titre en capitales au-dessus d'un titre.

**La règle des chiffres alignés.** Chiffres tabulaires partout où des nombres se lisent en colonne ou se comparent : tableaux, valeurs des sous-indicateurs, graduations, étiquettes de fin de courbe, info-bulles, dates et heures des listes. Exception voulue : la valeur d'un chiffre clé (28px) garde les chiffres proportionnels, car à cette taille des chiffres de largeur égale paraissent lâches.

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
Les pages d'un hôtel se rangent en deux groupes de routes : `(shell)`, avec la navigation complète, et `(focus)`, en plein écran.

- **Dashboard** : 1600px de large au plus, calé à gauche, 16px puis 24px de marge verticale, 16px puis 20px entre les rangées. Dans l'ordre : le filtre de période, les quatre chiffres clés (deux colonnes, quatre dès 1024px, 12px puis 16px d'écart), les quatre panneaux, les définitions. Panneaux : une colonne ; de 1024 à 1279px, la courbe en pleine largeur, l'entonnoir et les chambres côte à côte, les dernières parties en pleine largeur ; dès 1280px, une grille de 12 colonnes : courbe (8) et entonnoir (4), puis chambres (5) et dernières parties (7).
- **QR codes & chambres** : même largeur et mêmes marges que le dashboard. Une rangée de tête (la couverture à gauche, les trois actions à droite ; sous 640px, « Mode installation » en pleine largeur puis les deux autres côte à côte), une rangée de recherche (288px dès 640px) et de filtre de statut, le bandeau d'alerte éventuel, la liste, puis la note de démo.
- **Page de tâche** (import CSV) : 880px au plus, lien retour, titre de 22px, introduction limitée à 62ch, 24px entre les blocs.
- **Écran plein** (`(focus)`, mode installation) : aucune navigation ; barre collante de 56px (bouton de sortie × de 40px, titre de 17px, ligne d'état 12px `fg-3`), bandeau démo, puis une colonne de 520px centrée, marges de 16px, 20px en haut et 32px plus la zone sûre en bas.

**Rythme.** Base de 4px (`--spacing: 0.25rem` de Tailwind v4). Pas récurrents : 2px entre les éléments d'une liste (navigation, menus, contrôle de période), 8px entre un libellé et son champ, 12px entre une icône et son texte, 20px entre deux champs et entre deux étapes de l'entonnoir, 28 à 32px entre les blocs d'un écran. Cibles : 32px (contrôle de période, bouton `sm`), 40px (navigation, menus, bouton `md`, champs de date), 44px (champs, bouton d'affichage du mot de passe), 48px (bouton `lg`), 52px (bouton central), 64px (onglets mobiles).

**Empilement.** Barre haute `z-30`, barre du bas `z-40`, popovers, info-bulles et lien d'évitement `z-50` ; l'info-bulle du graphique `z-10`, au-dessus du tracé. Le panneau latéral (`<dialog>` modal) vit dans la couche supérieure du navigateur, au-dessus de tout, avec sa propre confirmation ; la confirmation de page est en `z-50`. Zones sûres gérées (`viewport-fit=cover`) en haut, en bas et sous le popover mobile.

### Named Rules
**La règle du libellé jamais perdu.** Dans le rail, chaque libellé reste dans le DOM (`sr-only`) et réapparaît en info-bulle au survol comme au focus clavier ; les libellés de groupe y deviennent un filet centré de 32px. Même principe pour le contrôle de période sous 640px : « 7 j » et l'icône de calendrier à l'écran, « 7 jours » et « Personnalisé » pour les lecteurs d'écran.

**La règle de l'action au pouce.** Sous 768px, l'action principale quitte la barre haute pour le bouton central de la barre du bas ; les sections absentes de la barre (Analytics, Abonnement) passent dans le menu du compte, et l'onglet « QR » remplace le bouton « Gérer les QR codes » du dashboard.

**La règle du filtre unique.** Une seule période par page, choisie dans une rangée au-dessus de tout ce qu'elle filtre, et portée par l'adresse (`?periode=7j`) : chiffres, courbe, entonnoir, chambres et parties se lisent toujours sur la même tranche, comparée à la précédente, et un lien partagé ouvre la même vue.

## Elevation & Depth

La profondeur est tonale : quatre paliers de noir, du cadre au flottant, `chrome` (#000000), `canvas` (#0a0a0a), `surface` (#141414), `raised` (#1c1c1c). Le cadre est plus sombre que la page : la navigation recule, le contenu avance, et les panneaux du dashboard reposent sur `surface` avec un filet. Les états interactifs ajoutent un voile blanc translucide, et les zones se séparent par des filets de 1px. Une seule ombre existe, et elle marque ce qui flotte.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 18px 44px -12px rgb(0 0 0 / 0.85), 0 2px 10px rgb(0 0 0 / 0.55)`, `shadow-pop`) : popover d'actions rapides, menu du compte, info-bulles du rail et du graphique, bouton central mobile, panneau latéral, confirmation. Rien d'autre.

Les calques flottants sont des popovers natifs (`popover="auto"` : fermeture au clic extérieur et sur Échap). Ils entrent par un fondu et une montée de 4px en 150ms, courbe `ease-out-quint` (`cubic-bezier(0.22, 1, 0.36, 1)`), via `@starting-style` (classe `ds-popover`). Le panneau latéral glisse depuis la droite en 220ms, même courbe, sur un voile noir à 60% qui apparaît en fondu (`ds-sheet`) ; la page derrière ne défile plus. La confirmation entre par le fondu et la montée de 4px des popovers, en 150ms (`ds-enter`).

### Named Rules
**La règle de l'ombre unique.** `shadow-pop` est réservée à ce qui flotte au-dessus du contenu. Champs, boutons en ligne, barres, panneaux et chiffres clés restent plats : au repos, la profondeur vient du palier de noir et du filet.

## Shapes

Des rectangles aux angles adoucis, des bordures de 1px, aucune découpe ni silhouette oblique.

- **6px (`rounded-sm`)** : contrôles en ligne (boutons, champs, champs de date, éléments de navigation, de menu et du contrôle de période), info-bulles du rail, liens texte au focus, lien d'évitement, lignes du squelette.
- **10px (`rounded-md`)** : panneaux et chiffres clés du dashboard, cadre du contrôle de période, info-bulle du graphique, bandeau d'information, avatars de 32 à 36px, tuiles d'icône de 40 à 48px, cloche, lignes d'actions rapides, menu du compte, déclencheur du compte, alerte de formulaire, confirmation, zone de dépôt, cadre du lecteur de QR.
- **14px (`rounded-lg`)** : grandes pièces flottantes : popover d'actions rapides, bouton central mobile.
- **Pilule (`rounded-full`)** : badges, pastilles et traits de légende, pastille de statut d'un QR, et avatar de l'utilisateur dans la barre haute mobile.

Le panneau latéral n'a pas de coins : il tient toute la hauteur de l'écran, bord gauche en filet `line-strong`.

Champs, panneaux, popovers, info-bulles, cloche et bandeau d'information portent une vraie bordure de 1px ; avatars, tuiles d'icône et variante `danger` portent un anneau inset de 1px (`ring-inset`). La marque est un carré rouge de 32px aux coins de 7px portant une loupe blanche dont la lentille contient deux modules de QR code ; elle sert aussi de favicon.

### Named Rules
**La règle du rayon qui suit la taille.** 6px pour ce qui s'aligne en ligne, 10px pour les panneaux, les tuiles et les menus, 14px pour les grandes pièces flottantes. Hors de cette échelle, seuls la pilule des badges, le cercle de l'avatar mobile et l'extrémité des marques de données : une barre de graphique a un bout arrondi de 4px et reste carrée sur sa ligne de base.

## Components

### Buttons
Nets et compacts : aplat, poids 600, aucun relief.
- **Shape:** coins de 6px (`rounded-sm`), icône et libellé espacés de 8px, jamais de retour à la ligne.
- **Sizes:** `sm` 32px de haut, marges de 12px, 13px, icônes de 16px ; `md` 40px, 16px, 14px, icônes de 18px ; `lg` 48px, 20px, 15px, icônes de 20px (boutons pleine largeur des écrans d'accès).
- **Primary:** aplat `red`, texte blanc ; survol `red-hover` ; clic `red-press` et descente de 1px.
- **Secondary:** voile blanc de 10% (16% au survol, 22% au clic), texte `fg` ; la deuxième action d'une vue (« Explorer la démo », « Retour à la connexion », « Gérer les QR codes », « Appliquer »), et les actions d'une page quand l'aplat est déjà pris (« Mode installation », « Ajouter un QR code », « Importer N QR codes », « Modifier », « Activer la caméra »).
- **Ghost:** transparent, texte `fg-2` ; voile de 8% et texte `fg` au survol, 12% au clic. En usage : la bascule « Tableau » / « Graphique » d'un panneau (`sm`), « Importer un CSV », « Annuler », « Désactiver » et « Réactiver », « Changer de fichier », « Télécharger le modèle ».
- **Danger:** transparent, texte `red-text`, anneau inset de 1px en `red-text` à 40%, `red-soft` au survol et au clic. En usage : « Supprimer » dans la fiche d'un QR, calé à droite du pied, puis confirmé en ligne (phrase et second « Supprimer ») ; « Se déconnecter » applique le même `red-text` dans le menu du compte.
- **Hover / Focus:** fond, couleur, ombre et position en 150ms `ease-out` (`cubic-bezier(0, 0, 0.2, 1)`) ; focus clavier en contour blanc de 2px décalé de 2px.
- **Disabled / Loading:** opacité de 45%, sans pointeur. En chargement : `aria-busy`, spinner (rotation de 1s, linéaire) avant le libellé, libellé suivi de points de suspension (« Connexion… », « Envoi… », « Ouverture… », « Chargement… »).
- **Lien en bouton:** `buttonClasses({ variant, size })` habille un `<Link>` (« Revenir à l'accueil », « Retour à la connexion », « Gérer les QR codes »).
- **« Actions rapides » (barre haute):** `primary` `md`, « + », libellé et chevron (marges de 12px à gauche et 10px à droite) ; le chevron pivote de 180° en 200ms quand le popover est ouvert. Masqué sous 768px.

### Chips
- **Style:** badge en pilule de 24px, marges de 10px, 12px/500, sans bordure. Tons : neutre (voile de 8% et `fg-2`), rouge (`red-soft` et `red-text`), succès (`success` à 12% et `success`), alerte (`warning` à 12% et `warning`).
- **State:** étiquette statique, jamais cliquable. En usage : neutre, « Prévu à l'étape N » ; statut d'une partie : « En cours » (neutre, précédé d'une pastille de 6px `fg-2`), « Gagnée » (succès), « Perdue » (neutre), « Abandonnée » (alerte) ; statut d'un QR : « À poser » (alerte), « Désactivé » (neutre), « Posé » en simple pastille. Résumé d'un import : « 3 à ajouter » (succès), « à mettre à jour » et « déjà à jour » (neutre), « en erreur » (rouge). Le libellé porte le sens, le ton le renforce.

### Cards / Containers
- **Panneau** (`Card` de `@detectivescan/ui`) : fond `surface`, filet `line` de 1px, coins de 10px, aucune ombre ; marge intérieure de 16px, 20px dès 768px. Jamais imbriqué dans un autre panneau : à l'intérieur, des filets, des listes et des tableaux.
- **En-tête de panneau** : titre 15px/600 `fg` à -0.01em, précision 12.5px `fg-3` dessous (« Par jour », « Classées par nombre de scans ») ; une action éventuelle à droite (bouton `ghost` `sm` ou lien 13px `fg-2` suivi d'un chevron de 16px), qui passe sous le titre si la place manque.
- **Chiffre clé** : panneau de libellé 13px/500 `fg-2`, valeur 28px/600 `fg`, évolution 12.5px, puis, sous un filet `line`, deux sous-indicateurs : libellé 12.5px `fg-3`, valeur 13.5px/500 `fg` suivie de la valeur précédente en 12px `fg-3` (« 1 006 vs 869 »). Évolution : flèche de 14px et valeur en 600 (`success` et flèche montante en hausse, `red-text` et flèche descendante en baisse, `fg-2` et trait pour « Stable »), puis « vs » et la valeur précédente en `fg-3` ; une phrase complète est lue par les lecteurs d'écran. En pourcentage (« +15 % »), en points pour un taux (« +3 pts »), en valeur sous une base de 20 (« −6 »). Sans période comparable : « Pas de comparaison » en `fg-3`. Sans donnée : un tiret.
- **Bandeau d'information** (`role="status"`) : fond `surface`, bordure `line-strong`, coins de 10px, marges de 12px et 16px, texte 13.5px `fg-2`, icône d'alerte de 16px en `warning`, lien de sortie souligné en 500 `fg` (« Choisir une autre période »).
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
- **Recherche:** champ de 40px, loupe de 16px `fg-3` à 14px du bord, texte 14px, placeholder « QR code ou chambre » ; sans bouton d'effacement natif.
- **Champ tactile** (écran plein) : 48px, texte 16px, mêmes bordure, survol et focus. Avec des suggestions (`datalist`), la flèche native est atténuée à 40%, ici comme dans le panneau latéral.
- **Formulaire:** à la validation, toutes les erreurs s'affichent ensemble et le focus va au premier champ en erreur ; un avertissement non bloquant (chambre déjà équipée) s'écrit en 13px `fg-2` avec une icône `warning`. Case à cocher native de 16px, `accent-color` rouge.
- **Date:** champ natif de 40px, 156px de large, marge de 12px, texte 14px en chiffres tabulaires, mêmes bordure, survol et focus que les champs ; libellé court en ligne (« Du », « au », 13px `fg-2`) ; icône du calendrier natif à 60%, pleine au survol. Les bornes (`min`, `max`) empêchent une période inversée, trop longue ou hors des données.

### Navigation
- **Sidebar (≥ 1280px):** 248px, `chrome`, filet droit, collante. En-tête de 64px : symbole de 32px et mot-symbole. Bloc hôtel : avatar, nom 13px/600 `fg`, ville et chambres 12px `fg-3`. Groupes : libellé 11px en capitales `fg-3`, 20px entre deux groupes. Éléments : 40px, marges de 12px, icône de 18px et libellé 13.5px/500 espacés de 12px. Repos : texte `fg-2`, icône `fg-3`. Survol : voile de 5%, texte `fg`, icône `fg-2`. Actif (`aria-current="page"`) : voile de 9%, texte `fg`, icône `red-text`. Focus : contour blanc inset (-2px). Pied : déclencheur du compte (avatar, nom court 13px/600, rôle 12px `fg-3`, chevrons haut-bas), filet supérieur, marge de 12px.
- **Rail (768–1279px):** 72px, icônes centrées, libellés `sr-only`, groupes séparés par un filet centré de 32px, symbole seul en tête. Info-bulle : `raised`, bordure `line-strong`, coins de 6px, marges de 6px et 10px, 12.5px/500 `fg`, `shadow-pop`, à 12px à droite de l'élément, fondu de 150ms au survol et au `focus-visible`, `aria-hidden` (le libellé est déjà dans le lien) ; masquée dès 1280px.
- **Barre haute:** `canvas`, filet inférieur ; titre de page ; cloche carrée de 36px (40px dès 768px), coins de 10px, bordure `line` (`line-strong` et `fg` au survol ; `line-strong`, voile de 9% et `fg` sur la page Notifications) ; bouton rouge « Actions rapides » dès 768px. Sous 768px : avatar de l'hôtel (32px) à gauche, nom de l'hôtel en 12px `fg-3` sous le titre, avatar rond de l'utilisateur (32px) à droite, qui ouvre le menu du compte.
- **Barre du bas (< 768px):** fixe, `chrome`, filet supérieur, 64px plus la zone sûre, cinq colonnes. Onglets : icône de 22px et libellé court 11px/500 (« QR », « Avis ») espacés de 4px ; repos `fg-3`, survol `fg-2`, actif `fg` avec icône `red-text` ; focus en contour blanc inset (-4px).
- **Liens secondaires:** 13px `fg-2`, `fg` au survol ; « Mot de passe oublié ? » se souligne au survol (décalage de 4px), le lien retour porte une flèche de 16px, les liens de panneau (« Toutes les chambres ») un chevron de 16px.
- **Lien d'évitement:** « Aller au contenu », fixé à 16px du coin haut gauche, aplat blanc, texte noir 14px/600, coins de 6px, caché au-dessus de l'écran jusqu'au focus, contour rouge de 2px au focus : le seul aplat blanc du système.

### Filtre de période
Le seul filtre du dashboard, en tête de page ; il porte sur tout ce qui suit.
- **Contrôle:** liste de liens dans un cadre `surface`, filet `line`, coins de 10px, marge de 4px ; éléments de 32px, marges de 12px (10px sous 640px), 13px/500, espacés de 2px. Repos `fg-2` ; survol voile de 5% et `fg` ; sélection (`aria-current`) voile de 9% et `fg` ; focus en contour blanc inset. « Aujourd'hui », « 7 jours », « 30 jours » (par défaut, sans paramètre), « 3 mois », « Personnalisé » ; sous 640px « 7 j », « 30 j » et une icône de calendrier de 16px, le cadre défilant horizontalement s'il manque de place.
- **Période personnalisée:** une rangée sous le contrôle : « Du » et « au » avec deux champs de date, bouton `secondary` « Appliquer » (« Chargement… » pendant l'envoi) et la règle en 12.5px `fg-3` (« 92 jours au plus, jusqu'à hier. »).
- **Phrase de période:** 13px `fg-3` sous la rangée, qui dit ce que couvrent les chiffres et à quoi ils sont comparés (« Du 29 août au 27 sept. 2026, comparé aux 30 jours précédents. »).
- **Accès aux QR codes:** bouton `secondary` `md` « Gérer les QR codes » avec icône de QR, calé à droite de la rangée dès 768px.
- **Changement de période:** la sélection bascule aussitôt ; pendant le chargement, le contenu reste en place à 50% d'opacité (fondu de 200ms, `aria-busy`), sans squelette ni saut ; le filtre reste net et la page ne remonte pas.

### Graphiques
- **Courbe d'activité:** scans (`viz-1`) et parties commencées (`viz-2`) sur un seul axe, par jour, ou par heure complète pour « Aujourd'hui » (l'heure entamée n'est pas tracée). Zone de 228px, 264px dès 640px, axes compris ; marges de 40px à gauche (graduations) et à droite (étiquettes de fin), 12px en haut, 28px en bas. Lignes de 2px, jointures rondes, sans aplat dessous ; grille en `line`, ligne de base en `line-strong` ; graduations et dates en 11.5px `fg-3` tabulaires, une date sur deux sous 640px ; échelle arrondie (0, 20, 40…), jamais moins de 0 à 4. Dernière valeur de chaque courbe en 12px/500 `fg-2` à 8px du dernier point, masquées si elles se chevauchent. Légende en 12.5px `fg-2` avec des traits de 14px × 2px.
- **Survol et clavier:** un réticule vertical de 1px blanc à 25% se cale sur le jour le plus proche ; points de 10px entourés d'un anneau de 2px `surface` ; info-bulle `raised`, bordure `line-strong`, coins de 10px, marges de 10px et 12px, `shadow-pop`, en haut de la zone, à 12px du réticule (côté gauche passé 55% de la largeur) : date 12px `fg-3`, puis pour chaque courbe un trait de 12px, la valeur en 600 `fg` et l'unité en `fg-2`. Au clavier : flèches, Début, Fin, Échap, contour blanc de 2px décalé de 4px, valeurs annoncées aux lecteurs d'écran.
- **Vue tableau:** bouton `ghost` « Tableau » / « Graphique » ; décompte en 12.5px `fg-3` (« 30 jours, du plus récent au plus ancien. »), tableau défilant de 26rem au plus, en-tête collant, fondu vers `surface` sur 56px tant qu'il reste des lignes.
- **Entonnoir:** quatre étapes, de « Scans » à « Parties gagnées », en `viz-1` à `viz-4` : libellé 13px `fg-2` et valeur 14px/600 tabulaire sur une ligne, barre de 10px proportionnelle aux scans (4px au moins), bout arrondi de 4px, puis note 12px `fg-3` (« 79 % des parties commencées · 139 abandons »). La liste se lit sans le dessin.
- **Vide:** « Aucun scan sur cette période. » (ou l'attente de la première heure complète) centré en 13px `fg-3`, à la place des tracés.

### Tableaux et listes
- **Tableaux:** 13.5px ; en-têtes 12px/500 `fg-3` ; lignes séparées par un filet `line`, marges verticales de 10px ; cellules de texte alignées sur la ligne de base ; en-tête de ligne en 500 `fg` (la chambre) ; identifiants de QR en Geist Mono 12.5px `fg-2` ; nombres alignés à droite, tabulaires ; note de bas de panneau en 12px `fg-3` (« Participation affichée à partir de 5 scans par chambre. »).
- **Dernières parties:** tableau dès 768px (date, chambre, QR code, joueur, partie, avis) ; en dessous, une liste : « Chambre 12 » en 14px/500 suivi du QR en 12px `fg-3`, puis la date et le joueur en 12.5px `fg-3`, et à droite l'avis et le statut. Joueur : nom masqué de longueur fixe (« J. D•••• ») en `fg-2`, seulement avec son accord, sinon « Anonyme » en `fg-3`. Avis : pouce levé `success` ou baissé `red-text` de 16px, nommé pour les lecteurs d'écran ; sans réponse, un tiret dans le tableau, rien dans la liste. Note de confidentialité en 12px `fg-3` précédée d'un bouclier de 16px.

### Panneau latéral
- **Structure:** `Sheet` de `@detectivescan/ui`, un `<dialog>` modal natif : 440px à droite, pleine largeur sous 640px, `raised`, bord gauche `line-strong`, `shadow-pop`. En-tête (titre, ligne d'état, bouton « Fermer » de 36px), corps défilant (marges de 20px, blocs séparés par un filet `line` et 20px d'air), pied collé en bas (filet supérieur, marges de 16px et 20px, zone sûre).
- **Comportement:** Échap, un clic sur le voile ou « Fermer » le referment. À l'ouverture, le focus va au champ marqué `data-autofocus`, sinon au titre ; à la fermeture, il revient à la ligne qui l'a ouvert. L'adresse porte la fiche ouverte (`?qr=01-254-00`).
- **Fiche d'un QR:** titre 20px/600, la chambre (« Chambre 12 »), ou « QR 01-254-42 » sans chambre ; dessous, « QR 01-254-00 » en mono 12.5px `fg-2` et le statut. Blocs : adresse encodée (mono 12.5px `fg-2`, « Copier l'adresse » `secondary` `sm`, « Ouvrir » en lien `sm`), « 30 derniers jours » (scans, participation, dernier scan, en grille 0.8 / 1 / 1.7), historique du plus récent au plus ancien (action et chambre 13.5px `fg`, date et auteur 12px `fg-3`, note 12.5px `fg-2`). Pied : « Modifier » `secondary`, « Désactiver » ou « Réactiver » `ghost`, « Supprimer » `danger`.
- **Formulaire:** titre 15px/600 ; champs à 20px d'écart ; l'adresse suit l'identifiant et le statut suit la chambre tant qu'on ne les a pas changés à la main ; statut en contrôle segmenté (radios). Pied : validation `primary`, « Annuler » `ghost`.

### Confirmation
- `Notice` : une zone `role="status"` toujours présente, pour que l'annonce soit lue. Message `raised`, bordure `line-strong`, coins de 10px, marges de 12px et 16px, 13.5px `fg`, icône `success` de 16px, `shadow-pop`, effacé après 4 secondes ou à l'ouverture d'une autre fiche. En bas à droite dès 768px, centré au-dessus de la barre du bas en dessous ; dans un panneau ouvert, au-dessus de son pied, puisque la page est alors inerte.

### QR codes & chambres
- **Rangée de tête:** la couverture en 14px `fg-2`, le nombre en 600 `fg` (« 42 chambres équipées sur 42 » ; sans « sur 42 » si l'hôtel en équipe plus qu'il n'en déclare) ; « Mode installation » et « Ajouter un QR code » `secondary`, « Importer un CSV » `ghost`.
- **Filtre de statut:** le cadre du contrôle de période, en boutons `aria-pressed` : libellé et compte tabulaire en `fg-3` (« Posés 42 »).
- **Bandeau d'alerte:** le bandeau d'information, quand des QR posés n'ont pas été scannés ces 7 derniers jours, avec « Voir ce QR » qui filtre la liste.
- **Tableau (≥ 768px):** Chambre (en-tête de ligne, `fg-3` pour « Sans chambre »), QR code, Statut, Scans 30 j, Participation (dès 1024px), Dernier scan, chevron. En-têtes triables : bouton, flèche de 14px sur la colonne active, `aria-sort`. La ligne entière ouvre la fiche (voile de 5% au survol) ; la cellule de la chambre en est le bouton. À chambre égale, le QR posé passe avant celui qu'il a remplacé.
- **Liste (< 768px):** chambre 14px/500 et statut, puis QR en mono, scans, et « sans scan depuis 7 j » en `warning` ; chevron.
- **Vides:** recherche sans résultat (phrase et « Tout afficher » `secondary` `sm`) ; parc vide (titre 15px/600, texte, « Ajouter un QR code » et « Importer un CSV »).
- **Démo:** « Démo : vos changements restent dans ce navigateur. » en 12.5px `fg-3`, et « Revenir au parc de départ ».

### Import CSV
- **Zone de dépôt:** le `label` du champ fichier, filet pointillé `line-strong` (blanc à 25% au survol ; `fg-2` et voile de 5% pendant un glisser), coins de 10px, marges de 40px et 24px, centrée : tuile d'icône de 48px, « Déposez le fichier ici, ou choisissez-le » 15px/600, règle 13px `fg-3` ; contour blanc au focus clavier.
- **Format:** panneau avec « Télécharger le modèle » (`ghost` `sm`) et les colonnes en liste de définitions, noms en mono 12.5px.
- **Vérification:** badges de résumé, puis une ligne par ligne du fichier : numéro tabulaire `fg-3`, QR en mono, chambre, résultat (« À ajouter » en `fg`, mise à jour en `fg-2`, erreur en `red-text` avec une icône de 14px). Tableau dès 768px (32rem au plus, en-tête collant), liste en dessous. « Importer N QR codes » `secondary` ; les lignes en erreur sont écartées, et rien n'est enregistré avant ce clic.

### Mode installation
- **Lecteur:** cadre carré `chrome`, filet `line`, coins de 10px. Au repos : icône de 32px `fg-2`, « Activer la caméra » `secondary`, note de confidentialité 12.5px `fg-3`. Caméra ouverte : la vidéo remplit le cadre, un viseur de 2px blanc à 80% est inscrit à 18% du bord, la consigne « Visez le QR code » en pastille noire à 70% ; « Arrêter la caméra » `ghost` `sm` dessous. Refus ou absence de caméra : icône `warning` et phrase qui renvoie à la saisie manuelle.
- **Étapes:** scanner (ou saisir l'identifiant sous un filet, champ tactile et « Valider » `secondary` `lg`) ; confirmer (« QR 01-254-42 » en 22px, état du QR, champ tactile de la chambre, avertissement de chambre déjà équipée avec la case « Désactiver l'ancien QR », « Enregistrer la pose » `primary` `lg` en pleine largeur sous 640px) ; fin (tuile `success`, « Chambre 12 équipée » en 22px, « Scanner le QR suivant » `primary` `lg`).

### Définitions
- Dépliant en bas de page, sous un filet `line` : « Comment sont calculés ces chiffres ? » en 13px `fg-2` (`fg` au survol) et chevron de 16px qui pivote de 180° en 200ms ; liste en une, deux puis trois colonnes (32px et 12px d'écart) : terme 13px/500 `fg`, définition 13px `fg-3` à 1.625.

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

### Section à venir et squelettes
- **Section à venir:** colonne de 640px ; tuile d'icône de 48px ; titre de 22px ; contenus prévus entre deux filets, chacun précédé d'un cercle pointillé de 16px `fg-3`, texte 14px `fg-2` ; badge neutre « Prévu à l'étape N » et note 13px `fg-3`. Volontairement sans rouge.
- **Squelette d'une section** (`loading.tsx`) : même gabarit que la section à venir, blocs en voile de 5 à 6%, coins de 6px et 10px, pulsation `animate-pulse` (2s) coupée sous `prefers-reduced-motion`, `role="status"`.
- **Squelette du dashboard** : même grille et mêmes hauteurs que la page (mesurées), panneaux vides `surface` à filet `line`, filtre en voile de 5 à 6% : rien ne saute à l'arrivée des chiffres.

### Avatars et marque
- **Avatar:** pastille d'initiales de 36px (32px dans la barre haute mobile), coins de 10px, fond `surface`, anneau inset de 1px `line-strong`, initiales 12px/700 à 0.02em `fg`. L'avatar de l'utilisateur est rond dans la barre haute mobile.
- **Marque (provisoire):** symbole rouge de 32px et mot-symbole blanc espacés de 10px ; le symbole seul dans le rail.

### Icônes
- Lucide (`lucide-react`), au trait de 1.75 posé explicitement sur chaque icône. Tailles : 14px (erreur de champ, évolution d'un chiffre clé, flèche de tri, dernier scan en alerte, résultat d'import), 16px (menus, bandeaux, alertes, boutons `sm`, avis, calendrier, bouclier, chevrons de lien), 18px (sidebar, cloche, boutons `md`, œil), 20px (actions rapides, boutons `lg`), 22px (onglets mobiles), 24px (tuiles, bouton central), 32px (lecteur de QR au repos).
- Toujours `aria-hidden` : le libellé porte le sens. Exception voulue : le « + » du bouton central, au trait 2.

## Do's and Don'ts

### Do:
- **Réserver** l'aplat `red` (#e50914) à une seule action principale par vue, hors marque ; la deuxième action prend la variante `secondary`. Un panneau modal ou un écran plein porte l'aplat de sa propre validation.
- **Écrire** tout rouge de texte, d'icône ou de bordure d'erreur en `red-text` (#ff4d55).
- **Tracer** les données avec le seul bleu `viz-1` à `viz-4`, dans l'ordre du parcours (scans, parties commencées, terminées, gagnées), sur le fond `surface` du panneau.
- **Accompagner** chaque graphique d'une légende (dès deux séries), d'une info-bulle au survol comme au clavier, et d'une vue tableau.
- **Aligner** en chiffres tabulaires tout nombre lu en colonne ; garder les chiffres proportionnels pour la valeur d'un chiffre clé.
- **Comparer** chaque indicateur à la période précédente de même durée, avec la valeur précédente écrite à côté.
- **Marquer** le focus clavier d'un contour blanc de 2px décalé de 2px (inset dans les listes) ; pour les champs, bordure `red` et halo de 3px à 35%.
- **Accompagner** chaque erreur ou état d'une icône et d'un texte, reliés au champ par `aria-describedby` : jamais la couleur seule.
- **Séparer** les zones par un palier de noir et un filet (`line` à 8%, `line-strong` à 14%), pas par une ombre.
- **Poser** les icônes Lucide au trait 1.75, en `aria-hidden`.
- **Tenir** les transitions d'état à 150ms (200ms pour les rotations de chevron et de « + » et pour l'atténuation d'un changement de période) et laisser `prefers-reduced-motion` les couper.
- **Afficher** toutes les erreurs d'un formulaire à la fois, et porter le focus sur la première.
- **Saisir** en 16px au moins dans un écran utilisé au téléphone.
- **Garder** chaque destination nommée à toutes les tailles : libellé visible (≥ 1280px), info-bulle au survol et au focus (rail), libellé court (barre du bas).

### Don't:
- **Ne pas** poser un second aplat rouge dans une vue, ni employer le rouge en décor (fond de section, illustration, section à venir) ni dans un graphique.
- **Ne pas** écrire de texte en `red` (#e50914) sur noir : 4.13:1 sur `canvas`, sous le seuil AA.
- **Ne pas** employer le bleu des données pour un texte, un lien, une action ou un état, ni hors d'un graphique.
- **Ne pas** poser d'aplat de couleur sous une courbe, ni de deuxième axe vertical.
- **Ne pas** écrire de texte plus sombre que `fg-3` (#8c8c8c).
- **Ne pas** donner d'ombre à ce qui repose dans la page (champs, boutons en ligne, barres, panneaux) : `shadow-pop` est réservée aux popovers, aux info-bulles, au bouton central mobile, au panneau latéral et à la confirmation.
- **Ne pas** imbriquer un panneau dans un autre.
- **Ne pas** introduire de thème clair, d'accent bleu pour les liens ou les actions, ni de famille de caractères autre que Geist (Geist Mono aux seuls codes).
- **Ne pas** habiller l'interface d'un thème décoratif (cinéma, néon, jeu vidéo) : ni grain, ni lueur, ni texture, ni typographie fantaisie.
- **Ne pas** placer de sur-titre en capitales au-dessus d'un titre : les capitales espacées sont réservées aux libellés de groupe de la sidebar.
- **Ne pas** remplacer une icône par un caractère ou un emoji : toute icône est un SVG Lucide, la marque mise à part.
