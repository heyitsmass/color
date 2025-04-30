import { BLACK, WHITE } from "@colorUtils/constants";
import { calculateContrastRatio, getTextColorChoice } from "@colorUtils/contrast";
import { utils } from "@colorUtils/models";
import { useMemo } from "react";
import { ContrastSquareProps } from "../Contrast/Square";
import useContrast from "./useContrast";

type IsAccessibleProps = Required<Pick<ContrastSquareProps, "foreground" | "background">>;

const useIsAccessible = ({ background, foreground }: IsAccessibleProps) => {
	const { threshold, showAllPairs, showMonotone } = useContrast();

	const textChoice = useMemo(
		() => getTextColorChoice(background, threshold),
		[threshold, background]
	);

	const colors = useMemo(
		() => ({
			normal: utils.rgbaToString(foreground),
			monotone: getTextColorChoice(background, threshold) ? "black" : "white",
		}),
		[foreground, background, threshold]
	);

	const isAccessible = useMemo(() => {
		if (showAllPairs) return true;
		else {
			let fg = foreground;
			if (showMonotone) {
				fg = !textChoice ? WHITE : BLACK;
			}
			return calculateContrastRatio(fg, background) >= threshold;
		}
	}, [showAllPairs, showMonotone, textChoice, background, threshold]);

	return {
		isAccessible,
		color: isAccessible ? colors[showMonotone ? "monotone" : "normal"] : null,
		textChoice,
		showAllPairs,
		showMonotone,
	};
};

export default useIsAccessible;
