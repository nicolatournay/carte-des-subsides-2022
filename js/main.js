// importer la carte
import { map } from './map.js';

// importer les fonctions pour les coordonnées
import { getCoordinates } from './coordinates.js';

// importer les fonctions pour les marqueurs
import { markers } from './markers.js';

// importer les fonctions pour les détails
import { getDetails } from './details.js';

// importer les fonctions pour les bénéficiaires
import { beneficiairesSelect, initBeneficiairesSelect } from './beneficiaires.js';

// importer les fonctions pour les quartiers
import { getQuartiers, quartiersSelect, initQuartiersSelect } from './quartiers.js';

// importer la fonction de contenu
import { getContent } from './content.js';

/*
============================
✨ LA MAGIE COMMENCE ICI ✨
============================
*/

// 1) MAP 🗺

// récupérer les données de géolocalisation
getCoordinates();

// 2) BENEFICIAIRES €

// Appel de la fonction pour initialiser l'écouteur d'événement
initBeneficiairesSelect(beneficiairesSelect, markers, map);

// 3) QUARTIERS 🏘

// Appel de la fonction pour ajouter les quartiers
getQuartiers();

// Appel de la fonction pour initialiser l'écouteur d'événement
initQuartiersSelect(quartiersSelect, map);

// 4) CONTENU 📝

// Appel de la fonction pour ajouter le contenu
getContent();