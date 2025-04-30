// --- HSV(A) Color Model ---
import { clamp } from "framer-motion";
import { assertRange } from "../common";
import { FLOAT_COMPARISON_THRESHOLD } from "../constants";
import { IHSVAColor, IRGBAColor } from "../types";
import HSLAColor, { hueToRgbInternal } from "./HSLA";

class HSVAColor implements IHSVAColor {
	hue: number;
	saturation: number;
	value: number;
	alpha: number;
	/**
	 * Represents an HSV(A) color.
	 * @param hue Hue component (0-360).
	 * @param saturation Saturation component (0-1).
	 * @param value Value component (0-1).
	 * @param alpha Alpha component (0-1).
	 * @constructor
	 */
	constructor(hue: number, saturation: number, value: number, alpha = 1) {
		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
		this.alpha = alpha;
		assertRange(hue, 360, "hue");
		assertRange(saturation, 1, "saturation");
		assertRange(value, 1, "value");
		assertRange(alpha, 1, "alpha");
	}
}

function hsvToRgb(hsvColor: HSVAColor) {
	var chroma = hsvColor.value * hsvColor.saturation;
	var minComponent = Math.max(0, hsvColor.value - chroma);
	return hueToRgbInternal(hsvColor.hue, hsvColor.alpha, chroma, minComponent);
}

function rgbToHsv(rgbColor: IRGBAColor) {
	var r = rgbColor.red,
		g = rgbColor.green,
		b = rgbColor.blue;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var hue = 0,
		saturation = 0;

	if (max - min > FLOAT_COMPARISON_THRESHOLD) {
		saturation = (max - min) / max;
		if (max === r) hue = (60 * (g - b)) / (max - min);
		else if (max === g) hue = (60 * (b - r)) / (max - min) + 120;
		else if (max === b) hue = (60 * (r - g)) / (max - min) + 240;
	}
	hue = Math.round(hue + 360) % 360;
	return new HSVAColor(hue, saturation, max, rgbColor.alpha);
}

// Seems to convert HSV to HSL
function hsvToHsl(hsvColor: HSVAColor) {
	var lightness = clamp(((2 - hsvColor.saturation) * hsvColor.value) / 2, 0, 1);
	var saturation = 0;
	if (0 < lightness && 1 > lightness) {
		saturation =
			(hsvColor.saturation * hsvColor.value) /
			(0.5 > lightness ? 2 * lightness : 2 - 2 * lightness);
	}
	saturation = clamp(saturation, 0, 1);
	return new HSLAColor(hsvColor.hue, saturation, lightness, hsvColor.alpha);
}

export default HSVAColor;
export { hsvToHsl, hsvToRgb, rgbToHsv };
