import { useState } from "react";
const colors = [
	"primary",
	"secondary",
	"accent",
	"danger",
	"warning",
	"success",
	"info",
	"link",
] as const;
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const prefixes = [
	{ value: "bg", label: "Background" },
	{ value: "text", label: "Text" },
	{ value: "border", label: "Border" },
	{ value: "ring", label: "Ring" },
	{ value: "fill", label: "Fill" },
	{ value: "stroke", label: "Stroke" },
] as const;

type Color = (typeof colors)[number];
type ColorShade = (typeof shades)[number];
type ColorPrefix = (typeof prefixes)[number]["value"];

const ColorCard = ({
	color,
	shade,
	prefix,
	className,
}: {
	color: Color;
	shade: ColorShade;
	prefix: ColorPrefix;
	className: string;
}) => {
	return (
		<div className='flex flex-col items-center'>
			<div className={`${className} h-16 w-full rounded-md border border-gray-200`}></div>
			<span className='text-xs mt-1'>{`${prefix}-${color}-${shade}`}</span>
		</div>
	);
};

const ColorPaletteExplorer = () => {
	const [selectedColor, setSelectedColor] = useState<Color>("primary");
	const [selectedPrefix, setSelectedPrefix] = useState<ColorPrefix>("bg");

	// Generate the appropriate class based on prefix, color and shade
	const generateClass = (prefix: ColorPrefix, color: Color, shade: ColorShade) => {
		return `${prefix}-${color}-${shade}`;
	};

	return (
		<div className='p-4 rounded-lg shadow-sm'>
			<h2 className='text-xl font-bold mb-6'>Interactive Color Palette Explorer</h2>

			<div className='space-y-6'>
				{/* Controls section */}
				<div className='flex flex-wrap gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Color
						</label>
						<div className='flex flex-wrap gap-2'>
							{colors.map((color) => (
								<button
									key={color}
									onClick={() => setSelectedColor(color)}
									className={`px-3 py-1 text-sm rounded-md border ${
										selectedColor === color
											? `bg-${color}-200 border-${color}-400`
											: "bg-white border-gray-300"
									}`}
								>
									{color}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>
							Prefix
						</label>
						<div className='flex flex-wrap gap-2'>
							{prefixes.map((prefix) => (
								<button
									key={prefix.value}
									onClick={() => setSelectedPrefix(prefix.value)}
									className={`px-3 py-1 text-sm rounded-md border ${
										selectedPrefix === prefix.value
											? "bg-gray-200 border-gray-400"
											: "bg-white border-gray-300"
									}`}
								>
									{prefix.label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Color shades grid */}
				<div>
					<h3 className='text-lg font-semibold mb-3'>
						{selectedPrefix}-{selectedColor} Shades
					</h3>
					<div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-4'>
						{shades.map((shade) => (
							<ColorCard
								key={shade}
								color={selectedColor}
								shade={shade}
								prefix={selectedPrefix}
								className={generateClass(selectedPrefix, selectedColor, shade)}
							/>
						))}
					</div>
				</div>

				{/* Example usage */}
				<div>
					<h3 className='text-lg font-semibold mb-3'>Example Usage</h3>
					<div className='bg-white p-4 rounded-md border'>
						{selectedPrefix === "bg" && (
							<div
								className={`h-24 w-full rounded-md ${generateClass(
									"bg",
									selectedColor,
									500
								)}`}
							></div>
						)}

						{selectedPrefix === "text" && (
							<div>
								<p
									className={`text-2xl font-bold ${generateClass(
										"text",
										selectedColor,
										500
									)}`}
								>
									Heading Text
								</p>
								<p className={`${generateClass("text", selectedColor, 500)}`}>
									This is an example of normal paragraph text using the selected
									color.
								</p>
							</div>
						)}

						{selectedPrefix === "border" && (
							<div
								className={`h-24 w-full rounded-md border-4 ${generateClass(
									"border",
									selectedColor,
									500
								)}`}
							></div>
						)}

						{selectedPrefix === "ring" && (
							<div
								className={`h-24 w-full rounded-md ring-4 ${generateClass(
									"ring",
									selectedColor,
									500
								)}`}
							></div>
						)}

						{selectedPrefix === "fill" && (
							<svg
								className={`h-24 w-full ${generateClass(
									"fill",
									selectedColor,
									500
								)}`}
								viewBox='0 0 100 100'
							>
								<circle cx='50' cy='50' r='40' />
								<rect x='10' y='10' width='20' height='20' />
								<polygon points='50,0 100,50 50,100 0,50' />
							</svg>
						)}

						{selectedPrefix === "stroke" && (
							<svg
								className={`h-24 w-full ${generateClass(
									"stroke",
									selectedColor,
									500
								)} stroke-2 fill-none`}
								viewBox='0 0 100 100'
							>
								<circle cx='50' cy='50' r='40' />
								<rect x='10' y='10' width='20' height='20' />
								<polygon points='50,0 100,50 50,100 0,50' />
							</svg>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ColorPaletteExplorer;
