// Carte interactive : géopolitique de l'IA — version 2 (index1.html)
// Données : data/pays.js (THEMES, PAYS, FLUX) et data/evenements.js (EVENEMENTS)
//
// Par rapport à la version 1 (js/app.js, inchangée), on ajoute :
//   - une frise chronologique (curseur d'année + liste d'événements) ;
//   - un menu pour aller directement à un pays ;
//   - un compteur d'acteurs affichés ;
//   - une adresse partageable : index1.html#taiwan ouvre directement la fiche de Taïwan.

// 1. Création de la carte
const carte = L.map("carte", { worldCopyJump: true, minZoom: 2 }).setView([30, 20], 2);

// Fond de carte OpenStreetMap (gratuit, sans clé). CARTO demande désormais une clé d'API.
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 8
}).addTo(carte);

// État de l'application
const themesActifs = new Set(Object.keys(THEMES));
const ANNEE_MIN = Math.min(...EVENEMENTS.map(e => e.annee));
const ANNEE_MAX = Math.max(...EVENEMENTS.map(e => e.annee));
let anneeChoisie = ANNEE_MAX;
let friseUtilisee = false; // on ne met des anneaux sur la carte qu'une fois le curseur déplacé

const calquePays = L.layerGroup().addTo(carte);
const calqueFlux = L.layerGroup().addTo(carte);

// Retrouver un pays par son identifiant
function trouverPays(id) {
  return PAYS.find(p => p.id === id);
}

// 2. Affichage des pays
function dessinerPays() {
  calquePays.clearLayers();
  let affiches = 0;

  PAYS.forEach(pays => {
    // On n'affiche le pays que s'il a au moins un thème actif
    const themesVisibles = pays.themes.filter(t => themesActifs.has(t));
    if (themesVisibles.length === 0) return;
    affiches++;

    // Anneau sombre autour des pays concernés par un événement de l'année choisie
    const surligne = friseUtilisee &&
      EVENEMENTS.some(e => e.pays === pays.id && e.annee === anneeChoisie);

    const point = L.circleMarker(pays.coords, {
      radius: 6 + pays.poids * 5,
      color: surligne ? "#111827" : "#fff",
      weight: surligne ? 4 : 2,
      fillColor: THEMES[themesVisibles[0]].couleur,
      fillOpacity: 0.85
    });

    point.bindTooltip(pays.nom);
    point.on("click", () => selectionner(pays.id));
    point.addTo(calquePays);
  });

  document.getElementById("compteur").textContent =
    `${affiches} acteur${affiches > 1 ? "s" : ""} affiché${affiches > 1 ? "s" : ""} sur ${PAYS.length}`;
}

// 3. Affichage des flux (lignes entre deux pays)
function dessinerFlux() {
  calqueFlux.clearLayers();
  if (!document.getElementById("afficher-flux").checked) return;

  FLUX.forEach(flux => {
    if (!themesActifs.has(flux.theme)) return;
    const depart = trouverPays(flux.de);
    const arrivee = trouverPays(flux.vers);

    L.polyline([depart.coords, arrivee.coords], {
      color: THEMES[flux.theme].couleur,
      weight: 2,
      opacity: 0.6,
      dashArray: "6 6"
    })
      .bindTooltip(`${depart.nom} → ${arrivee.nom} : ${flux.label}`, { sticky: true })
      .addTo(calqueFlux);
  });
}

