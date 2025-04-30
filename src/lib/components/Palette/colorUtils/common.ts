// Helper for range assertion
function assertRange(value: number, max: number, name?: string) {
	if (isNaN(value) || 0 > value || value > max)
		throw new RangeError(value + " for " + name + " is not between 0 and " + max);
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export { assertRange, clamp };
