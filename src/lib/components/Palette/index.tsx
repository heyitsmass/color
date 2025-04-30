import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type PaletteProps = {};
export default function Palette({ children }: PropsWithChildren<PaletteProps>) {
	return (
		<section
			id='palette'
			className={twMerge(
				"border rounded-2xl bg-slate-200 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700 drop-shadow-2xl"
			)}
		>
			{children}
		</section>
	);
}
