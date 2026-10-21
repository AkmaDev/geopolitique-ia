// Atlas des points de bascule — version 3 (index2.html)
// Données : data/points.js (TBC, CATEGORIES, QUESTIONS, POINTS) et data/countries-110m.json (fond de carte)
//
// Par rapport aux versions 1 et 2 (Leaflet, carte plate), on passe à un globe :
//   - projection orthographique d3 qu'on fait tourner à la souris (ou au doigt) ;
//   - 22 points de bascule, colorés par catégorie ;
//   - une fiche « hypothèse avant lecture » : on écrit ce qu'on pense, puis on révèle l'analyse ;
//   - la progression et les hypothèses sont gardées dans le navigateur (localStorage).

// 1. Réglages
const ROTATION_INITIALE = [-24, -14];
const ZOOM_MIN = 1;
const ZOOM_MAX = 9;
const DUREE_ANIMATION = 780; // ms
const CLE_STOCKAGE = "atlas-chokepoints-v1";
const MODE_REVELATION = "progressif"; // ou "tout" : le premier bouton déroule directement les 10 réponses
const SVG_NS = "http://www.w3.org/2000/svg";

// 2. État de l'application
const etat = {
  rot: ROTATION_INITIALE.slice(), // rotation du globe [longitude, latitude]
  k: 1,                           // zoom
  sel: null,                      // point ouvert dans la fiche
  hover: null,                    // point survolé
  focusCat: null,                 // catégorie dépliée dans la légende
  legendeDepliee: false,          // légende repliée quand la place manque
  stage: {},                      // étape de révélation par point : 0, 1 ou 2 (non conservée)
  perQ: {},                       // questions révélées une par une (non conservées)
  revealed: {},                   // points explorés (conservés)
  notes: {}                       // hypothèses écrites (conservées)
};

// Retrouver un point par son identifiant
function trouverPoint(id) {
  return POINTS.find(p => p.id === id);
}

function estDocumente(p) {
  return Array.isArray(p.answers);
}

// Le texte des données est inséré dans du HTML : on échappe les caractères spéciaux
function echapper(texte) {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 3. Sauvegarde dans le navigateur
// Le localStorage peut être indisponible (navigation privée, stockage bloqué) : la page marche quand même.
function charger() {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE_STOCKAGE) || "{}");
    etat.revealed = brut.revealed || {};
    etat.notes = brut.notes || {};
  } catch (e) {}
}

function sauvegarder() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify({ revealed: etat.revealed, notes: etat.notes }));
  } catch (e) {}
}

// 4. Éléments de la page
const elCarte = document.getElementById("carte");
const elSvg = document.getElementById("globe");
const elZoom = document.getElementById("zoom");
const elSphere = document.getElementById("sphere");
const elGraticule = document.getElementById("graticule");
const elPays = document.getElementById("pays");
const elMarqueurs = document.getElementById("marqueurs");
const elTooltip = document.getElementById("tooltip");
const elLegende = document.getElementById("legende");
const elControles = document.getElementById("controles");
const elAide = document.getElementById("aide");
const elFiche = document.getElementById("fiche");

// 5. Le globe
const projection = d3.geoOrthographic().translate([500, 250]).scale(236).clipAngle(90);
const tracer = d3.geoPath(projection);
const graticule = d3.geoGraticule10();
let formesPays = [];   // { feature, path } pour chaque pays
let cleRotation = "";  // pour ne recalculer les tracés que si la rotation change

function creerSvg(nom, attributs) {
  const el = document.createElementNS(SVG_NS, nom);
  for (const a in attributs) el.setAttribute(a, attributs[a]);
  return el;
}

async function chargerFond() {
  try {
    const reponse = await fetch("data/countries-110m.json");
    const topo = await reponse.json();
    const pays = topojson.feature(topo, topo.objects.countries).features;
    formesPays = pays.map(f => {
      const path = creerSvg("path", {});
      elPays.appendChild(path);
      return { feature: f, path };
    });
    cleRotation = "";
    dessinerGlobe();
  } catch (e) {
    // Sans fond de carte, la sphère et les marqueurs restent utilisables
    console.error("Fond de carte indisponible", e);
  }
}

