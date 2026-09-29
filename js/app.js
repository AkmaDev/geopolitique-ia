// Carte interactive : géopolitique de l'IA
// Données : data/pays.js (THEMES, PAYS, FLUX)

// 1. Création de la carte
const carte = L.map("carte", { worldCopyJump: true, minZoom: 2 }).setView([30, 20], 2);

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 8
}).addTo(carte);

// Thèmes actuellement affichés (tous au départ)
const themesActifs = new Set(Object.keys(THEMES));
const calquePays = L.layerGroup().addTo(carte);
const calqueFlux = L.layerGroup().addTo(carte);

// Retrouver un pays par son identifiant
function trouverPays(id) {
  return PAYS.find(p => p.id === id);
}

// 2. Affichage des pays
function dessinerPays() {
  calquePays.clearLayers();

  PAYS.forEach(pays => {
    // On n'affiche le pays que s'il a au moins un thème actif
    const themesVisibles = pays.themes.filter(t => themesActifs.has(t));
    if (themesVisibles.length === 0) return;

    const couleur = THEMES[themesVisibles[0]].couleur;
    const point = L.circleMarker(pays.coords, {
      radius: 6 + pays.poids * 5,
      color: "#fff",
      weight: 2,
      fillColor: couleur,
      fillOpacity: 0.85
    });

    point.bindTooltip(pays.nom);
    point.on("click", () => afficherFiche(pays));
    point.addTo(calquePays);
  });
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

  document.getElementById("fiche").innerHTML = `
    <h2>${pays.nom}</h2>
    <div class="badges">${badges}</div>
    <p>${pays.resume}</p>
    <h3>Faits clés</h3>
    <ul>${faits}</ul>
    ${relations ? `<h3>Relations</h3><ul>${relations}</ul>` : ""}
    <p class="source"><a href="${pays.source}" target="_blank" rel="noopener">Pour aller plus loin</a></p>
  `;

  carte.flyTo(pays.coords, Math.max(carte.getZoom(), 3), { duration: 0.8 });
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

creerFiltres();
dessinerFlux();
dessinerPays();
