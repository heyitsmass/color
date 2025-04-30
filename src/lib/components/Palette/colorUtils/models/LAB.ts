// --- LAB Color Model ---
import { assertRange } from "../common";
import { ILABColor, IRGBAColor } from "../types";

class LABColor implements ILABColor {
	lightness: number;
	a: number;
	b: number;
	alpha: number;
	/**
	 * Represents a CIE LAB color.
	 * @param lightness  Lightness component (0+).
	 * @param a  A component.
	 * @param b  B component.
	 * @param alpha Alpha component (0-1).
	 */
	constructor(lightness: number, a: number, b: number, alpha: number = 1) {
		this.lightness = lightness;
		this.a = a;
		this.b = b;
		this.alpha = alpha;
		assertRange(lightness, Number.MAX_VALUE, "lightness");
		assertRange(alpha, 1, "alpha");
	}
}
// sRGB component to linear RGB
function srgbToLinear(component: number) {
	return 0.04045 >= component ? component / 12.92 : Math.pow((component + 0.055) / 1.055, 2.4);
}

// Linear RGB component to sRGB
function linearToSrgb(component: number) {
	return 0.0031308 >= component
		? 12.92 * component
		: 1.055 * Math.pow(component, 1 / 2.4) - 0.055;
}

// LAB color space transformation function (f(t))
function labForwardTransform(t: number) {
	var delta = 6 / 29;
	var factor = 1 / (3 * Math.pow(delta, 2));
	return t > Math.pow(delta, 3) ? Math.pow(t, 1 / 3) : factor * t + 4 / 29;
}

// Inverse LAB color space transformation function (f^-1(t))
function labReverseTransform(t: number) {
	var delta = 6 / 29;
	var factor = 3 * Math.pow(delta, 2);
	return t > delta ? Math.pow(t, 3) : factor * (t - 4 / 29);
}

function rgbToLab(rgbColor: IRGBAColor) {
	var rLinear = srgbToLinear(rgbColor.red),
		gLinear = srgbToLinear(rgbColor.green),
		bLinear = srgbToLinear(rgbColor.blue);

	//D65 illuminant
	var x = (0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear) / 0.95047;
	var y = 0.2126729 * rLinear + 0.7151522 * gLinear + 0.072175 * bLinear; // = 1.0
	var z = (0.0193339 * rLinear + 0.119192 * gLinear + 0.9503041 * bLinear) / 1.08883;

	var fx = labForwardTransform(x);
	var fy = labForwardTransform(y);
	var fz = labForwardTransform(z);

	var l = 116 * fy - 16;
	var a = 500 * (fx - fy);
	var b = 200 * (fy - fz);

	return new LABColor(l, a, b, rgbColor.alpha);
}
export default LABColor;
export { rgbToLab, labReverseTransform, labForwardTransform, linearToSrgb, srgbToLinear };
