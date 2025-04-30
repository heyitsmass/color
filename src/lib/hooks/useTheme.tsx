import useLocalStorage from "./useLocalStorage";
import React, { PropsWithChildren } from "react";

const ThemeContext = React.createContext({
	isLightMode: true,
	toggleLightMode: () => {},
});

const ThemeProvider = ({ children }: PropsWithChildren) => {
	const [isLightMode, setMode] = useLocalStorage("light-mode", true);

	const toggleMode = () => setMode(!isLightMode);

	return (
		<ThemeContext.Provider
			value={{
				isLightMode,
				toggleLightMode: toggleMode,
			}}
		>
			<div className={isLightMode ? undefined : "dark"}>{children}</div>
		</ThemeContext.Provider>
	);
};

const useTheme = () => {
	const context = React.useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used inside of a ThemeProvider");

	return context;
};

export { useTheme, ThemeProvider };
