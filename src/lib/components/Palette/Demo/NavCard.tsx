import { cn } from "@/utils/tw";
import { PropsWithChildren } from "react";

export default function NavCard({
	children,
	title,
	headerContent,
	className,
	contentClass,
}: PropsWithChildren<{
	title: string;
	headerContent?: React.JSX.Element;
	className?: string;
	contentClass?: string;
}>) {
	return (
		<div
			className={cn(
				"border flex flex-col rounded-md py-2 pt-0 border-slate-700 bg-slate-800",
				className
			)}
		>
			<div className='flex justify-between px-2'>
				<small className='pb-1 font-semibold leading-6'>{title}</small>
				{headerContent}
			</div>
			<div className={cn("p-2 flex items-center justify-center", contentClass)}>
				{children}
			</div>
		</div>
	);
}
