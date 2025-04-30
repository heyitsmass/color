import ColorApplications from "./Color/Applications";
import ColorGradient from "./Color/Gradient";
import ColorSwatch from "./Color/Swatch";
import Contrast from "./Contrast";
import ContrastSectionHeader from "./Contrast/SectionHeader";
import { ContrastProvider } from "./hooks/useContrast";
import Section from "./Section";
import Toast from "./Toast";
import { COLOR_LIST, TOASTS } from "@colorUtils/constants";

const SECTIONS = [
	{
		title: "Base Colors",
		className: "grid grid-cols-4 gap-4 p-4 gap-y-8",
		Element: () =>
			COLOR_LIST.map((color) => (
				<ColorSwatch
					key={color}
					className={`bg-${color} dark:bg-${color}-dark`}
					label={color}
				/>
			)),
	},
	{
		title: "Toast Colors",
		className: "list-style-none grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
		is: "ol",
		Element: () =>
			["light", "dark", "light-solid", "dark-solid"].map((id) => (
				<li key={id}>
					{TOASTS.map((color) => (
						<Toast
							key={id + ":" + color.split("-")[0]}
							colorName={color}
							solid={color.split("-")[1] === "solid"}
						/>
					))}
				</li>
			)),
	},
	{
		title: "Contrast",
		className: "flex flex-col",
		Element: () => (
			<ContrastProvider>
				<ContrastSectionHeader />
				<ul className='list-none w-full flex gap-8 items-center p-4'>
					<Contrast colors={COLOR_LIST} />
					
				</ul>
			</ContrastProvider>
		),
	},
	{
		title: "Color Gradients",
		className: "space-y-6",
		is: "div",
		Element: () =>
			(["primary", "secondary", "accent"] as const).map((color) => (
				<ColorGradient key={color} colorName={color} />
			)),
	},
	{
		title: "Color Applications",
		className: "space-y-6",
		is: "div",
		Element: () =>
			(["primary", "secondary", "accent"] as const).map((color) => (
				<ColorApplications key={color} colorName={color} />
			)),
	},
];
// Main palette tester component
const ColorPaletteDemo = () => {
	return (
		<div className='container mx-auto p-4 text-zinc-950 dark:text-zinc-50 leading-6 overflow-hidden'>
			<div className='space-y-8'>
				{SECTIONS.map(({ Element, ...props }) => (
					<Section {...props}>
						<Element />
					</Section>
				))}
			</div>
			{/*<p className='bg-primary bg-secondary bg-accent bg-danger bg-warning bg-success bg-info bg-link bg-background bg-foreground bg-input bg-separator bg-hint bg-focus bg-text-primary bg-text-secondary dark:bg-primary-dark dark:bg-secondary-dark dark:bg-accent-dark dark:bg-danger-dark dark:bg-warning-dark dark:bg-success-dark dark:bg-info-dark dark:bg-link-dark dark:bg-background-dark dark:bg-foreground-dark dark:bg-input-dark dark:bg-separator-dark dark:bg-hint-dark dark:bg-focus-dark dark:bg-text-primary-dark dark:bg-text-secondary-dark'></p>*/}
		</div>
	);
};

export default ColorPaletteDemo;
