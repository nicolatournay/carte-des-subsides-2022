import Color from "https://colorjs.io/dist/color.js";

// déterminer un espace de couleur entre vert et rouge
let color = new Color("p3", [0, 1, 0]);
let redgreen = color.range("red", {
	space: "lch", // interpolation space
	outputSpace: "srgb"
});

// initialiser la carte
var map = L.map('map').setView([50.8465573, 4.351697], 12);

// charger la couche tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ensemble des marqueurs
var markers = {};

// fonction pour ajouter les marqueurs
function getMarkers(data, min, max, seuil) {
    data.forEach(element => {
        // isoler le montant
        var montant = parseFloat(element["Montant octroyé"]);
        if (montant > seuil) {
            // ajouter les marqueurs
            var circleMarker = L.circleMarker([parseFloat(element["Latitude"]), parseFloat(element["Longitude"])], {
                fillColor: "#0000FF",
                color: "#0000FF",
                radius: 10,
                opacity: 1,
                fillOpacity: 0.4
            }).addTo(map);
            circleMarker.bindPopup(
                `<h3>${element["Nom du bénéficiaire de la subvention"]}</h3>
                <p><strong>Total :</strong> ${element["Montant octroyé"]}€</p>
                <p>${element["Rue"]} ${element["Numéro de maison"]}, ${element["Code postal"]} ${element["Commune"]}</p>
                <p onclick="getDetails()" data-q="${element["Le numéro de BCE du bénéficiaire de la subvention"]}">En savoir +</p>`
            );
        } else {
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
            circleMarker.bindPopup(
                `<h3>${element["Nom du bénéficiaire de la subvention"]}</h3>
                <p><strong>Total :</strong> ${element["Montant octroyé"]}€</p>
                <p>${element["Rue"]} ${element["Numéro de maison"]}, ${element["Code postal"]} ${element["Commune"]}</p>
                <p onclick="getDetails()" data-q="${element["Le numéro de BCE du bénéficiaire de la subvention"]}">En savoir +</p>`
            );
        }
        markers[element["Le numéro de BCE du bénéficiaire de la subvention"]] = circleMarker;
    });
}

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

// récupérer les données de géolocalisation
getCoordinates();

// fonction pour transformer les numéros de BCE
function transformerChaine(chaine) {
    var chaineTransformee = chaine.replace(/\./g, "");
    return chaineTransformee.replace(/^0+/, "");
}

// fonction pour appeler l'API de la Ville de Bruxelles (définie dans le contexte global !)
window.getDetails = function getDetails() {
    var dataQ = event.target.dataset.q;
    var q = transformerChaine(dataQ);
    console.log(q);
    fetch(`https://opendata.brussels.be/api/records/1.0/search/?dataset=subsides-subsidies-2022&q=${q}`)
        .then(response => response.json())
        .then(data => {
            var numSubsides = data.nhits;
            var nom = data.records[0].fields.nom_du_beneficiaire_de_la_subvention_naam_begunstigde_van_de_subsidie;
            var bce = data.records[0].fields.le_numero_de_bce_du_beneficiaire_de_la_subvention_kbo_nummer_van_de_begunstigde_van_de_subsidie;
            console.log("Nom : ", nom + "\n" + "Numéro BCE : ", bce + "\n" + "Nombre de subsides : ", numSubsides);
            data.records.forEach(record => {
                var objet = record.fields.l_objet_de_la_subvention_doel_van_de_subsidie;
                var montant = record.fields.montant_octroye_toegekend_bedrag;
                var startYear = record.fields.l_annee_de_debut_d_octroi_de_la_subvention_beginjaar_waarin_de_subsidie_wordt_toegekend;
                var endYear = record.fields.l_annee_de_fin_d_octroi_de_la_subvention_eindjaar_waarin_de_subsidie_wordt_toegekend;
                console.log("Objet : ", objet + "\n" + "Montant : ", montant + "\n" + "Année de début : ", startYear + "\n" + "Année de fin : ", endYear);
            });

        }).catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
    });
}

// capturer l'élément select
var beneficiairesSelect = document.querySelector("#beneficiaires-select");
// ajouter un écouteur d'événement
beneficiairesSelect.addEventListener("change", function() {
    var bce = beneficiairesSelect.value;
    var marker = markers[bce];
    if (marker) {
        map.setView(marker.getLatLng(), 19); // zoom to the marker
        marker.openPopup(); // open the popup
    }
});

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

getCoordinates();

// capturer l'élément select des quartiers
var quartiersSelect = document.querySelector("#quartiers-select");

// fonction pour ajouter les quartiers
function getQuartiers() {
    // récupérer les données
    fetch("http://localhost:3000/quartiers.json")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // ajouter les options au select
            data.forEach(quartier => {
                var option = document.createElement("option");
                option.value = quartier.nom;
                option.text = quartier.nom;
                quartiersSelect.appendChild(option);
            })
        }).catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
    });
}

// ajouter un écouteur d'événement
quartiersSelect.addEventListener("change", function() {
    var quartier = quartiersSelect.value;
    console.log(quartier);
    // fetch(`http://localhost:3000/quartiers/${quartier}.json`)
    fetch(`http://localhost:3000/quartiers.json`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // itérer avec for sur les données pour récupérer les coordonnées si quartier = data.nom
            for (var i = 0; i < data.length; i++) {
                if (quartier === data[i].nom) {
                    var lat = data[i].lat;
                    var lon = data[i].lon;
                    var zoom = data[i].zoom;
                    map.setView([lat, lon], zoom);
                    break;
                }
            }
        }).catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
    });
});

getQuartiers();