function dessinerTraces() {
  const cle = etat.rot[0].toFixed(2) + "/" + etat.rot[1].toFixed(2);
  if (cle === cleRotation) return;
  cleRotation = cle;
  projection.rotate(etat.rot);
  elSphere.setAttribute("d", tracer({ type: "Sphere" }));
  elGraticule.setAttribute("d", tracer(graticule));
  formesPays.forEach(({ feature, path }) => {
    path.setAttribute("d", tracer(feature) || "");
  });
}

// 6. Les marqueurs : créés une seule fois, puis mis à jour
// Couches de bas en haut : zone cliquable, halo pulsé, halo d'état, disque, noyau.
const marqueurs = {};

function creerMarqueurs() {
  POINTS.forEach(p => {
    const couleur = CATEGORIES[p.cat].color;
    const g = creerSvg("g", { class: "marqueur", "data-id": p.id });
    const zone = creerSvg("circle", { r: 15, fill: "transparent" });
    const pulse = creerSvg("circle", { class: "pulse", r: 7, stroke: couleur });
    const halo = creerSvg("circle", { fill: couleur });
    const disque = creerSvg("circle", { class: "disque", stroke: couleur });
    const noyau = creerSvg("circle", { r: 1.9, fill: "#0a1216" });
    g.append(zone, pulse, halo, disque, noyau);
    elMarqueurs.appendChild(g);
    marqueurs[p.id] = { g, pulse, halo, disque, noyau };

    g.addEventListener("pointerenter", e => {
      if (e.pointerType !== "mouse" || glisser) return;
      const rg = g.getBoundingClientRect();
      const rs = elSvg.getBoundingClientRect();
      etat.hover = p.id;
      afficherTooltip(rg.left + rg.width / 2 - rs.left, rg.top - rs.top);
      dessinerMarqueurs();
    });
    g.addEventListener("pointerleave", () => {
      if (etat.hover !== p.id) return;
      etat.hover = null;
      cacherTooltip();
      dessinerMarqueurs();
    });
    g.addEventListener("click", () => {
      if (aGlisse) return; // un glisser qui se termine sur un marqueur n'ouvre rien
      ouvrirPoint(p.id);
    });
  });
}

function dessinerMarqueurs() {
  const centre = [-etat.rot[0], -etat.rot[1]];
  POINTS.forEach(p => {
    const m = marqueurs[p.id];
    // On n'affiche que les points de la face visible du globe
    if (d3.geoDistance(p.ll, centre) >= Math.PI / 2) {
      m.g.style.display = "none";
      return;
    }
    m.g.style.display = "";

    const [x, y] = projection(p.ll);
    const couleur = CATEGORIES[p.cat].color;
    const documente = estDocumente(p);
    const explore = !!etat.revealed[p.id];
    const choisi = etat.sel === p.id;
    const survole = etat.hover === p.id;
    const estompe = etat.focusCat && etat.focusCat !== p.cat;

    // scale(1/k) : taille constante à l'écran quel que soit le zoom
    m.g.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + 1 / etat.k + ")");
    m.g.setAttribute("opacity", estompe ? 0.16 : 1);

    m.pulse.style.display = documente && !explore && !estompe ? "" : "none";

    m.halo.setAttribute("r", choisi ? 15 : survole ? 12 : 0);
    m.halo.setAttribute("opacity", choisi ? 0.2 : 0.13);

    m.disque.setAttribute("r", (documente ? 5.4 : 3.6) + (choisi || survole ? 2 : 0));
    m.disque.setAttribute("fill", explore ? couleur : documente ? "#0d1a21" : "#12222b");

    m.noyau.style.display = explore ? "" : "none";
  });
}

// Sur un écran en hauteur (téléphone), on recadre la vue sur le globe pour qu'il ne soit pas minuscule
function cadrerVue() {
  const enHauteur = elCarte.clientWidth / Math.max(1, elCarte.clientHeight) < 1.2;
  elSvg.setAttribute("viewBox", enHauteur ? "250 0 500 500" : "0 0 1000 500");
}

