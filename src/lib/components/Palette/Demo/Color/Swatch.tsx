import { cn } from "@/utils/tw";

// Color swatch component for displaying a single color

type ColorSwatchProps = {
	label: string;
	className?: string;
	palette?: string;
};
export default function ColorSwatch({ label, className, palette }: ColorSwatchProps) {
	return (
		<div className='flex flex-col items-center'>
			<div
				className={cn(
					"h-16 w-24 rounded-md inset shadow-lg border border-slate-800",
					className
				)}
				style={{
					backgroundColor: palette,
				}}
				title={label}
			></div>
			<span className='text-sm mt-1 text-center font-mono'>{label}</span>
		</div>
	);
}
