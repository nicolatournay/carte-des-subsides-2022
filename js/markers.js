export { markers, getMarkers };

// importer la carte
import { map } from './map.js';

// importation de la fonction redgreen depuis colors.js
import { redgreen } from "./colors.js";

// importer getDetails
import { getDetails } from "./details.js";

// ensemble des marqueurs
var markers = {};

// fonction pour ajouter les marqueurs
function getMarkers(data, min, max, seuil) {
    data.forEach(element => {
        // isoler le montant
        var montant = parseFloat(element["Montant octroyé"]);
        // normaliser le montant
        var normalizedMontant = (montant - min) / (max - min);
        // ajouter les marqueurs
        var circleMarker = L.circleMarker([parseFloat(element["Latitude"]), parseFloat(element["Longitude"])], {
            fillColor: redgreen(normalizedMontant),
            color: redgreen(normalizedMontant),
            radius: 10,
            opacity: 1,
            fillOpacity: 0.4
        }).addTo(map);
        var popupContent = `
            <h3>${element["Nom du bénéficiaire de la subvention"]}</h3>
            <p><strong>Total :</strong> ${element["Montant octroyé"]}€</p>
            <p>${element["Rue"]} ${element["Numéro de maison"]}, ${element["Code postal"]} ${element["Commune"]}</p>
            <p class="opendetails" data-q="${element["Le numéro de BCE du bénéficiaire de la subvention"]}">En savoir +</p>
        `;
        circleMarker.bindPopup(popupContent);
        // ajouter un événement click à la balise p ayant la classe "opendetails" quand le popup est ouvert
        circleMarker.on("popupopen", function() {
            var opendetails = document.querySelector(".opendetails");
            opendetails.addEventListener("click", function() {
                // récupérer le numéro de BCE
                var q = this.getAttribute("data-q");
                // récupérer les détails
                getDetails(q);
            });
        });
        markers[element["Le numéro de BCE du bénéficiaire de la subvention"]] = circleMarker;
    });
}