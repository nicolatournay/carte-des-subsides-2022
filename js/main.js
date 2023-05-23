// initialiser la carte
var map = L.map('map').setView([50.8465573, 4.351697], 12);

// charger la couche tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// fonction pour ajouter les marqueurs
function getMarkers(data) {
    data.forEach(element => {
        var circleMarker = L.circleMarker([parseFloat(element["Latitude"]), parseFloat(element["Longitude"])], {
            fillColor: '#fe0100',
            radius: 10,
            opacity: 0,
            fillOpacity: 0.4
        }).addTo(map);
        circleMarker.bindPopup(
            `<h3>${element["Nom du bénéficiaire de la subvention"]}</h3>
            <p><strong>Total :</strong> ${element["Montant octroyé"]}€</p>
            <p>${element["Rue"]} ${element["Numéro de maison"]}, ${element["Code postal"]} ${element["Commune"]}</p>
            <p onclick="getDetails()" data-q="${element["Le numéro de BCE du bénéficiaire de la subvention"]}">En savoir +</p>`
        );
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
            // ajouter les marqueurs
            getMarkers(data);
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

// fonction pour appeler l'API de la Ville de Bruxelles
function getDetails() {
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

