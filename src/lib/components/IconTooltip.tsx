import { ForwardRefExoticComponent, RefAttributes, SVGProps, useId } from "react";
import { Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";

type IconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
	title?: string;
	titleId?: string;
} & RefAttributes<SVGSVGElement>;

const ICON_SIZE_MAP = {
	xs: "w-2 h-2",
	sm: "w-4 h-4",
	md: "w-5 h-5",
	lg: "w-7 h-7",
	xl: "w-8 h-8",
	"2xl": "w-10 h-10",
};

type IconToolTipProps = {
	Icon: ForwardRefExoticComponent<IconProps>;
	size: keyof typeof ICON_SIZE_MAP;
	iconProps: Omit<IconProps, "id">;
} & Parameters<typeof Tooltip>[number];

export default function IconTooltip({
	Icon,
	size = "sm",
	iconProps: { className, ...iconProps },
	...props
}: IconToolTipProps) {
	const id = useId();

	return (
		<>
			<Icon
				className={twMerge(className, ICON_SIZE_MAP[size], "aspect-square")}
				id={`icon${id}`}
				{...iconProps}
			/>
			<Tooltip anchorSelect={`#icon${id}`} {...props} />
		</>
	);
}
