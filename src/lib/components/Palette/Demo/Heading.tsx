import { createElement, PropsWithChildren } from "react";

// Heading component
export default function Heading({
	children,
	level = 2,
}: PropsWithChildren<{
	level: 1 | 2 | 3 | 4 | 5 | 6;
}>) {
	const Tag = `h${level}`;
	return createElement(Tag, {
		className: "text-xl font-bold mb-4",
		children,
	});
}
