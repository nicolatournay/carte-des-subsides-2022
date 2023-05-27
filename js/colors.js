export { getColor };

// importation de l'objet Color depuis le CDN de colorjs.io
import Color from "https://colorjs.io/dist/color.js";

// déterminer un espace de couleur entre vert et rouge
let color = new Color("p3", [0, 1, 0]);
let redgreen = color.range("red", {
	space: "hwb", // interpolation space
	outputSpace: "srgb"
});

function getColor(montant) {
	if (montant < 1500) {
		return redgreen(0);
	} else if (montant >= 1500 && montant < 3000) {
		return redgreen(0.1);
	} else if (montant >= 3000 && montant < 6000) {
		return redgreen(0.2);
	} else if (montant >= 6000 && montant < 12500) {
		return redgreen(0.3);
	} else if (montant >= 12500 && montant < 25000) {
		return redgreen(0.4);
	} else if (montant >= 25000 && montant < 50000) {
		return redgreen(0.5);
	} else if (montant >= 50000 && montant < 100000) {
		return redgreen(0.6);
	} else if (montant >= 100000 && montant < 250000) {
		return redgreen(0.7);
	} else if (montant >= 250000 && montant < 500000) {
		return redgreen(0.8);
	} else if (montant >= 500000 && montant < 1000000) {
		return redgreen(0.9);
	} else {
		return redgreen(1);
	}
}