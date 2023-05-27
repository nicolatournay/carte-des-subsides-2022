export { markers, getMarkers };

// importer la carte
import { map } from './map.js';

// importation de la fonction redgreen depuis colors.js
import { getColor } from "./colors.js";

// importer getDetails
import { getDetails } from "./details.js";

// importer formatNumber
import { formatNumber } from './numbers.js';

// importer la fonction getContact
import { getContact } from './contact.js';

// ensemble des marqueurs
var markers = {};

// fonction pour ajouter les marqueurs
function getMarkers(data) {
    data.forEach(element => {
        // isoler le montant
        var montant = parseFloat(element["Montant octroyé"]);
        // isoler le type de contact
        var contactType = element["Type de contact"];
        // isoler le contact
        var contact = element["Donnée de contact"];
        // ajouter les marqueurs
        var circleMarker = L.circleMarker([parseFloat(element["Latitude"]), parseFloat(element["Longitude"])], {
            fillColor: getColor(montant),
            color: getColor(montant),
            radius: 10,
            opacity: 1,
            fillOpacity: 0.4
        }).addTo(map);
        var popupContent = `
            <h3>${element["Nom du bénéficiaire de la subvention"]}</h3>
            <p><strong>Total :</strong> ${formatNumber(montant)} €</p>
            <p>${element["Rue"]} ${element["Numéro de maison"]}, ${element["Code postal"]} ${element["Commune"]}</p>
            ${getContact(contactType, contact)}
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