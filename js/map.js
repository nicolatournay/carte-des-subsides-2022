export { map };

// initialiser la carte
var map = L.map('map').setView([50.8465573, 4.351697], 12);

// charger la couche tuiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);