// 4. Fiche d'un pays dans le panneau latéral
function afficherFiche(pays) {
  const badges = pays.themes
    .map(t => `<span class="badge" style="background:${THEMES[t].couleur}">${THEMES[t].nom}</span>`)
    .join("");

  const faits = pays.faits.map(f => `<li>${f}</li>`).join("");

  const relations = FLUX
    .filter(f => f.de === pays.id || f.vers === pays.id)
    .map(f => `<li>${trouverPays(f.de).nom} → ${trouverPays(f.vers).nom} : ${f.label}</li>`)
    .join("");

  const chrono = EVENEMENTS
    .filter(e => e.pays === pays.id)
    .sort((a, b) => a.annee - b.annee)
    .map(e => `<li><strong>${e.annee}</strong> — ${e.texte}</li>`)
    .join("");

  document.getElementById("fiche").innerHTML = `
    <h2>${pays.nom}</h2>
    <div class="badges">${badges}</div>
    <p>${pays.resume}</p>
    <h3>Faits clés</h3>
    <ul>${faits}</ul>
    ${chrono ? `<h3>Chronologie</h3><ul class="chrono">${chrono}</ul>` : ""}
    ${relations ? `<h3>Relations</h3><ul>${relations}</ul>` : ""}
    <p class="source"><a href="${pays.source}" target="_blank" rel="noopener">Pour aller plus loin</a></p>
  `;
}

// Sélectionner un pays : fiche, zoom, menu et adresse de la page
function selectionner(id) {
  const pays = trouverPays(id);
  if (!pays) return;

  afficherFiche(pays);
  carte.flyTo(pays.coords, Math.max(carte.getZoom(), 3), { duration: 0.8 });
  document.getElementById("choix-pays").value = id;
  history.replaceState(null, "", "#" + id);
}

// 5. Filtres par thème (cases à cocher)
function creerFiltres() {
  const conteneur = document.getElementById("filtres");

  Object.entries(THEMES).forEach(([cle, theme]) => {
    const label = document.createElement("label");
    label.className = "option";
    label.innerHTML = `
      <input type="checkbox" value="${cle}" checked>
      <span class="pastille" style="background:${theme.couleur}"></span>
      ${theme.nom}
    `;
    label.querySelector("input").addEventListener("change", e => {
      if (e.target.checked) themesActifs.add(cle);
      else themesActifs.delete(cle);
      dessinerPays();
      dessinerFlux();
    });
    conteneur.appendChild(label);
  });

  document.getElementById("afficher-flux").addEventListener("change", dessinerFlux);
}

// 6. Menu « Aller à un pays » (ordre alphabétique)
function creerMenuPays() {
  const menu = document.getElementById("choix-pays");

  [...PAYS]
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))
    .forEach(pays => {
      const option = document.createElement("option");
      option.value = pays.id;
      option.textContent = pays.nom;
      menu.appendChild(option);
    });

  menu.addEventListener("change", () => {
    if (menu.value) selectionner(menu.value);
  });
}

// 7. Frise chronologique : curseur d'année et liste des événements
function afficherEvenements() {
  document.getElementById("annee-affichee").textContent = anneeChoisie;

  const liste = document.getElementById("evenements");
  liste.replaceChildren();

  EVENEMENTS
    .filter(e => e.annee <= anneeChoisie)
    .sort((a, b) => a.annee - b.annee)
    .forEach(e => {
      const li = document.createElement("li");
      if (friseUtilisee && e.annee === anneeChoisie) li.className = "courant";

      const bouton = document.createElement("button");
      bouton.type = "button";

      const annee = document.createElement("span");
      annee.className = "annee";
      annee.textContent = e.annee;

      const texte = document.createElement("span");
      texte.textContent = `${trouverPays(e.pays).nom} : ${e.texte}`;

      bouton.append(annee, texte);
      bouton.addEventListener("click", () => selectionner(e.pays));
      li.appendChild(bouton);
      liste.appendChild(li);
    });
}

function creerFrise() {
  const curseur = document.getElementById("annee");
  curseur.min = ANNEE_MIN;
  curseur.max = ANNEE_MAX;
  curseur.value = ANNEE_MAX;

  curseur.addEventListener("input", () => {
    anneeChoisie = Number(curseur.value);
    friseUtilisee = true;
    afficherEvenements();
    dessinerPays();
  });

  afficherEvenements();
}

// 8. Démarrage : si l'adresse contient #identifiant, on ouvre la fiche correspondante
creerFiltres();
creerMenuPays();
creerFrise();
dessinerFlux();
dessinerPays();

const idDansAdresse = location.hash.slice(1);
if (idDansAdresse) selectionner(idDansAdresse);
