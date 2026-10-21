// Données de l'atlas des points de bascule (version 3). Copie de data/points.ts du dossier de conception.
// Règle de rigueur : aucune réponse inventée. Une réponse inconnue = la constante TBC,
// affichée avec le badge « Non confirmé — à vérifier ».

const TBC = "Non confirmé — à vérifier.";

const CATEGORIES = {
  detroits:   { name: "Détroits et canaux",               color: "#5BA8D0" },
  ressources: { name: "Ressources et minerais",           color: "#E8765A" },
  numerique:  { name: "Infrastructure numérique",         color: "#A98CE0" },
  finance:    { name: "Finance et monnaie",               color: "#5FBF97" },
  eau:        { name: "Alimentation et eau",              color: "#E8A33D" },
  savoir:     { name: "Savoir et technologie",            color: "#E88AB0" },
  influence:  { name: "Influence et postures militaires", color: "#6FBFB5" },
};

// Ordre d'affichage de la légende = ordre des clés ci-dessus.

const QUESTIONS = [
  { title: "Ressources réelles",            hint: "Qu'est-ce qu'il y a concrètement sur place ?" },
  { title: "Position et échelle",           hint: "Qu'est-ce que ce point permet de contrôler ou de faire passer, du local au mondial ?" },
  { title: "Qui a intérêt à contrôler ça",  hint: "Et quels accords ou actions concrets le prouvent ?" },
  { title: "Trajectoire historique",        hint: "Accident géographique, ou décision délibérée poursuivie dans le temps ?" },
  { title: "Test de rupture",               hint: "Si ce point était coupé demain, qui souffre le plus, qui souffre le moins ?" },
  { title: "Asymétrie",                     hint: "Dans la relation, qui a le plus besoin de l'autre ?" },
  { title: "Contre-stratégies réelles",     hint: "Qui tente de réduire sa dépendance, avec quel succès mesurable ?" },
  { title: "Fenêtre temporelle",            hint: "Avantage stable sur des décennies, ou fenêtre en train de se refermer ?" },
  { title: "Dépendances cachées en amont",  hint: "Ce point dépend-il lui-même d'un point de contrôle plus en amont ?" },
  { title: "Qui paie le prix invisible",    hint: "Quelle population subit les conséquences sans toucher au pouvoir généré ?" },
];

