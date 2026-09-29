// Données de la carte : acteurs et enjeux géopolitiques de l'IA.
// Première version (septembre 2026) : informations générales, à compléter et
// à sourcer plus finement au fil du projet.
//
// Chaque entrée : id, nom, coordonnées [lat, lng], thèmes (voir THEMES),
// poids (1 à 3, taille du point), résumé, faits clés et une source.

const THEMES = {
  modeles:   { nom: "Modèles & entreprises d'IA", couleur: "#4f46e5" },
  puces:     { nom: "Semi-conducteurs",           couleur: "#0891b2" },
  regulation:{ nom: "Régulation & diplomatie",    couleur: "#c2410c" },
  ressources:{ nom: "Ressources & énergie",       couleur: "#15803d" },
  travail:   { nom: "Travail & données",          couleur: "#be185d" }
};

const PAYS = [
  {
    id: "usa", nom: "États-Unis", coords: [39.5, -98.35], poids: 3,
    themes: ["modeles", "puces", "regulation"],
    resume: "Première puissance de l'IA : la plupart des grands laboratoires (OpenAI, Anthropic, Google DeepMind, Meta) et le quasi-monopole de Nvidia sur les puces d'entraînement.",
    faits: [
      "Depuis octobre 2022, Washington restreint l'exportation de puces avancées et d'outils de fabrication vers la Chine.",
      "Des investissements massifs dans les centres de données (ex. projet Stargate annoncé en janvier 2025).",
      "Une approche de la régulation surtout fédérale par décrets et volontaire, qui varie selon les administrations."
    ],
    source: "https://fr.wikipedia.org/wiki/Intelligence_artificielle_aux_%C3%89tats-Unis"
  },
  {
    id: "chine", nom: "Chine", coords: [35.0, 103.0], poids: 3,
    themes: ["modeles", "puces", "regulation", "ressources"],
    resume: "Seul rival systémique des États-Unis : grands modèles (DeepSeek, Qwen d'Alibaba, Baidu), ambition affichée de leadership mondial d'ici 2030, efforts pour produire ses propres puces.",
    faits: [
      "Le plan national de 2017 vise à faire de la Chine le premier centre mondial d'innovation en IA en 2030.",
      "Huawei développe des puces (Ascend) pour contourner les restrictions américaines.",
      "Pékin contrôle l'exportation de métaux critiques (gallium, germanium) depuis 2023.",
      "Des règles spécifiques encadrent l'IA générative depuis 2023."
    ],
    source: "https://fr.wikipedia.org/wiki/Intelligence_artificielle_en_Chine"
  },
  {
    id: "taiwan", nom: "Taïwan", coords: [23.7, 121.0], poids: 3,
    themes: ["puces"],
    resume: "TSMC y fabrique l'immense majorité des puces les plus avancées au monde, dont celles de Nvidia : un point de fragilité stratégique majeur.",
    faits: [
      "La dépendance mondiale à TSMC fait des tensions dans le détroit de Taïwan un risque pour toute l'industrie de l'IA.",
      "TSMC construit des usines à l'étranger (Arizona, Japon, Allemagne) pour réduire ce risque."
    ],
    source: "https://fr.wikipedia.org/wiki/Taiwan_Semiconductor_Manufacturing_Company"
  },
  {
    id: "paysbas", nom: "Pays-Bas", coords: [52.1, 5.3], poids: 2,
    themes: ["puces", "regulation"],
    resume: "ASML est le seul fabricant au monde des machines de lithographie EUV, indispensables pour graver les puces les plus fines.",
    faits: [
      "Sous pression américaine, les Pays-Bas limitent la vente de ces machines à la Chine.",
      "Un exemple de « goulet d'étranglement » : une seule entreprise européenne tient toute la chaîne."
    ],
    source: "https://fr.wikipedia.org/wiki/ASML"
  },
  {
    id: "coree", nom: "Corée du Sud", coords: [36.5, 127.8], poids: 2,
    themes: ["puces"],
    resume: "Samsung et SK hynix dominent la mémoire, notamment la mémoire à haut débit (HBM) dont les puces d'IA ont besoin.",
    faits: [
      "La HBM est devenue un composant aussi stratégique que le processeur lui-même.",
      "Le pays doit ménager à la fois son allié américain et son marché chinois."
    ],
    source: "https://fr.wikipedia.org/wiki/SK_Hynix"
  },
  {
    id: "japon", nom: "Japon", coords: [36.2, 138.3], poids: 2,
    themes: ["puces", "regulation"],
    resume: "Acteur clé des équipements et matériaux pour semi-conducteurs (Tokyo Electron, résines, wafers) et partisan d'une gouvernance internationale de l'IA.",
    faits: [
      "Le Japon a lancé le « processus d'Hiroshima » sur l'IA lors de sa présidence du G7 en 2023.",
      "La société Rapidus vise la production de puces de pointe sur le sol japonais."
    ],
    source: "https://fr.wikipedia.org/wiki/Tokyo_Electron"
  },
  {
    id: "ue", nom: "Union européenne (Bruxelles)", coords: [50.85, 4.35], poids: 3,
    themes: ["regulation"],
    resume: "L'UE a adopté l'AI Act, première loi complète sur l'IA au monde, qui classe les usages selon leur niveau de risque.",
    faits: [
      "L'AI Act est entré en vigueur en août 2024, avec une application progressive.",
      "Par l'« effet Bruxelles », les normes européennes peuvent s'imposer aux entreprises étrangères qui veulent accéder au marché européen.",
      "Critique fréquente : l'Europe régule beaucoup mais produit peu de grands modèles."
    ],
    source: "https://fr.wikipedia.org/wiki/R%C3%A8glement_europ%C3%A9en_sur_l%27intelligence_artificielle"
  },
  {
    id: "france", nom: "France", coords: [46.6, 2.4], poids: 2,
    themes: ["modeles", "regulation"],
    resume: "Mistral AI est l'un des rares laboratoires européens de premier plan ; la France a accueilli le Sommet pour l'action sur l'IA en février 2025.",
    faits: [
      "Le sommet de Paris a mis l'accent sur l'IA « d'intérêt général » et l'investissement.",
      "L'électricité nucléaire, peu carbonée, est mise en avant pour attirer des centres de données."
    ],
    source: "https://fr.wikipedia.org/wiki/Sommet_pour_l%27action_sur_l%27intelligence_artificielle"
  },
  {
    id: "royaumeuni", nom: "Royaume-Uni", coords: [54.0, -2.0], poids: 2,
    themes: ["modeles", "regulation"],
    resume: "Siège historique de DeepMind (Londres) et organisateur du premier sommet mondial sur la sûreté de l'IA à Bletchley Park en novembre 2023.",
    faits: [
      "Le pays a créé un institut public chargé d'évaluer les risques des modèles avancés.",
      "Il se positionne comme médiateur entre les approches américaine et européenne."
    ],
    source: "https://fr.wikipedia.org/wiki/Sommet_sur_la_s%C3%BBret%C3%A9_de_l%27IA"
  },
  {
    id: "canada", nom: "Canada", coords: [56.1, -106.3], poids: 1,
    themes: ["modeles"],
    resume: "Berceau de l'apprentissage profond moderne (Geoffrey Hinton à Toronto, Yoshua Bengio et le Mila à Montréal) et premier pays à adopter une stratégie nationale en IA (2017).",
    faits: [
      "Le Canada forme beaucoup de chercheurs, mais une partie part travailler pour les géants américains."
    ],
    source: "https://fr.wikipedia.org/wiki/Mila_(institut_de_recherche)"
  },
  {
    id: "inde", nom: "Inde", coords: [22.0, 79.0], poids: 2,
    themes: ["regulation", "travail"],
    resume: "Immense vivier d'ingénieurs et pays qui se veut porte-parole du « Sud global » dans la gouvernance de l'IA.",
    faits: [
      "La mission IndiaAI finance des capacités de calcul et des modèles en langues indiennes.",
      "L'Inde a co-présidé le sommet de Paris en 2025 et accueilli le sommet suivant sur l'IA à New Delhi en février 2026."
    ],
    source: "https://fr.wikipedia.org/wiki/Inde"
  },
  {
    id: "emirats", nom: "Émirats arabes unis", coords: [24.0, 54.0], poids: 2,
    themes: ["modeles", "ressources"],
    resume: "Les Émirats misent leurs pétrodollars sur l'IA : modèles Falcon, société G42, grands campus de centres de données.",
    faits: [
      "Les Émirats se rapprochent des États-Unis pour accéder aux puces avancées, au prix d'un éloignement des technologies chinoises.",
      "Premier pays à avoir nommé un ministre de l'Intelligence artificielle (2017)."
    ],
    source: "https://fr.wikipedia.org/wiki/%C3%89mirats_arabes_unis"
  },
  {
    id: "arabie", nom: "Arabie saoudite", coords: [23.9, 45.1], poids: 1,
    themes: ["ressources"],
    resume: "Le royaume veut transformer sa rente énergétique en puissance de calcul, avec la création de la société d'IA Humain en 2025.",
    faits: [
      "Énergie abondante et bon marché : un atout pour des centres de données très gourmands en électricité."
    ],
    source: "https://fr.wikipedia.org/wiki/Arabie_saoudite"
  },
  {
    id: "israel", nom: "Israël", coords: [31.0, 34.9], poids: 1,
    themes: ["modeles", "regulation"],
    resume: "Écosystème de start-up très dense et centres de R&D de nombreuses entreprises (Nvidia, Intel, Google).",
    faits: [
      "L'usage de systèmes d'IA dans les opérations militaires y fait l'objet d'un débat international."
    ],
    source: "https://fr.wikipedia.org/wiki/Isra%C3%ABl"
  },
  {
    id: "russie", nom: "Russie", coords: [61.5, 105.3], poids: 1,
    themes: ["regulation"],
    resume: "Ambition affichée dès 2017 par Vladimir Poutine, mais un accès aux puces fortement limité par les sanctions depuis 2022.",
    faits: [
      "Des acteurs comme Yandex et Sber développent des modèles, surtout pour le marché russophone.",
      "L'IA est aussi un outil de guerre informationnelle, selon de nombreux rapports sur la désinformation."
    ],
    source: "https://fr.wikipedia.org/wiki/Russie"
  },
  {
    id: "irlande", nom: "Irlande", coords: [53.4, -8.2], poids: 1,
    themes: ["ressources"],
    resume: "Hub européen des centres de données des géants du numérique, au point de peser lourd sur le réseau électrique national.",
    faits: [
      "Les centres de données ont consommé environ un cinquième de l'électricité du pays en 2023 (office statistique irlandais)."
    ],
    source: "https://fr.wikipedia.org/wiki/Centre_de_donn%C3%A9es"
  },
  {
    id: "rdc", nom: "République démocratique du Congo", coords: [-2.9, 23.6], poids: 2,
    themes: ["ressources", "travail"],
    resume: "Premier producteur mondial de cobalt, métal des batteries et de l'électronique : la face matérielle, souvent invisible, de l'IA.",
    faits: [
      "La RDC fournit environ trois quarts du cobalt mondial, dont une large part est raffinée en Chine.",
      "Les conditions de travail dans les mines artisanales sont régulièrement dénoncées par les ONG."
    ],
    source: "https://fr.wikipedia.org/wiki/Cobalt"
  },
  {
    id: "chili", nom: "Chili", coords: [-30.0, -71.0], poids: 1,
    themes: ["ressources"],
    resume: "Grand producteur de cuivre et de lithium, deux ressources nécessaires aux infrastructures numériques et énergétiques.",
    faits: [
      "L'implantation de centres de données y soulève aussi des débats sur l'usage de l'eau."
    ],
    source: "https://fr.wikipedia.org/wiki/Lithium"
  },
  {
    id: "kenya", nom: "Kenya", coords: [0.2, 37.9], poids: 1,
    themes: ["travail"],
    resume: "Nairobi est un centre du « travail du clic » : annotation de données et modération de contenus pour entraîner les modèles des entreprises occidentales.",
    faits: [
      "Des enquêtes journalistiques (2023) ont révélé les faibles salaires et l'exposition à des contenus choquants de ces travailleurs.",
      "Un enjeu central pour les humanités numériques : le travail humain caché derrière l'IA."
    ],
    source: "https://fr.wikipedia.org/wiki/Travail_du_clic"
  }
];

// Flux et relations entre pays (lignes sur la carte).
const FLUX = [
  { de: "usa",     vers: "chine",  theme: "puces",      label: "Contrôles à l'export des puces avancées" },
  { de: "paysbas", vers: "chine",  theme: "puces",      label: "Restrictions sur les machines de lithographie" },
  { de: "paysbas", vers: "taiwan", theme: "puces",      label: "Machines EUV d'ASML vers TSMC" },
  { de: "taiwan",  vers: "usa",    theme: "puces",      label: "Puces fabriquées par TSMC pour Nvidia & co" },
  { de: "coree",   vers: "usa",    theme: "puces",      label: "Mémoire HBM pour les puces d'IA" },
  { de: "rdc",     vers: "chine",  theme: "ressources", label: "Cobalt raffiné en Chine" },
  { de: "kenya",   vers: "usa",    theme: "travail",    label: "Annotation de données sous-traitée" },
  { de: "usa",     vers: "emirats",theme: "puces",      label: "Accès aux puces contre alignement stratégique" }
];
