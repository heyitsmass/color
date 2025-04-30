// --- Color Contrast & Calculations ---

import {
	BLACK,
	FLOAT_COMPARISON_THRESHOLD,
	GOLDEN_PALETTES,
	LUMINANCE_FACTORS as LUM,
	WHITE,
} from "./constants";
import { RGBAColor } from "./models";
import { calculateHueAngle, srgbToLinear, stripAlpha } from "./models/utils";
import { ILABColor, IRGBAColor } from "./types";

function calculateLuminance(color: IRGBAColor) {
	return (
		LUM.RED * srgbToLinear(color.red) +
		LUM.GREEN * srgbToLinear(color.green) +
		LUM.BLUE * srgbToLinear(color.blue)
	);
}

function calculateBlendedContrast(
	foreground: IRGBAColor,
	background: IRGBAColor,
	blendedAlpha: number
) {
	return new RGBAColor(
		foreground.red * foreground.alpha + background.red * blendedAlpha,
		foreground.green * foreground.alpha + background.green * blendedAlpha,
		foreground.blue * foreground.alpha + background.blue * blendedAlpha,
		foreground.alpha + blendedAlpha
	);
}
// Calculates WCAG contrast ratio
function calculateContrastRatio(foreground: IRGBAColor, background: IRGBAColor) {
	const backgroundRGB = stripAlpha(background); // Ensure background is opaque
	let foregroundRGB = foreground;

	// Blend foreground with background if foreground has alpha
	if (!(1 - foreground.alpha < FLOAT_COMPARISON_THRESHOLD)) {
		const blendedAlpha = backgroundRGB.alpha * (1 - foreground.alpha); // Should be 1 * (1 - fg.alpha)
		foregroundRGB = calculateBlendedContrast(foreground, backgroundRGB, blendedAlpha);
	}

	// Calculate relative luminance
	const lum1 = calculateLuminance(foreground);
	const lum2 = calculateLuminance(background);

	// Calculate contrast ratio
	return lum1 >= lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
}

// Determines if black (1) or white (0) text is better contrast
function getTextColorChoice(backgroundColor: IRGBAColor, minContrastRatio = 4.5) {
	const contrastWhite = calculateContrastRatio(WHITE, backgroundColor);
	if (contrastWhite >= minContrastRatio) return 0; // White

	const contrastBlack = calculateContrastRatio(BLACK, backgroundColor);
	return contrastBlack >= minContrastRatio ? 1 : contrastWhite > contrastBlack ? 0 : 1; // Black or best available
}

// Finds the closest palette and shade in the golden palettes using CIEDE2000 (approximated)
function findClosestPalette(targetLabColor: ILABColor, palettes = GOLDEN_PALETTES) {
	if (!palettes.length || !palettes[0].length) throw Error("Invalid golden palettes");

	var minDeltaE = Infinity;
	var bestPalette = palettes[0];
	var bestIndex = -1;

	for (var h = 0; h < palettes.length; h++) {
		for (var f = 0; f < palettes[h].length && 0 < minDeltaE; f++) {
			const paletteLabColor = palettes[h][f];

			// Approximate CIEDE2000 calculation START
			const L_bar_prime = (paletteLabColor.lightness + targetLabColor.lightness) / 2;
			const C1 = Math.sqrt(Math.pow(paletteLabColor.a, 2) + Math.pow(paletteLabColor.b, 2));
			var C2 = Math.sqrt(Math.pow(targetLabColor.a, 2) + Math.pow(targetLabColor.b, 2));
			var C_bar = (C1 + C2) / 2;
			var G =
				0.5 * (1 - Math.sqrt(Math.pow(C_bar, 7) / (Math.pow(C_bar, 7) + Math.pow(25, 7))));
			var a1_prime = paletteLabColor.a * (1 + G);
			var a2_prime = targetLabColor.a * (1 + G);
			var C1_prime = Math.sqrt(Math.pow(a1_prime, 2) + Math.pow(paletteLabColor.b, 2));
			var C2_prime = Math.sqrt(Math.pow(a2_prime, 2) + Math.pow(targetLabColor.b, 2));
			var delta_C_prime = C2_prime - C1_prime;
			var C_bar_prime = (C1_prime + C2_prime) / 2;
			var h1_prime = calculateHueAngle(paletteLabColor.b, a1_prime);
			var h2_prime = calculateHueAngle(targetLabColor.b, a2_prime);

			var delta_h_prime = 0;
			if (!(1e-4 > Math.abs(C1) || 1e-4 > Math.abs(C2))) {
				var angleDiff = h2_prime - h1_prime;
				if (Math.abs(angleDiff) <= 180) delta_h_prime = angleDiff;
				else if (angleDiff > 180) delta_h_prime = angleDiff - 360;
				else delta_h_prime = angleDiff + 360;
			}

			var delta_H_prime =
				2 *
				Math.sqrt(C1_prime * C2_prime) *
				Math.sin(((delta_h_prime / 2) * Math.PI) / 180);

			var H_bar_prime = 0;
			if (!(1e-4 > Math.abs(C1) || 1e-4 > Math.abs(C2))) {
				var angleSum = h1_prime + h2_prime;
				if (Math.abs(h1_prime - h2_prime) <= 180) H_bar_prime = angleSum / 2;
				else H_bar_prime = (angleSum < 360 ? angleSum + 360 : angleSum - 360) / 2;
			}

			var T =
				1 -
				0.17 * Math.cos(((H_bar_prime - 30) * Math.PI) / 180) +
				0.24 * Math.cos((2 * H_bar_prime * Math.PI) / 180) +
				0.32 * Math.cos(((3 * H_bar_prime + 6) * Math.PI) / 180) -
				0.2 * Math.cos(((4 * H_bar_prime - 63) * Math.PI) / 180);

			var delta_L_prime = targetLabColor.lightness - paletteLabColor.lightness;
			var SL =
				1 +
				(0.015 * Math.pow(L_bar_prime - 50, 2)) /
					Math.sqrt(20 + Math.pow(L_bar_prime - 50, 2));
			var SC = 1 + 0.045 * C_bar_prime;
			var SH = 1 + 0.015 * C_bar_prime * T;
			var RT =
				-2 *
				Math.sqrt(Math.pow(C_bar_prime, 7) / (Math.pow(C_bar_prime, 7) + Math.pow(25, 7))) *
				Math.sin((60 * Math.exp(-Math.pow((H_bar_prime - 275) / 25, 2)) * Math.PI) / 180);

			// CIEDE2000 Formula (kL=kC=kH=1)
			var deltaE = Math.sqrt(
				Math.pow(delta_L_prime / SL, 2) +
					Math.pow(delta_C_prime / SC, 2) +
					Math.pow(delta_H_prime / SH, 2) +
					RT * (delta_C_prime / SC) * (delta_H_prime / SH)
			);
			// Approximate CIEDE2000 calculation END

			if (deltaE < minDeltaE) {
				minDeltaE = deltaE;
				bestPalette = palettes[h];
				bestIndex = f;
			}
		}
	}
	return { palette: bestPalette, index: bestIndex };
}

export { calculateContrastRatio, findClosestPalette, getTextColorChoice };
