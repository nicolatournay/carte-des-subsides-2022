// importation de l'objet Color depuis le CDN de colorjs.io
import Color from "https://colorjs.io/dist/color.js";

export { redgreen };

// déterminer un espace de couleur entre vert et rouge
let color = new Color("p3", [0, 1, 0]);
let redgreen = color.range("red", {
	space: "lch", // interpolation space
	outputSpace: "srgb"
});