function dessinerGlobe() {
  dessinerTraces();
  const k = etat.k;
  elZoom.setAttribute("transform", "translate(" + 500 * (1 - k) + "," + 250 * (1 - k) + ") scale(" + k + ")");
  elAide.textContent = "zoom ×" + k.toFixed(1) + " · glisser = rotation";
  dessinerMarqueurs();
}

// 7. Tooltip : positionné en pixels mesurés, au-dessus du marqueur (ou dessous près du bord haut)
function afficherTooltip(x, y) {
  const p = trouverPoint(etat.hover);
  if (!p) return;
  const dessous = y < 74;
  document.getElementById("tooltip-cat").textContent = CATEGORIES[p.cat].name;
  document.getElementById("tooltip-nom").textContent = p.name;
  elTooltip.style.left = Math.round(x) + "px";
  elTooltip.style.top = Math.round(dessous ? y + 30 : y) + "px";
  elTooltip.style.transform = "translate(-50%, " + (dessous ? "0" : "-100%") + ")";
  elTooltip.hidden = false;
}

function cacherTooltip() {
  elTooltip.hidden = true;
}

// 8. Rotation au glisser, zoom à la molette et aux boutons
let glisser = null;  // position de départ du glisser en cours
let aGlisse = false; // vrai si le pointeur a vraiment bougé (pour ne pas ouvrir de point)
let imageEnAttente = null;

elSvg.addEventListener("pointerdown", e => {
  if (e.button !== 0) return;
  glisser = { px: e.clientX, py: e.clientY, r0: etat.rot[0], r1: etat.rot[1] };
  aGlisse = false;
});

window.addEventListener("pointermove", e => {
  if (!glisser) return;
  const dx = e.clientX - glisser.px;
  const dy = e.clientY - glisser.py;
  if (!aGlisse && Math.abs(dx) + Math.abs(dy) < 4) return;
  if (!aGlisse) {
    aGlisse = true;
    elSvg.classList.add("glisse");
    etat.hover = null;
    cacherTooltip();
  }
  animation = null; // un glisser annule l'animation en cours
  const sensibilite = 0.42 / etat.k;
  const lon = glisser.r0 + dx * sensibilite;
  const lat = Math.max(-88, Math.min(88, glisser.r1 - dy * sensibilite));
  if (imageEnAttente) return;
  imageEnAttente = requestAnimationFrame(() => {
    imageEnAttente = null;
    etat.rot = [lon, lat];
    dessinerGlobe();
  });
});

window.addEventListener("pointerup", () => {
  glisser = null;
  elSvg.classList.remove("glisse");
  // aGlisse reste vrai jusqu'au clic qui suit ce relâchement, puis on le remet à zéro
  setTimeout(() => { aGlisse = false; }, 0);
});
window.addEventListener("pointercancel", () => {
  glisser = null;
  aGlisse = false;
  elSvg.classList.remove("glisse");
});

function zoomer(facteur) {
  animation = null;
  etat.k = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, etat.k * facteur));
  dessinerGlobe();
}

elSvg.addEventListener("wheel", e => {
  e.preventDefault();
  zoomer(e.deltaY < 0 ? 1.1 : 1 / 1.1);
}, { passive: false });

document.getElementById("zoom-plus").addEventListener("click", () => zoomer(1.5));
document.getElementById("zoom-moins").addEventListener("click", () => zoomer(1 / 1.5));
document.getElementById("recadrer").addEventListener("click", () => {
  etat.focusCat = null;
  animerVers(ROTATION_INITIALE, 1);
  dessinerLegende();
  dessinerMarqueurs();
});

// 9. Animation vers une rotation et un zoom (easeOutCubic, chemin le plus court en longitude)
let animation = null;

