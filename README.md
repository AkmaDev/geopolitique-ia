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

## Pistes pour la suite

- [ ] Une **frise chronologique** (2017 → aujourd'hui) pour voir la carte évoluer dans le temps.
- [ ] Colorer les pays entiers (carte choroplèthe) plutôt que des points.
- [ ] Des **indicateurs chiffrés** : investissements, nombre de centres de données, part de la production de puces.
- [ ] Des **sources précises** pour chaque fait (articles, rapports), avec la date de consultation.
- [ ] Stocker les données dans un tableur (GRIST ou Google Sheets) pour les modifier sans coder.
- [ ] Un formulaire pour que les visiteurs proposent des ajouts.

## Structure du code

```
index.html      page principale
css/style.css   mise en forme
js/app.js       logique de la carte (affichage, filtres, fiches)
data/pays.js    données : thèmes, pays, flux
```

## Lancer le projet en local

Il n'y a rien à installer : ouvrez `index.html` dans un navigateur.

## Crédits

- Fond de carte : © OpenStreetMap, © CARTO
- Bibliothèque : [Leaflet](https://leafletjs.com/)
- Les données de cette première version sont indicatives et restent à vérifier et à sourcer précisément.
