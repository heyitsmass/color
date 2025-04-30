import useIsAccessible from "@/components/Palette/Demo/hooks/useIsAccessible";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { RGBAColor, utils } from "@colorUtils/models";
import { useMemo } from "react";

export type ContrastSquareProps = {
	foreground: RGBAColor;
	background: RGBAColor;
	textChoice: number;
	threshold: number;
	showMonotone?: boolean;
	showAllPairs?: boolean;
};

export default function ContrastSquare({ background, foreground }: ContrastSquareProps) {
	const backgroundColor = useMemo(() => utils.rgbaToString(background), [background]);
	const { isAccessible, color } = useIsAccessible({
		background,
		foreground,
	});
	return (
		<AnimatePresence mode='popLayout' key='contrast-square'>
			{isAccessible ? (
				<motion.div
					key='contrast'
					className='border border-slate-700 rounded-sm min-w-[20px] shadow-xl aspect-square flex place-content-center place-items-center'
					style={{
						backgroundColor,
						color: color!,
					}}
					exit={{
						dur: 0.2,
						opacity: 0,
					}}
				>
					A
				</motion.div>
			) : (
				<motion.div
					key='skeleton'
					exit={{
						opacity: 0,
					}}
					className='border opacity-80 bg-slate-700 border-slate-700 rounded-sm min-w-[20px] aspect-square flex place-items-center place-content-center'
				>
					<XMarkIcon className='w-5 text-secondary dark:text-secondary-dark' />
				</motion.div>
			)}
			;
		</AnimatePresence>
	);
}