function animerVers(rotCible, kCible) {
  const depart = { lon: etat.rot[0], lat: etat.rot[1], k: etat.k };
  const dLon = ((rotCible[0] - depart.lon + 540) % 360) - 180;
  const t0 = performance.now();
  etat.hover = null;
  cacherTooltip();

  const etape = maintenant => {
    if (animation !== etape) return; // une autre action a annulé cette animation
    const t = Math.min(1, (maintenant - t0) / DUREE_ANIMATION);
    const e = 1 - Math.pow(1 - t, 3);
    etat.rot = [depart.lon + dLon * e, depart.lat + (rotCible[1] - depart.lat) * e];
    etat.k = depart.k + (kCible - depart.k) * e;
    dessinerGlobe();
    if (t < 1) requestAnimationFrame(etape);
    else animation = null;
  };
  animation = etape;
  requestAnimationFrame(etape);
}

// 10. Ouvrir et fermer un point
function ouvrirPoint(id) {
  const p = trouverPoint(id);
  if (!p) return;
  const dejaOuverte = etat.sel !== null;
  etat.sel = id;
  if (!dejaOuverte) etat.legendeDepliee = false;
  animerVers([-p.ll[0], -p.ll[1]], Math.max(etat.k, 2.3));
  dessinerFiche(!dejaOuverte);
  dessinerLegende();
  dessinerMarqueurs();
}

function fermerFiche() {
  etat.sel = null;
  dessinerFiche(false);
  dessinerLegende();
  dessinerMarqueurs();
}

function marquerExplore(id) {
  if (etat.revealed[id]) return;
  etat.revealed[id] = true;
  sauvegarder();
  dessinerLegende();
  dessinerMarqueurs();
}

// 11. Légende « Exploration »
// Quand la place manque (fiche ouverte ou petit écran), elle se replie en une ligne qu'on déplie au clic.
function legendeRepliable() {
  return etat.sel !== null || elCarte.clientWidth < 560;
}

function dessinerLegende() {
  const total = POINTS.filter(p => etat.revealed[p.id]).length;
  const repliable = legendeRepliable();
  const repliee = repliable && !etat.legendeDepliee;
  elLegende.classList.toggle("repliee", repliee);

  let html = '<div class="legende-entete' + (repliable ? " cliquable" : "") + '" data-action="replier">' +
    "<span>Exploration" + (repliable ? (repliee ? " ▸" : " ▾") : "") + "</span>" +
    '<span class="total">' + total + " / " + POINTS.length + "</span></div>";

  if (!repliee) {
    Object.keys(CATEGORIES).forEach(cle => {
      const cat = CATEGORIES[cle];
      const liste = POINTS.filter(p => p.cat === cle);
      const faits = liste.filter(p => etat.revealed[p.id]).length;
      const depliee = etat.focusCat === cle;
      html += "<div>" +
        '<div class="categorie" data-cat="' + cle + '">' +
          '<span class="pastille" style="background:' + cat.color + '"></span>' +
          '<span class="categorie-texte">' +
            '<span class="categorie-nom" style="color:' + (depliee ? "var(--texte-titre)" : "var(--texte)") + '">' + echapper(cat.name) + "</span>" +
            '<span class="barre"><span style="width:' + Math.round((faits / liste.length) * 100) + "%;background:" + cat.color + '"></span></span>' +
          "</span>" +
          '<span class="compte">' + faits + "/" + liste.length + "</span>" +
        "</div>";
      if (depliee) {
        html += '<div class="liste">';
        liste.forEach(p => {
          const explore = !!etat.revealed[p.id];
          const puce = explore ? "●" : estDocumente(p) ? "○" : "·";
          html += '<div class="liste-point" data-point="' + p.id + '">' +
            '<span class="puce" style="color:' + (explore ? cat.color : "var(--puce-non-lue)") + '">' + puce + "</span>" +
            '<span class="nom" style="color:' + (etat.sel === p.id ? "var(--texte-titre)" : "var(--texte-second)") + '">' + echapper(p.name) + "</span>" +
          "</div>";
        });
        html += "</div>";
      }
      html += "</div>";
    });
  }

  elLegende.innerHTML = html;
  placerControles();
}

