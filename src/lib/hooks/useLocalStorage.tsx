import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, defaultValue?: T) {
	const [state, setValue] = useState<T | null>(null);

	const handleChange = (value: T | ((state: T) => T)) => {
		if (typeof value === "function") value = (value as (state: T) => T)(state!) as T;
		const v = typeof value === "string" ? value : JSON.stringify(value);
		localStorage.setItem(key, v);
		setValue(value);
	};

	useEffect(() => {
		const v = localStorage.getItem(key);
		handleChange(v ? JSON.parse(v) : defaultValue);
	}, []);

	return [state, handleChange] as [value: T, setValue: typeof handleChange];
}
