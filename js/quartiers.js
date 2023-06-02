export { getQuartiers, quartiersSelect, initQuartiersSelect };

import { resetMap } from "./map.js";

var quartiersSelect = document.querySelector("#quartiers-select");

function initQuartiersSelect(quartiersSelect, map) {
  quartiersSelect.addEventListener("change", function() {
    if (quartiersSelect.value == "0") {
      resetMap();
    } else {
      var quartier = quartiersSelect.value;
      console.log(quartier);
      fetch(`http://localhost:3000/quartiers.json`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
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
    }
  });
}

function getQuartiers() {
  fetch("http://localhost:3000/quartiers.json")
    .then(response => response.json())
    .then(data => {
      console.log(data);
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