elLegende.addEventListener("click", e => {
  const point = e.target.closest("[data-point]");
  if (point) return ouvrirPoint(point.dataset.point);

  const cat = e.target.closest("[data-cat]");
  if (cat) {
    // Déplier une catégorie n'ouvre jamais un point : c'est l'utilisateur qui choisit dans la liste
    etat.focusCat = etat.focusCat === cat.dataset.cat ? null : cat.dataset.cat;
    dessinerLegende();
    dessinerMarqueurs();
    return;
  }

  if (e.target.closest('[data-action="replier"]') && legendeRepliable()) {
    etat.legendeDepliee = !etat.legendeDepliee;
    dessinerLegende();
  }
});

// Si la légende et les contrôles se chevauchent, on remonte les contrôles au-dessus de la légende
function placerControles() {
  elControles.style.bottom = "";
  const rl = elLegende.getBoundingClientRect();
  const rc = elControles.getBoundingClientRect();
  if (rl.right + 8 > rc.left && rl.left < rc.right) {
    const rCarte = elCarte.getBoundingClientRect();
    elControles.style.bottom = Math.round(rCarte.bottom - rl.top + 10) + "px";
  }
}

// 12. La fiche
function formaterCoords(ll) {
  const [lon, lat] = ll;
  return Math.abs(lat).toFixed(2) + "° " + (lat >= 0 ? "N" : "S") + " · " +
    Math.abs(lon).toFixed(2) + "° " + (lon >= 0 ? "E" : "O");
}

// Blocs déjà affichés dans la fiche : on ne rejoue pas leur animation d'apparition au redessin
let blocsAffiches = new Set();

function apparition(cle) {
  if (blocsAffiches.has(cle)) return " fixe";
  blocsAffiches.add(cle);
  return "";
}

