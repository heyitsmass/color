// --- Hex Color Handling ---
import RGBAColor from "./RGBA";

function hexComponentToDecimal(hex: string) {
	if (!/^[a-fA-F0-9]+$/.test(hex))
		throw Error("Invalid hex string: " + hex);
	return parseInt(hex, 16);
}

function hexToRgba(hexString: string) {
	if (!/^[a-fA-F0-9]{3,8}$/.test(hexString))
		throw Error("Invalid hex color string: " + hexString);

	var components = [];
	if (3 === hexString.length || 4 === hexString.length) {
		components =
			/^(.)(.)(.)(.)?$/
				.exec(hexString)
				?.slice(1, 5)
				.map(function (c) {
					return c ? c + c : "ff";
				}) || [];
	} else if (6 === hexString.length || 8 === hexString.length) {
		components =
			/^(..)(..)(..)(..)?$/.exec(hexString)?.slice(1, 5) || [];
		if (components && !components[3]) components[3] = "ff";
	} else {
		throw Error("Invalid hex color string: " + hexString);
	}

	const r = hexComponentToDecimal(components[0]) / 255;
	const g = hexComponentToDecimal(components[1]) / 255;
	const b = hexComponentToDecimal(components[2]) / 255;
	const a = hexComponentToDecimal(components[3]) / 255;
	return new RGBAColor(r, g, b, a);
}

export { hexComponentToDecimal, hexToRgba };
