import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn<T extends unknown[]>(...args: T) {
	return twMerge(clsx(args));
}
