import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const Moon = () => {
	return (
		<motion.div
			key='moon'
			exit={{
				opacity: 0,
			}}
		>
			<MoonIcon className='w-5' />
		</motion.div>
	);
};

const Sun = () => {
	return (
		<motion.div
			key='sun'
			exit={{
				opacity: 0,
			}}
		>
			<SunIcon className='w-5' />
		</motion.div>
	);
};
export default function ThemeButton() {
	const { isLightMode, toggleLightMode } = useTheme();
	return (
		<div
			className='dark:text-slate-50 h-max text-slate-950 border rounded-lg p-2 w-min cursor-pointer border-slate-200 bg-slate-300 dark:bg-slate-800 dark:border-slate-600  transition-all hover:opacity-80 not-hover:shadow-sm'
			onClick={toggleLightMode}
		>
			<AnimatePresence mode='popLayout'>{isLightMode ? <Moon /> : <Sun />}</AnimatePresence>
		</div>
	);
}
