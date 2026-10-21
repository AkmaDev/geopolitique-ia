# Géopolitique de l'IA — carte interactive

**Voir la carte en ligne :** https://akmadev.github.io/geopolitique-ia/

Projet individuel du cours *Introduction à la programmation* (Samuel Szoniecky), M1 Humanités numériques, parcours NET, Université Paris 8.

## De quoi s'agit-il ?

L'intelligence artificielle n'est pas seulement une question technique. C'est aussi une question de **puissance**. Derrière chaque modèle d'IA, il y a :

- des **puces** fabriquées dans une poignée de pays (Taïwan, Corée du Sud, avec des machines néerlandaises) ;
- des **laboratoires** concentrés aux États-Unis et en Chine ;
- des **règles** que chaque bloc tente d'imposer (AI Act européen, contrôles à l'export américains, régulation chinoise) ;
- des **ressources matérielles** : métaux (cobalt, lithium), eau et électricité pour les centres de données ;
- du **travail humain**, souvent invisible, pour annoter les données et modérer les contenus.

Ce projet propose une **carte du monde interactive** pour rendre visibles ces rapports de force. On y voit qui détient quoi, qui dépend de qui et où se situent les tensions.

## Ambitions du projet

1. **Rendre lisible un sujet complexe.** Il s'agit de passer d'une actualité éparpillée (sanctions, sommets, annonces d'investissements) à une vue d'ensemble compréhensible par un public non spécialiste.
2. **Montrer la matérialité de l'IA.** Dans l'esprit des humanités numériques, la carte rappelle que l'IA « dans le cloud » repose sur des mines, des usines, des câbles, de l'énergie et des travailleurs.
3. **Mettre en évidence les dépendances.** Les flux entre pays (puces, machines, métaux, travail de données) montrent les points de fragilité de la chaîne.
4. **Construire un outil qui évolue.** Les données sont séparées du code, dans `data/pays.js`. On peut donc les enrichir au fil du semestre sans toucher à la carte.
5. **Apprendre la programmation web** par la pratique : HTML, CSS, JavaScript, une bibliothèque de cartographie (Leaflet) et un hébergement gratuit avec GitHub Pages.

## Fonctionnalités (version 1)

- Une carte du monde avec une vingtaine d'acteurs : pays et Union européenne.
- La **taille** de chaque point indique le poids de l'acteur, et sa **couleur** indique son thème principal.
- Cinq **thèmes filtrables** : modèles & entreprises, semi-conducteurs, régulation & diplomatie, ressources & énergie, travail & données.
- Des **flux** entre pays, affichés en pointillés : contrôles à l'export, chaîne des puces, cobalt, annotation de données.
- Une **fiche par pays** : résumé, faits clés, relations et lien pour aller plus loin.
- Un affichage adapté au téléphone.

## Versions

| Page | Contenu |
|---|---|
| [`index0.html`](https://akmadev.github.io/geopolitique-ia/index0.html) | Version 1 : carte, filtres par thème, flux, fiches pays. |
| [`index1.html`](https://akmadev.github.io/geopolitique-ia/index1.html) | Version 2 : tout ce qui précède, plus une **frise chronologique** (curseur d'année et liste d'événements), un menu « Aller à un pays », un compteur d'acteurs et des adresses partageables (`index1.html#taiwan`). |
| [`index2.html`](https://akmadev.github.io/geopolitique-ia/index2.html) | Version 3 : **atlas des points de bascule** sur un **globe** qu'on fait tourner à la souris. 22 points, 7 catégories, et une fiche où l'on écrit d'abord son hypothèse avant de révéler l'analyse vérifiée, question par question. |
| [`grist/index.html`](https://akmadev.github.io/geopolitique-ia/grist/index.html) | Test d'une **custom view Grist** qui lit et affiche les lignes d'un tableau. |

`index.html` reste identique à la version 1.

### La version 3 : élargir aux points de bascule

La version 3 élargit la question. L'IA n'est qu'un cas d'un phénomène plus général : des lieux ou des systèmes dont le pouvoir vient d'une **position de contrôle**, pas d'une abondance de ressources (un détroit, une étape de raffinage, une monnaie, une norme technique). Les enjeux de l'IA y figurent : Taïwan et les semi-conducteurs, le raffinage des terres rares, les data centers de Virginie du Nord, les talents en IA de la Silicon Valley.

Principe pédagogique : **réfléchir avant de lire**. Chaque fiche propose la même grille de 10 questions (ressources réelles, position, qui a intérêt, test de rupture, asymétrie, contre-stratégies, etc.). On écrit son hypothèse, puis on révèle l'analyse et on compare. Pas de score, pas de compte : la progression et les hypothèses restent dans le navigateur (`localStorage`).

Règle de rigueur : aucune réponse n'est inventée. Une information non trouvée avec une source fiable est affichée « Non confirmé — à vérifier ». Pour l'instant, 3 fiches sont documentées (Taïwan, terres rares, Centrafrique) ; les 19 autres sont placées sur le globe mais restent à documenter.

Techniquement, le globe est une projection orthographique de [d3-geo](https://d3js.org/d3-geo), recalculée à chaque mouvement et dessinée en SVG. Pas de moteur 3D.

## Tester la custom view Grist

1. Dans Grist, ouvrir un document avec un tableau (par exemple les pays et leurs thèmes).
2. Ajouter un widget à la page, de type **Personnalisé** (*Custom*).
3. Coller l'adresse : `https://akmadev.github.io/geopolitique-ia/grist/index.html`
4. Choisir le niveau d'accès **Lire la table** et la table à afficher.

Le code utilise `grist.ready({ requiredAccess: "read table" })` pour demander l'accès, puis `grist.onRecords(...)`, qui renvoie toutes les lignes et se relance à chaque modification du tableau. Ouverte seule dans un onglet, la page affiche des données fictives.

## Pistes pour la suite

- [x] Une **frise chronologique** (2017 → aujourd'hui) pour voir la carte évoluer dans le temps (version 2, première étape : les événements viennent de `data/evenements.js`).
- [ ] Colorer les pays entiers (carte choroplèthe) plutôt que des points.
- [ ] Des **indicateurs chiffrés** : investissements, nombre de centres de données, part de la production de puces.
- [ ] Des **sources précises** pour chaque fait (articles, rapports), avec la date de consultation.
- [ ] Stocker les données dans un tableur (GRIST ou Google Sheets) pour les modifier sans coder.
- [ ] Un formulaire pour que les visiteurs proposent des ajouts.

## Structure du code

```
index.html            page principale (version 1)
index0.html           version 1
index1.html           version 2
index2.html           version 3 (globe des points de bascule)
css/style.css         mise en forme (versions 1 et 2)
css/style1.css        compléments de style pour la version 2
css/style2.css        mise en forme de la version 3
js/app.js             logique de la carte, version 1
js/app1.js            logique de la carte, version 2
js/app2.js            logique du globe et des fiches, version 3
data/pays.js          données : thèmes, pays, flux
data/evenements.js    événements datés de la frise (version 2)
data/points.js        données de la version 3 : catégories, 10 questions, 22 points
data/countries-110m.json  fond de carte du globe (world-atlas, Natural Earth)
grist/index.html      test de custom view Grist
```

## Lancer le projet en local

Il n'y a rien à installer : ouvrez `index.html` dans un navigateur.

La version 3 charge son fond de carte avec `fetch`, ce que le navigateur bloque quand on ouvre le fichier directement. Lancez un petit serveur dans le dossier du projet, par exemple `python -m http.server`, puis ouvrez http://localhost:8000/index2.html.

## Crédits

- Fond de carte : © OpenStreetMap (versions 1 et 2) ; Natural Earth via [world-atlas](https://github.com/topojson/world-atlas) (version 3)
- Bibliothèques : [Leaflet](https://leafletjs.com/) (versions 1 et 2) ; [d3](https://d3js.org/) et [topojson-client](https://github.com/topojson/topojson-client) (version 3)
- Polices de la version 3 : Instrument Serif, Newsreader, IBM Plex Mono (Google Fonts)
- Les données de cette première version sont indicatives et restent à vérifier et à sourcer précisément.
