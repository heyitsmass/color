// Component to display different types of color applications

import React from "react";
import { COLOR_APPLICATIONS, Colors } from "@colorUtils/constants";
import Card from "../Card";

type ColorApplicationsProps = { colorName: Colors };

type ValidOptions = {
	div: HTMLDivElement;
	p: HTMLParagraphElement;
	svg: SVGSVGElement;
};

type ApplicationProps<Is extends keyof ValidOptions> = Omit<
	React.DetailedHTMLProps<React.HTMLAttributes<ValidOptions[Is]>, ValidOptions[Is]>,
	"children" | "className" | "ref"
> & {
	colorName: Colors;
};

const Background = ({ colorName, ...props }: ApplicationProps<"div">) => (
	<div
		className={`h-16 w-full bg-${colorName} dark:bg-${colorName}-dark rounded-md`}
		{...props}
	/>
);
const Text = ({ colorName, ...props }: ApplicationProps<"p">) => (
	<p className={`text-${colorName} dark:text-${colorName}-dark font-medium`} {...props}>
		Sample Text
	</p>
);
const Border = ({ colorName, ...props }: ApplicationProps<"div">) => (
	<div
		className={`h-16 w-full border-2 border-${colorName} dark:border-${colorName}-dark rounded-md`}
		{...props}
	/>
);
const Ring = ({ colorName, ...props }: ApplicationProps<"div">) => (
	<div
		className={`h-16 w-full ring-2 ring-${colorName} dark:ring-${colorName}-dark rounded-md`}
		{...props}
	/>
);
const Shadow = ({ colorName, ...props }: ApplicationProps<"div">) => (
	<div
		className={`h-16 w-full shadow-lg shadow-${colorName} dark:shadow-${colorName}-dark bg-white rounded-md`}
		{...props}
	/>
);
const Fill = ({ colorName, ...props }: Omit<ApplicationProps<"svg">, "viewBox">) => (
	<svg
		className={`h-16 w-full fill-${colorName} dark:fill-${colorName}-dark`}
		viewBox='0 0 100 100'
		{...props}
	>
		<circle cx='50' cy='50' r='40' />
	</svg>
);
const Stroke = ({ colorName, ...props }: Omit<ApplicationProps<"svg">, "viewBox">) => (
	<svg
		className={`h-16 w-full stroke-${colorName} dark:stroke-${colorName}-dark stroke-2 fill-none`}
		viewBox='0 0 100 100'
		{...props}
	>
		<circle cx='50' cy='50' r='40' />
	</svg>
);
const Default = ({ colorName, ...props }: ApplicationProps<"div">) => (
	<div
		className={`h-16 w-full bg-${colorName} dark:bg-${colorName}-dark rounded-md`}
		{...props}
	/>
);

const APPLICATIONS = {
	bg: Background,
	text: Text,
	border: Border,
	ring: Ring,
	shadow: Shadow,
	fill: Fill,
	stroke: Stroke,
	default: Default,
};

type ValidApplications = keyof typeof APPLICATIONS;

type ApplicationPropsMap<T extends ValidApplications> = Parameters<(typeof APPLICATIONS)[T]>[0];

function ColorApplication<T extends ValidApplications>({
	prefix,
	label,
	...props
}: {
	prefix: T;
	label: string;
} & ApplicationPropsMap<T>) {
	const Element = APPLICATIONS[prefix];

	return (
		<div className='flex flex-col items-center'>
			{/** @ts-expect-error */}
			<Element {...props} />
			<span className='text-sm mt-1'>{label}</span>
		</div>
	);
}

export default function ColorApplications({ colorName }: ColorApplicationsProps) {
	return (
		<Card className='p-4 w-full'>
			<h3 className='font-semibold mb-2'>{colorName} Applications</h3>
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
				{COLOR_APPLICATIONS.map((app) => {
					return <ColorApplication {...app} colorName={colorName} />;
				})}
			</div>
		</Card>
	);
}
