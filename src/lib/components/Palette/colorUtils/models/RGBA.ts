// --- RGBA Color Model ---

import { assertRange } from "../common";
import { FLOAT_COMPARISON_THRESHOLD } from "../constants";
import { IRGBAColor } from "../types";

class RGBAColor implements IRGBAColor {
	red: number;
	green: number;
	blue: number;
	alpha: number;
	/**
	 * Represents an RGBA color.
	 * @param red Red component (0-1).
	 * @param green Green component (0-1).
	 * @param blue Blue component (0-1).
	 * @param [alpha=1] Alpha component (0-1).
	 * @constructor
	 */
	constructor(red: number, green: number, blue: number, alpha = 1) {
		this.red = red;
		this.green = green;
		this.blue = blue;
		this.alpha = alpha;
		assertRange(red, 1, "red");
		assertRange(green, 1, "green");
		assertRange(blue, 1, "blue");
		assertRange(alpha, 1, "alpha");
	}
}

function rgbaToString(color: RGBAColor) {
	return (
		"rgba(" +
		100 * color.red +
		"%, " +
		100 * color.green +
		"%, " +
		(100 * color.blue + "%, " + color.alpha + ")")
	);
}

function decimalToHexComponent(decimal: number) {
	var hex = decimal.toString(16);
	return 2 <= hex.length ? hex : "0" + hex;
}

function rgbaToHex(color: RGBAColor) {
	var alphaHex = 1 > color.alpha ? decimalToHexComponent(Math.round(255 * color.alpha)) : "";
	return (
		decimalToHexComponent(Math.round(255 * color.red)) +
		decimalToHexComponent(Math.round(255 * color.green)) +
		decimalToHexComponent(Math.round(255 * color.blue)) +
		alphaHex
	);
}

function areColorsEqual(colorA: RGBAColor, colorB: RGBAColor) {
	return (
		Math.abs(colorA.red - colorB.red) < FLOAT_COMPARISON_THRESHOLD &&
		Math.abs(colorA.green - colorB.green) < FLOAT_COMPARISON_THRESHOLD &&
		Math.abs(colorA.blue - colorB.blue) < FLOAT_COMPARISON_THRESHOLD &&
		Math.abs(colorA.alpha - colorB.alpha) < FLOAT_COMPARISON_THRESHOLD
	);
}

// Returns a new RGB color without alpha.
function stripAlpha(color: RGBAColor) {
	return 1 - color.alpha < FLOAT_COMPARISON_THRESHOLD
		? color
		: new RGBAColor(color.red, color.green, color.blue);
}
export default RGBAColor;
export { rgbaToHex, areColorsEqual, stripAlpha, rgbaToString, decimalToHexComponent };