function dessinerFiche(entree) {
  if (!etat.sel) {
    elFiche.hidden = true;
    elFiche.innerHTML = "";
    requestAnimationFrame(() => { cadrerVue(); placerControles(); });
    return;
  }

  const p = trouverPoint(etat.sel);
  if (elFiche.dataset.point !== p.id || entree) blocsAffiches = new Set();
  const cat = CATEGORIES[p.cat];
  const documente = estDocumente(p);
  const etape = etat.stage[p.id] || 0;
  const parQuestion = etat.perQ[p.id] || {};
  const defilement = elFiche.dataset.point === p.id ? elFiche.scrollTop : 0;

  let html =
    '<div class="fiche-entete">' +
      "<div>" +
        '<div class="fiche-cat"><span class="pastille" style="background:' + cat.color + '"></span>' +
        '<span class="label">' + echapper(cat.name) + "</span></div>" +
        "<h2>" + echapper(p.name) + "</h2>" +
        '<div class="coords">' + formaterCoords(p.ll) + "</div>" +
      "</div>" +
      '<button type="button" class="fermer" data-action="fermer" aria-label="Fermer la fiche">✕</button>' +
    "</div>" +
    '<div class="fiche-corps">' +
      '<p class="brief">' + echapper(p.brief || "Point identifié dans l'atlas. Analyse vérifiée non encore établie.") + "</p>" +
      '<div class="hypothese">' +
        '<div class="label">Avant de lire — votre hypothèse</div>' +
        "<p>D'où vient le levier de ce point, selon vous ? Une ou deux phrases suffisent. Rien n'est corrigé, rien n'est noté.</p>" +
        '<textarea id="note" placeholder="Écrire ici…">' + echapper(etat.notes[p.id] || "") + "</textarea>" +
      "</div>";

  // Bouton principal : dans le flux normal (jamais collant, il recouvrirait l'hypothèse)
  if (documente && etape < 2) {
    html += '<div class="action' + apparition("action") + '">' +
      '<button type="button" data-action="principal">' + (etape === 0 ? "Voir l'analyse vérifiée" : "Dérouler les 10 réponses") + "</button>" +
      "<p>" + (etape === 0
        ? "Formulez d'abord votre hypothèse — la comparaison est tout l'intérêt."
        : "Ou révélez question par question, à votre rythme.") + "</p>" +
    "</div>";
  }

  let revelees = 0;
  let questions = "";
  QUESTIONS.forEach((q, i) => {
    const reponse = documente ? p.answers[i] : null;
    const visible = documente && (etape >= 2 || parQuestion[i]);
    if (visible) revelees++;
    questions += '<div class="question">' +
      '<div class="numero">' + String(i + 1).padStart(2, "0") + "</div>" +
      '<div class="contenu">' +
        '<div class="intitule">' + echapper(q.title) + "</div>" +
        '<div class="indice">' + echapper(q.hint) + "</div>";
    if (visible) {
      questions += '<div class="reponse' + apparition("q" + i) + '" style="border-left-color:' + cat.color + '"><p>' + echapper(reponse) + "</p>" +
        (reponse === TBC ? '<div class="badge-tbc">Non confirmé — à vérifier</div>' : "") + "</div>";
    } else if (documente && etape >= 1) {
      questions += '<button type="button" class="reveler" data-question="' + i + '">Révéler cette réponse</button>';
    }
    questions += "</div></div>";
  });

  html += '<div class="grille-entete">' +
      '<div class="label">Grille d\'analyse — 10 questions</div>' +
      '<div class="compte-grille">' + (documente ? revelees + " révélée(s)" : "grille de réflexion") + "</div>" +
    "</div>" + questions;

  if (documente && etape >= 1) {
    html += '<div class="rouage' + apparition("rouage") + '"><div class="label" style="color:' + cat.color + '">Le rouage</div>' +
      "<p>" + echapper(p.verdict) + "</p></div>";
  }

  if (!documente) {
    html += '<div class="non-doc"><div class="label">Fiche non documentée</div>' +
      "<p>L'analyse vérifiée de ce point n'a pas encore été établie. La grille reste utilisable : formulez votre hypothèse, elle est conservée localement. Aucune réponse n'est affichée ici tant qu'elle n'est pas sourcée.</p></div>";
  }

  if (documente && etape >= 1) {
    html += '<div class="sources"><div class="label">Sources</div><ul>' +
      (p.sources || []).map(s => "<li><span>" + echapper(s) + "</span></li>").join("") +
      '</ul><p class="avertissement">Références issues du dossier de travail — à re-vérifier à la source avant toute réutilisation publique.</p></div>';
  }

  html += "</div>";

  elFiche.hidden = false;
  elFiche.dataset.point = p.id;
  elFiche.innerHTML = html;
  elFiche.scrollTop = defilement;
  if (entree) {
    elFiche.classList.remove("entree");
    void elFiche.offsetWidth; // relance l'animation d'entrée
    elFiche.classList.add("entree");
  }
  // La carte a rétréci : on recalcule la légende et la place des contrôles
  requestAnimationFrame(() => {
    cadrerVue();
    dessinerLegende();
  });
}

elFiche.addEventListener("click", e => {
  if (e.target.closest('[data-action="fermer"]')) return fermerFiche();
  const p = trouverPoint(etat.sel);
  if (!p) return;

  if (e.target.closest('[data-action="principal"]')) {
    const etape = etat.stage[p.id] || 0;
    etat.stage[p.id] = MODE_REVELATION === "tout" ? 2 : etape === 0 ? 1 : 2;
    marquerExplore(p.id);
    dessinerFiche(false);
    return;
  }

  const bouton = e.target.closest("[data-question]");
  if (bouton) {
    etat.perQ[p.id] = Object.assign({}, etat.perQ[p.id], { [bouton.dataset.question]: true });
    marquerExplore(p.id);
    dessinerFiche(false);
  }
});

// L'hypothèse est enregistrée à chaque frappe, sans redessiner la fiche (on garde le curseur)
elFiche.addEventListener("input", e => {
  if (e.target.id !== "note" || !etat.sel) return;
  etat.notes[etat.sel] = e.target.value;
  sauvegarder();
});

// 13. Démarrage
window.addEventListener("resize", () => {
  cadrerVue();
  dessinerLegende();
});

charger();
cadrerVue();
creerMarqueurs();
dessinerGlobe();
dessinerLegende();
chargerFond();
