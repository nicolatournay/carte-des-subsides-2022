export {getDetails};

// fonction pour transformer les numéros de BCE
function transformerChaine(chaine) {
    var chaineTransformee = chaine.replace(/\./g, "");
    return chaineTransformee.replace(/^0+/, "");
}

// fonction pour appeler l'API de la Ville de Bruxelles (définie dans le contexte global !)
function getDetails(dataQ) {
    // var dataQ = e.target.dataset.q;
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