const POINTS = [
  { id: "ormuz",   name: "Détroit d'Ormuz",    cat: "detroits", ll: [56.3, 26.5] },
  { id: "suez",    name: "Canal de Suez",      cat: "detroits", ll: [32.3, 30.5] },
  { id: "malacca", name: "Détroit de Malacca", cat: "detroits", ll: [101.5, 2.5] },
  { id: "panama",  name: "Canal de Panama",    cat: "detroits", ll: [-79.7, 9.1] },
  { id: "bab",     name: "Bab-el-Mandeb",      cat: "detroits", ll: [43.4, 12.6] },

  { id: "cobalt",  name: "Cobalt du Katanga",       cat: "ressources", ll: [25.5, -10.7] },
  { id: "lithium", name: "Triangle du lithium",     cat: "ressources", ll: [-67, -23] },
  { id: "uranium", name: "Uranium d'Arlit",         cat: "ressources", ll: [7.4, 18.7] },
  { id: "gaz",     name: "Gaz russe vers l'Europe", cat: "ressources", ll: [15.5, 55.0] },
  {
    id: "terresrares", name: "Terres rares — le raffinage chinois", cat: "ressources", ll: [109.8, 40.6],
    brief: "La Chine détient une part minoritaire des réserves mondiales. Son levier est ailleurs.",
    verdict: "La Chine ne possède pas les terres rares. Elle possède l'étape qui les rend utilisables.",
    answers: [
      "Environ 35 % des réserves mondiales de terres rares seulement — une dotation géologique importante, mais loin d'un monopole.",
      "Le levier est industriel, pas minier : environ 90 % de la capacité mondiale de raffinage et de transformation, 80 % du raffinage du tungstène, 60 % de la production d'antimoine. Le minerai peut sortir d'ailleurs ; l'étape qui le rend utilisable, presque pas.",
      "La Chine elle-même. Le mécanisme est un régime de licences non automatiques à l'export : chaque autorisation devient un point de décision politique. Les contrôles ont été étendus en janvier 2026 au samarium, au gadolinium et au lutétium.",
      "Construction délibérée et longue, pas un hasard : durcissement des contrôles à l'export en 2025-2026, avec moins de 25 % de licences approuvées pour les entreprises européennes et des prix multipliés jusqu'à 6 depuis les restrictions.",
      TBC,
      TBC,
      "L'OTAN a reconnu officiellement les terres rares comme enjeu de sécurité de défense (sommet de juin 2025) ; un sommet ministériel de 54 pays s'est tenu en février 2026 ; côté programmes, FORGE, Project Vault et le CRMA européen. Mais la reconstruction d'une chaîne indépendante est estimée à 20-30 ans par les analystes.",
      "Fenêtre de décision estimée à 12-18 mois par les analystes du CSIS avant que la dépendance ne devienne durablement ancrée.",
      TBC,
      TBC,
    ],
    sources: [
      "Contrôles à l'export chinois 2025-2026 (extension de janvier 2026 au samarium, gadolinium, lutétium)",
      "Déclaration du sommet de l'OTAN, juin 2025 — terres rares comme enjeu de sécurité de défense",
      "CSIS — analyse de la fenêtre de décision de 12 à 18 mois",
      "Programmes FORGE, Project Vault, Critical Raw Materials Act (UE)",
    ],
  },

  { id: "marseille", name: "Câbles sous-marins — Marseille",  cat: "numerique", ll: [5.37, 43.3] },
  { id: "singapour", name: "Câbles sous-marins — Singapour",  cat: "numerique", ll: [103.85, 1.29] },
  { id: "ashburn",   name: "Data centers — Virginie du Nord", cat: "numerique", ll: [-77.5, 39.0] },
  { id: "piree",     name: "Port du Pirée",                   cat: "numerique", ll: [23.65, 37.94] },

  { id: "dollar", name: "Le dollar comme monnaie de réserve", cat: "finance", ll: [-74.0, 40.7] },
  { id: "swift",  name: "SWIFT",                              cat: "finance", ll: [4.35, 50.85] },

  { id: "gerd",   name: "Barrage de la Renaissance (GERD)", cat: "eau", ll: [35.1, 11.2] },
  { id: "odessa", name: "Céréales et mer Noire",            cat: "eau", ll: [30.73, 46.48] },

  { id: "uit",     name: "Normes techniques mondiales (UIT)", cat: "savoir", ll: [6.14, 46.22] },
  { id: "svalley", name: "Talents en IA — Silicon Valley",    cat: "savoir", ll: [-122.1, 37.4] },
  {
    id: "taiwan", name: "Taïwan — le goulot des semi-conducteurs", cat: "savoir", ll: [120.68, 24.15],
    brief: "Une île sans ressource particulière, dont dépend chaque puce avancée fabriquée dans le monde.",
    verdict: "Le monopole n'est pas géologique, il est industriel — donc reproductible, mais lentement.",
    answers: [
      "Aucune ressource naturelle particulière liée aux puces elles-mêmes. Le sous-sol n'entre pas dans l'équation.",
      "TSMC produit environ 90 % des semi-conducteurs les plus avancés au monde (5 nm et moins). En amont, ASML (Pays-Bas) est le seul fournisseur mondial de lithographie EUV. Chaque GPU Nvidia, chaque processeur Apple, chaque puce d'IA passe par cette chaîne.",
      "Les États-Unis, via les règles d'octobre 2024 interdisant l'export des GPU Nvidia H100/H200/B100/B200 vers la Chine ; la Chine, qui pousse SMIC comme concurrent domestique ; l'Europe, qui reconnaît officiellement sa dépendance stratégique.",
      TBC,
      TBC,
      TBC,
      "Le CHIPS Act américain : 52 milliards de dollars orientés vers TSMC Arizona, Intel Ohio, Samsung Texas, Micron New York. Résultat mesurable : l'usine TSMC d'Arizona a atteint la parité de rendement avec Taïwan (88-92 %) en 4 nm dès février 2026 — la duplication est donc possible, à ce coût et sur cette durée.",
      "Bloomberg Economics estime l'impact d'un conflit sur Taïwan à environ 10 000 milliards de dollars, soit près de 10 % du PIB mondial.",
      "Oui : la lithographie EUV d'ASML, aux Pays-Bas. Taïwan est un goulot qui dépend lui-même d'un fournisseur unique en amont.",
      TBC,
    ],
    sources: [
      "Règles d'export américaines d'octobre 2024 sur les GPU Nvidia H100/H200/B100/B200",
      "CHIPS and Science Act — dotations annoncées (52 Md$)",
      "Bloomberg Economics — estimation du coût mondial d'un conflit sur Taïwan (~10 000 Md$)",
      "Rendements TSMC Arizona en 4 nm, février 2026",
    ],
  },

  {
    id: "rca", name: "Centrafrique — le glacis français", cat: "influence", ll: [20.9, 6.6],
    brief: "Un pays pauvre en ressources, au centre exact d'une région qui en regorge.",
    verdict: "La valeur du pays n'est pas dans son sol, mais dans ce qu'il permet de surveiller autour de lui.",
    answers: [
      "Pas particulièrement riche en ressources minières au regard de ses voisins. Ce n'est pas la dotation locale qui explique l'attention portée au pays.",
      "Entourée de pays riches en ressources — le Zaïre / RDC notamment. Elle fonctionne comme glacis stratégique : un contrôle militaire et logistique sur toute la région, sans occupation directe de ce que l'on veut surveiller.",
      "La France, via le réseau informel piloté par Jacques Foccart (la « cellule africaine » de l'Élysée), les services de renseignement (SDECE puis DGSE), les accords de défense et les bases militaires. Preuves concrètes : l'affaire des diamants de Bokassa et Giscard d'Estaing, l'affaire Elf et son financement occulte jugé dans les années 2000, le rôle de Jean-Christophe Mitterrand (« Papamadit ») à la cellule africaine.",
      "Décision délibérée, pas accident : un héritage colonial saisi puis entretenu après les indépendances de 1960, sous De Gaulle puis ses successeurs.",
      TBC, TBC, TBC, TBC, TBC, TBC,
    ],
    sources: [
      "Travaux et archives publiés sur la « cellule africaine » de l'Élysée (Jacques Foccart)",
      "Procédures judiciaires de l'affaire Elf, jugées en France dans les années 2000",
      "Affaire des diamants Bokassa / Giscard d'Estaing — presse française contemporaine (1979)",
    ],
  },
];
