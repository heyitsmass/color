import { checkWCAGAccessibility, getContrastPalettes } from "@colorUtils";
import { useMemo, useRef } from "react";

import { ACCESSIBILITY, type Colors } from "@colorUtils/constants";
import useContrast from "../hooks/useContrast";
import ContrastSquare from "./Square";

type ContrastProps = {
	colors: Colors[];
	dark?: boolean;
};

export default function Contrast({ colors, dark = false }: ContrastProps) {
	const { threshold, showAllPairs, showMonotone } = useContrast();
	const ref = useRef<HTMLLIElement>(null);

	const contrastPalettes = useMemo(
		() => ref.current && getContrastPalettes(ref.current, colors),
		[colors, ref.current]
	);

	const wcagLevel = checkWCAGAccessibility(threshold, showAllPairs || showMonotone);

	return (
		<li
			className='border bg-slate-800 border-slate-700 shadow-lg max-w-3xl rounded-xl min-w-xl w-full flex flex-col items-center p-4 p-x-0 gap-4'
			ref={ref}
		>
			<div className='w-full flex justify-between items-center'>
				<h4>{dark ? "Dark Mode" : "Light Mode"}</h4>
				<div className='flex gap-4 w-max'>
					<div className='flex items-center gap-2'>
						<p className='opacity-80'>
							<small>
								<i>
									Showing {ACCESSIBILITY[wcagLevel]} contrast pairs{" "}
									{!showAllPairs && <>&#40;{threshold}:1&#41;</>}
								</i>
							</small>
						</p>
					</div>
				</div>
			</div>
			<div
				className='grid gap-1 max-w-2xl w-full shadow-2xl drop-shadow-lg inset-10'
				style={{
					gridTemplateColumns: `repeat(${colors.length / 2}, 1fr)`,
				}}
			>
				{contrastPalettes &&
					Object.entries(contrastPalettes).map(([key, combination]) => (
						<ContrastSquare
							key={key}
							{...combination}
							threshold={threshold}
							showAllPairs={showAllPairs}
							showMonotone={showMonotone}
						/>
					))}
			</div>
		</li>
	);
}
