// Component to display a color with all its gradient values

import { type Colors, type GradientPalette } from "@colorUtils/constants";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { generatePaletteFromColor, getElementRGBAValue, utils } from "../../colorUtils";
import Card from "../Card";
import ColorSwatch from "./Swatch";

type ColorGradientProps = { colorName: Colors };
const gradients = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
export default function ColorGradient({ colorName }: ColorGradientProps) {
	const ref = useRef(null);

	const [palette, setPalette] = useState<{ [x: string]: GradientPalette }>();

	useEffect(() => {
		if (ref.current) {
			const basePalette = getElementRGBAValue(ref.current, colorName);
			console.debug(basePalette);
			if (basePalette) {
				setPalette(
					generatePaletteFromColor(basePalette)
						.slice(0, gradients.length)
						.reduce((acc, curr, i) => {
							console.debug(curr);
							return {
								...acc,
								[gradients[i]]: {
									...curr,
									is_primary: utils.areColorsEqual(basePalette, curr),
									className: utils.rgbaToString(curr),
								},
							};
						}, {})
				);
			}
		}
	}, []);

	return (
		<Card className='p-4 w-full' ref={ref}>
			<h3 className='font-semibold mb-2'>{colorName}</h3>
			<div className='flex flex-wrap gap-2'>
				{palette &&
					gradients.map((grade) => {
						const { className, is_primary } = palette[grade];
						return (
							<div key={grade.toString()} className='relative'>
								<ColorSwatch palette={className} label={`${grade}`} />
								{is_primary && (
									<ChevronUpIcon className='w-5 absolute left-0 right-0 m-auto' />
								)}
							</div>
						);
					})}
			</div>
		</Card>
	);
}
