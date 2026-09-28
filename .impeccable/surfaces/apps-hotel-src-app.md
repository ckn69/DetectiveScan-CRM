---
version: 1
slug: "apps-hotel-src-app"
primary_target: "apps/hotel/src/app"
related_targets: []
---

# Surface brief · Espace hôtelier (app.detectivescan.com)

## Scope
Mode : **Operate**. Surface : l'application de l'hôtelier (connexion, mot de passe oublié, structure de navigation desktop / tablette / mobile). Livrée section par section ; l'étape 1 couvre les fondations, la connexion et la navigation, les sections métier arrivent ensuite.

## Audience, tâche, contraintes
- Hôteliers membres (directeur, marketing, réception) : se connecter, retrouver leur hôtel, atteindre n'importe quelle section en un clic.
- Mode démo tant que Supabase n'est pas branché : données fictives étiquetées « Hôtel Démo ».
- Français, WCAG 2.2 AA, Chrome / Safari / Firefox / Edge, desktop → mobile.

## Direction choisie
Sortie standard choisie par l'utilisateur : dashboard SaaS classique en noir et rouge, palette inspirée de Netflix. Barre de finition : Linear, Stripe, Ramp.

## Décisions ouvertes
- Logo officiel DetectiveScan non fourni : marque provisoire.
- Recherche globale (QR, chambre) : livrée avec la section QR codes.

## Direction contract
THESIS: Un dashboard SaaS classique joué droit, au niveau de Linear et Stripe, dans une palette noire inspirée de Netflix. Il refuse le SaaS blanc générique à accent bleu comme le thème décoratif (cinéma, néon, jeu vidéo).
OWN-WORLD: Fond #0A0A0A, sidebar #000000, surfaces #141414, surfaces levées #1C1C1C, filets blancs à 8–14 %. Texte blanc, gris #B3B3B3 et #8C8C8C. Rouge #E50914 réservé au bouton principal, à l'élément actif et au focus des champs ; rouge clair #FF4D55 pour le texte rouge. Une seule famille (Geist), titres gras serrés, chiffres tabulaires. Rayons 6 / 10 / 14 px, icônes Lucide 1,75 px.
STORY: L'hôtelier se connecte en quelques secondes, voit tout de suite son hôtel et trouve chaque section en un clic ; il fait confiance parce que tout se comporte comme les meilleurs SaaS.
FIRST VIEWPORT: Connexion : écran noir, colonne centrée de 400 px (marque, titre « Connexion », e-mail, mot de passe, bouton rouge pleine largeur, « Mot de passe oublié ? », puis « Explorer la démo »). Espace : sidebar noire de 248 px (hôtel, sections groupées, utilisateur en bas), barre haute (titre de page, cloche, action principale rouge), contenu sur #0A0A0A ; barre du bas avec bouton central sur mobile.
FORM: canon (sortie standard choisie par l'utilisateur), position hors liste ; seed 61ac0834 (roll dégradé, sans challengers).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
