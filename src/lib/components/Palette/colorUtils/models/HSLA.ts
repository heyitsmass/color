// --- HSL(A) Color Model ---

import { assertRange, clamp } from "../common";
import { FLOAT_COMPARISON_THRESHOLD } from "../constants";
import { IHSLAColor, IRGBAColor } from "../types";
import RGBAColor from "./RGBA";

class HSLAColor implements IHSLAColor {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
	/**
	 * Represents an HSL(A) color.
	 * @param hue Hue component (0-360).
	 * @param saturation Saturation component (0-1).
	 * @param lightness Lightness component (0-1).
	 * @param alpha Alpha component (0-1).
	 * @constructor
	 */
	constructor(hue: number, saturation: number, lightness: number, alpha: number = 1) {
		this.hue = hue;
		this.saturation = saturation;
		this.lightness = lightness; // 'g' was lightness
		this.alpha = alpha;
		assertRange(hue, 360, "hue");
		assertRange(saturation, 1, "saturation");
		assertRange(lightness, 1, "lightness");
		assertRange(alpha, 1, "alpha");
	}
}

function rotateHue(hslColor: HSLAColor, degrees: number) {
	return new HSLAColor(
		(hslColor.hue + degrees + 360) % 360,
		hslColor.saturation,
		hslColor.lightness,
		hslColor.alpha
	);
}

// Internal helper for HSL/HSV to RGB
function hueToRgbInternal(hue: number, alpha: number, chroma: number, minComponent: number) {
	var r = minComponent,
		g = minComponent,
		b = minComponent;
	hue = (hue % 360) / 60;
	const intermediate = chroma * (1 - Math.abs((hue % 2) - 1));
	switch (Math.floor(hue)) {
		case 0:
			r += chroma;
			g += intermediate;
			break;
		case 1:
			r += intermediate;
			g += chroma;
			break;
		case 2:
			g += chroma;
			b += intermediate;
			break;
		case 3:
			g += intermediate;
			b += chroma;
			break;
		case 4:
			r += intermediate;
			b += chroma;
			break;
		case 5:
			r += chroma;
			b += intermediate;
			break;
	}
	return new RGBAColor(r, g, b, alpha);
}

function hslToRgb(hslColor: HSLAColor) {
	var chroma = (1 - Math.abs(2 * hslColor.lightness - 1)) * hslColor.saturation;
	var minComponent = Math.max(0, hslColor.lightness - chroma / 2);
	return hueToRgbInternal(hslColor.hue, hslColor.alpha, chroma, minComponent);
}

function rgbToHsl(rgbColor: IRGBAColor) {
	var r = rgbColor.red,
		g = rgbColor.green,
		b = rgbColor.blue;
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var hue = 0,
		saturation = 0,
		lightness = clamp(0.5 * (max + min), 0, 1);

	if (max - min > FLOAT_COMPARISON_THRESHOLD) {
		if (max === r) hue = (60 * (g - b)) / (max - min);
		else if (max === g) hue = (60 * (b - r)) / (max - min) + 120;
		else if (max === b) hue = (60 * (r - g)) / (max - min) + 240;

		saturation =
			0 < lightness && 0.5 >= lightness
				? clamp((max - min) / (2 * lightness), 0, 1)
				: clamp((max - min) / (2 - 2 * lightness), 0, 1);
	}
	hue = Math.round(hue + 360) % 360;
	return new HSLAColor(hue, saturation, lightness, rgbColor.alpha);
}

export default HSLAColor;

export { hslToRgb, rgbToHsl, hueToRgbInternal, rotateHue };
