import { clamp } from "./common";
import {
	ACCESSIBILITY,
	Colors,
	ContrastColorPalette,
	GOLDEN_PALETTES,
	GOLDEN_PALETTES_C_DIFF_FACTORS,
	GOLDEN_PALETTES_L_DIFF_FACTORS,
} from "./constants";
import { findClosestPalette, getTextColorChoice } from "./contrast";
import { LABColor, LCHColor, RGBAColor, utils } from "./models";
import { COLOR } from "./shared";

// Generates a 10-shade palette based on a target color and the golden palettes
function generatePaletteFromColor(targetRgbColor: RGBAColor, palettes = GOLDEN_PALETTES) {
	var targetLabColor = utils.rgbToLab(targetRgbColor);
	var closest = findClosestPalette(targetLabColor, palettes);
	var sourcePalette = closest.palette;
	var sourceIndex = closest.index;

	var sourceLabColor = sourcePalette[sourceIndex];
	var sourceLchColor = utils.labToLch(sourceLabColor);
	var targetLchColor = utils.labToLch(targetLabColor);

	var isLowChroma = utils.labToLch(sourcePalette[5]).chroma < 30; // Check chroma of the 500 shade

	var deltaL = sourceLchColor.lightness - targetLchColor.lightness;
	var deltaC = sourceLchColor.chroma - targetLchColor.chroma;
	var deltaH = sourceLchColor.hue - targetLchColor.hue;

	var sourceLFactor = GOLDEN_PALETTES_L_DIFF_FACTORS[sourceIndex];
	var sourceCFactor = GOLDEN_PALETTES_C_DIFF_FACTORS[sourceIndex];

	var maxL = 100; // Track max lightness to avoid inversions

	return sourcePalette.map(function (baseLabColor, shadeIndex) {
		if (baseLabColor === sourceLabColor) {
			maxL = Math.max(targetLchColor.lightness - 1.7, 0); // Update maxL based on target
			return targetRgbColor; // Return the original target color for its matched shade
		}

		var baseLchColor = utils.labToLch(baseLabColor);

		// Adjust Lightness
		var lFactor = GOLDEN_PALETTES_L_DIFF_FACTORS[shadeIndex] / sourceLFactor;
		var newL = baseLchColor.lightness - lFactor * deltaL;
		newL = Math.min(newL, maxL); // Ensure lightness doesn't increase going darker
		newL = clamp(newL, 0, 100);

		// Adjust Chroma
		var cFactor = Math.min(GOLDEN_PALETTES_C_DIFF_FACTORS[shadeIndex] / sourceCFactor, 1.25);
		var newC = Math.max(
			0,
			isLowChroma ? baseLchColor.chroma - deltaC : baseLchColor.chroma - deltaC * cFactor
		);

		// Adjust Hue
		var newH = (baseLchColor.hue - deltaH + 360) % 360;

		// Update maxL for next iteration
		maxL = Math.max(newL - 1.7, 0);

		// Convert adjusted LCH back to LAB
		var newLchColor = new LCHColor(newL, newC, newH, baseLchColor.alpha); // Reuse alpha
		var hueRadians = (newLchColor.hue * Math.PI) / 180;
		var newLabColor = new LABColor(
			newLchColor.lightness,
			newLchColor.chroma * Math.cos(hueRadians),
			newLchColor.chroma * Math.sin(hueRadians),
			newLchColor.alpha
		);

		// Convert LAB back to XYZ
		const fy = (newLabColor.lightness + 16) / 116;
		const fx = newLabColor.a / 500 + fy;
		const fz = fy - newLabColor.b / 200;

		const x = 0.95047 * utils.labReverseTransform(fx); // Xn
		const y = utils.labReverseTransform(fy); // Yn = 1.0
		const z = 1.08883 * utils.labReverseTransform(fz); // Zn

		// Convert XYZ to Linear RGB
		const rLinear = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
		const gLinear = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
		const bLinear = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

		// Convert Linear RGB to sRGB

		var r = clamp(utils.linearToSrgb(rLinear), 0, 1);
		var g = clamp(utils.linearToSrgb(gLinear), 0, 1);
		var b = clamp(utils.linearToSrgb(bLinear), 0, 1);

		return new RGBAColor(r, g, b, newLabColor.alpha);
	});
}

const checkWCAGAccessibility = (
	ratio: number,
	ignore: boolean = false
): keyof typeof ACCESSIBILITY => {
	return ignore ? 0 : ratio >= 7 ? 4 : ratio >= 4.5 ? 3 : ratio >= 3 ? 2 : 1;
};

const getElementRGBAValue = (elementRef: Element, colorName: Colors) => {
	const [red, green, blue, alpha] = getComputedStyle(elementRef)
		.getPropertyValue(`--color-${colorName}`)
		?.replace(/rgba?\(|\)|\,/g, "")
		.split(" ")
		.slice(0, 3)
		.map(Number)
		.map((v) => v / 255);
	if ([red, green, blue].some((v) => !v && v !== 0)) return null;

	return new COLOR.RGBAColor(red, green, blue, alpha);
};

function getContrastPalettes(element: HTMLElement, colors: Colors[]) {
	const seen = {} as {
		[x: string]: RGBAColor;
	};
	const palettes = {} as ContrastColorPalette;
	for (const i of colors) {
		if (!seen[i]) {
			const color = getElementRGBAValue(element, i);
			if (!color) continue;
			seen[i] = color;
		}
		const foreground = seen[i];

		for (const j of colors) {
			if (!seen[j]) {
				const color = getElementRGBAValue(element, j);
				if (!color) continue;
				seen[j] = color;
			}

			if (i == j) continue;
			else if (`${j}-${i}` in palettes) continue;

			const background = seen[j];
			const palette = {
				foreground,
				background,
				textChoice: getTextColorChoice(background) * 255,
			};

			palettes[`${i}-${j}`] = palette;
		}
	}

	return palettes;
}

export {
	checkWCAGAccessibility,
	COLOR as color,
	generatePaletteFromColor,
	getContrastPalettes,
	getElementRGBAValue,
	utils,
};
