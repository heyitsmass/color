import { useTheme } from "@/hooks/useTheme";
import { create } from "zustand";
import { mutative } from "zustand-mutative";
import React, { PropsWithChildren, useContext, useState } from "react";

interface ContrastStore {
	threshold: number;
	defaultThreshold: number;
	showMonotone: boolean;
	showAllPairs: boolean;
	showDarkMode: boolean;
	toggleAllPairs: () => void;
	toggleMonotone: () => void;
	toggleLightMode: () => void;
	resetThreshold: () => void;
	setThreshold: (value: number) => void;
}

const DEFAULT_THRESHOLD = 4.5;
const defaultStore = {
	threshold: 4.5,
	defaultThreshold: DEFAULT_THRESHOLD,
	showAllPairs: false,
	showMonotone: false,
	showDarkMode: false,
};
const ContrastContext = React.createContext<ContrastStore>(
	Object.assign(defaultStore, {
		toggleAllPairs: () => void 0,
		toggleMonotone: () => void 0,
		toggleLightMode: () => void 0,
		resetThreshold: () => void 0,
		setThreshold: () => void 0,
	})
);

export function ContrastProvider({ children }: PropsWithChildren) {
	const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
	const [showAllPairs, setShowAllPairs] = useState(false);
	const [showMonotone, setShowMonotone] = useState(false);
	const { isLightMode, toggleLightMode } = useTheme();

	const toggleAllPairs = () => setShowAllPairs(!showAllPairs);
	const toggleMonotone = () => setShowMonotone(!showMonotone);
	const resetThreshold = () => setThreshold(DEFAULT_THRESHOLD);

	return (
		<ContrastContext.Provider
			value={{
				defaultThreshold: DEFAULT_THRESHOLD,
				threshold,
				showAllPairs,
				showMonotone,
				showDarkMode: isLightMode,
				toggleAllPairs,
				toggleMonotone,
				toggleLightMode,
				resetThreshold,
				setThreshold: (value: number) => setThreshold(Math.round(value * 100) / 100),
			}}
		>
			{children}
		</ContrastContext.Provider>
	);
}

const useZustandContrast = create<ContrastStore>()(
	mutative((set) => {
		return {
			...defaultStore,
			toggleAllPairs: () =>
				set((state) => {
					state.showAllPairs = !state.showAllPairs;
				}),
			toggleMonotone: () =>
				set((state) => {
					state.showMonotone = !state.showMonotone;
				}),
			toggleLightMode: () =>
				set((state) => {
					state.showDarkMode = !state.showDarkMode;
				}),
			resetThreshold: () =>
				set((state) => {
					state.threshold = state.defaultThreshold;
				}),
			setThreshold: (value: number) =>
				set((state) => {
					state.threshold = Math.round(value * 100) / 100;
				}),
		};
	})
);

function useContrast({ which = "zustand" }: { which?: "zustand" | "react" } = {}) {
	const reactContrast = useContext(ContrastContext);
	if (!reactContrast && which === "react")
		throw new Error("useContrast must be used inside of a ContrastProvider");

	const zustandContrast = useZustandContrast();

	return which === "zustand" ? zustandContrast : reactContrast;
}

export default useContrast;
