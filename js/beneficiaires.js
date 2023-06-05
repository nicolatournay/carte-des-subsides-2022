export { beneficiairesSelect, initBeneficiairesSelect, getBeneficiaires };

import { closePopups } from "./markers.js";

import { resetMap } from "./map.js";

// capturer l'élément select
var beneficiairesSelect = document.querySelector("#beneficiaires-select");


// ajouter un écouteur d'événement sur l'élément select
function initBeneficiairesSelect(beneficiairesSelect, markers, map) {
    beneficiairesSelect.addEventListener("change", function() {
        if (beneficiairesSelect.value == "0") {
            resetMap();
            closePopups();
        } else {
            var bce = beneficiairesSelect.value;
            var marker = markers[bce];
            if (marker) {
                map.setView(marker.getLatLng(), 19); // zoom to the marker
                marker.openPopup(); // open the popup
            }
        }
        
    });
}

// fonction pour récupérer les noms et les numéros de BCE des bénéficiaires
function getBeneficiaires(data) {
    var listeBeneficiaires = [];
    data.forEach(element => {
        var beneficiaire = {
            nom: element["Nom du bénéficiaire de la subvention"],
            bce: element["Le numéro de BCE du bénéficiaire de la subvention"]
        };
        listeBeneficiaires.push(beneficiaire);
    });
    // trier la liste par ordre alphabétique
    listeBeneficiaires.sort((a, b) => {
        if (a.nom < b.nom) {
            return -1;
        }
        if (a.nom > b.nom) {
            return 1;
        }
        return 0;
    });
    // ajouter les options au select
    listeBeneficiaires.forEach(beneficiaire => {
        var option = document.createElement("option");
        option.value = beneficiaire.bce;
        // raccourcir les noms trop longs
        if (beneficiaire.nom.length > 50) {
            beneficiaire.nom = beneficiaire.nom.substring(0, 50) + "...";
        }
        option.text = beneficiaire.nom;
        beneficiairesSelect.appendChild(option);
    });
}