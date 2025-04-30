import { createElement, PropsWithChildren } from "react";

export default function Section({
	title,
	children,
	is = "section",
	...props
}: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
	return (
		<section className='border grid grid-rows-[auto_1fr] p-4 pt-2 w-full rounded-lg bg-zinc-800 border-zinc-700'>
			<h2 className='flex items-center p-2 text-xl font-semibold'>{title}</h2>
			{createElement(is, { children, ...props })}
		</section>
	);
}
