import { getMarkers } from "./markers.js";

// importer getBeneficiaires
import { getBeneficiaires } from "./beneficiaires.js";

export { getCoordinates };

// fonction pour récupérer les données de géolocalisation
function getCoordinates() {
    fetch("http://localhost:3000/beneficiaires.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // obtenir les montant min. et max.
            var montants = [];
            data.forEach(element => {
                montants.push(parseFloat(element["Montant octroyé"]));
            });
            var min = Math.min(...montants);
            var max = Math.max(...montants);
            // trouver la moyenne des montants
            var moyenne = montants.reduce((a, b) => a + b, 0) / montants.length;
            // trouver l'écart-type des montants
            var ecartType = Math.sqrt(montants.map(x => Math.pow(x - moyenne, 2)).reduce((a, b) => a + b) / montants.length);
            console.log("Montant min. : ", min + "\n" + "Montant max. : ", max + "\n" + "Moyenne : ", moyenne + "\n" + "Ecart-type : ", ecartType);
            // itérer sur les montants pour retirer les valeurs aberrantes
            var montantsFiltres = [];
            var seuil = 1000000;
            montants.forEach(element => {
                if (element <= seuil) {
                    montantsFiltres.push(element);
                }
            });
            // trouver le nouveau min. et max.
            var minFiltre = Math.min(...montantsFiltres);
            var maxFiltre = Math.max(...montantsFiltres);
            console.log("Montant min. (filtre) : ", minFiltre + "\n" + "Montant max. (filtre) : ", maxFiltre);
            // ajouter les marqueurs
            getMarkers(data, minFiltre, maxFiltre, seuil);
            // ajouter les bénéficiaires
            getBeneficiaires(data);
        }).catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
    });
}

