interface ILABColor {
	lightness: number;
	a: number;
	b: number;
	alpha: number;
}

interface IRGBAColor {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}

type Hex = `#${string}` | string;

interface IHSLAColor {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
}

interface IHSVAColor {
	hue: number;
	saturation: number;
	value: number;
	alpha: number;
}

interface ILCHColor {
	lightness: number;
	chroma: number;
	hue: number;
}

export type { ILABColor, ILCHColor, IRGBAColor, IHSLAColor, IHSVAColor, Hex };
