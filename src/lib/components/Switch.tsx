import { cn } from "@/utils/tw";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Switch({
	name,
	isActive,
	onValueChange,
}: {
	name: string;
	isActive: boolean;
	onValueChange: (value: boolean) => void;
}) {
	const [state, setState] = useLocalStorage(`${name}-switch`, isActive);

	return (
		<div
			className='w-full'
			onClick={async () => {
				setState(!state);
				onValueChange?.(!state);
			}}
		>
			<div
				key='track'
				className={cn(
					"w-10 h-6 rounded-full relative border border-slate-600",
					state ? "bg-emerald-700" : "bg-slate-700"
				)}
			>
				<div
					key='thumb'
					className={cn(
						"transition-all cursor-pointer w-5 h-4.75 aspect-square bg-slate-800 border border-slate-600 shadow-xl  rounded-full absolute top-1/2 -translate-y-1/2 bottom-1/2",
						state ? "translate-x-4" : "translate-x-0.5 bg-slate-900"
					)}
				></div>
			</div>
		</div>
	);
}
