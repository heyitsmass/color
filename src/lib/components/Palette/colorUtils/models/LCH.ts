// --- LCH Color Model ---
import { assertRange } from "../common";
import { ILABColor, ILCHColor } from "../types";

class LCHColor implements ILCHColor {
	lightness: number;
	chroma: number;
	hue: number;
	alpha: number;
	/**
	 * Represents a CIE LCH(ab) color.
	 * @param lightness Lightness component (0+).
	 * @param chroma Chroma component (0+).
	 * @param hue Hue component (0-360).
	 * @param alpha Alpha component (0-1).
	 * @constructor
	 */
	constructor(lightness: number, chroma: number, hue: number, alpha: number = 1) {
		this.lightness = lightness;
		this.chroma = chroma;
		this.hue = hue;
		this.alpha = alpha;
		assertRange(lightness, Number.MAX_VALUE, "lightness");
		assertRange(chroma, Number.MAX_VALUE, "chroma");
		assertRange(hue, 360, "hue");
		assertRange(alpha, 1, "alpha");
	}
}

function calculateHueAngle(b: number, a: number) {
	if (1e-4 > Math.abs(a) && 1e-4 > Math.abs(b)) return 0;
	var angle = (180 * Math.atan2(b, a)) / Math.PI;
	return 0 <= angle ? angle : angle + 360;
}

function labToLch(labColor: ILABColor) {
	var chroma = Math.sqrt(Math.pow(labColor.a, 2) + Math.pow(labColor.b, 2));
	var hue = calculateHueAngle(labColor.b, labColor.a);
	return new LCHColor(labColor.lightness, chroma, hue, labColor.alpha);
}

export default LCHColor;
export { calculateHueAngle, labToLch };
