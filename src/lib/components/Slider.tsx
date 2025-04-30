import React, { useEffect, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useDebounce from "@/hooks/useDebounce";

export default function Slider({
	min = 0,
	max = 100,
	step = 1,
	name,
	defaultValue = 50,
	onChange,
	label = "Slider",
	showValue = false,
	showMinMaxLabels = false,
	minLabel,
	maxLabel,
	trackColor = "bg-blue-500",
	thumbColor = "bg-blue-700",
	height = "h-1",
	width = "w-full",
	thumbSize = "h-3 w-3",
}: {
	name: string;
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: number;
	onChange: (value: number) => void;
	label?: string;
	showValue?: boolean;
	showMinMaxLabels?: boolean;
	minLabel?: string;
	maxLabel?: string;
	trackColor?: string;
	thumbColor?: string;
	height?: string;
	width?: string;
	thumbSize?: string;
}) {
	const [value, setValue] = useLocalStorage(`${name}-slider`, defaultValue);
	//const value = useDebounce(originValue, 50);
	const [dragging, setDragging] = useState(false);
	const sliderRef = useRef<HTMLDivElement>(null);

	// Calculate value from mouse/touch position
	const calculateValue = (clientX: number) => {
		const rect = sliderRef.current!.getBoundingClientRect();
		const percentage = (clientX - rect.left) / rect.width;
		const newValue = min + percentage * (max - min);
		return Math.min(max, Math.max(min, Math.round(newValue / step) * step));
	};

	// Handle mouse events
	const startDrag: React.MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault(); // Prevent text selection
		setDragging(true);
		document.addEventListener("mousemove", onDrag);
		document.addEventListener("mouseup", stopDrag);

		// Set initial position
		updateValue(e.clientX);
	};

	const onDrag = (e: MouseEvent) => {
		if (dragging) {
			updateValue(e.clientX);
		}
	};

	const stopDrag = () => {
		setDragging(false);
		document.removeEventListener("mousemove", onDrag);
		document.removeEventListener("mouseup", stopDrag);
	};

	// Handle touch events
	const startTouchDrag: React.TouchEventHandler<HTMLDivElement> = (e) => {
		setDragging(true);
		document.addEventListener("touchmove", onTouchDrag, { passive: false });
		document.addEventListener("touchend", stopTouchDrag);

		// Set initial position
		updateValue(e.touches[0].clientX);
	};

	const onTouchDrag = (e: TouchEvent) => {
		if (dragging) {
			e.preventDefault(); // Prevent scrolling while dragging
			updateValue(e.touches[0].clientX);
		}
	};

	const stopTouchDrag = () => {
		setDragging(false);
		document.removeEventListener("touchmove", onTouchDrag);
		document.removeEventListener("touchend", stopTouchDrag);
	};

	useEffect(() => {
		onChange(value);
	}, [value]);
	// Update the value
	const updateValue = (clientX: number) => {
		const newValue = calculateValue(clientX);
		setValue(newValue);
	};

	// Clean up event listeners
	useEffect(() => {
		return () => {
			document.removeEventListener("mousemove", onDrag);
			document.removeEventListener("mouseup", stopDrag);
			document.removeEventListener("touchmove", onTouchDrag);
			document.removeEventListener("touchend", stopTouchDrag);
		};
	}, []);

	// Need to update onDrag reference when dragging state changes
	useEffect(() => {
		if (dragging) {
			document.addEventListener("mousemove", onDrag);
			document.addEventListener("mouseup", stopDrag);
		} else {
			document.removeEventListener("mousemove", onDrag);
			document.removeEventListener("mouseup", stopDrag);
		}
		return () => {
			document.removeEventListener("mousemove", onDrag);
			document.removeEventListener("mouseup", stopDrag);
		};
	}, [dragging]);

	const percentage = ((value - min) / (max - min)) * 100;

	return (
		<div className='flex flex-col space-y-2 w-full'>
			<div className='flex justify-between items-center'>
				<label className='text-sm font-medium text-gray-700'>{label}</label>
				{showValue && (
					<span className='text-sm font-medium text-gray-500'>{value}</span>
				)}
			</div>

			<div className='relative py-2 select-none' ref={sliderRef}>
				{/* Track */}
				<div
					className={`rounded-full bg-gray-200 ${width} ${height} cursor-pointer`}
					onMouseDown={startDrag}
					onTouchStart={startTouchDrag}
				>
					{/* Filled track */}
					<div
						className={`absolute rounded-full ${trackColor} ${height}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>

				{/* Thumb */}
				<div
					className={`absolute rounded-full ${thumbColor} ${thumbSize} shadow transform -translate-y-1/2 -translate-x-1/2 cursor-grab ${
						dragging ? "cursor-grabbing" : ""
					}`}
					style={{
						top: "50%",
						left: `${percentage}%`,
					}}
					onMouseDown={startDrag}
					onTouchStart={startTouchDrag}
				/>
			</div>

			{showMinMaxLabels && (
				<div className='flex justify-between text-xs text-gray-500'>
					<span>{minLabel !== undefined ? minLabel : min}</span>
					<span>{maxLabel !== undefined ? maxLabel : max}</span>
				</div>
			)}
		</div>
	);
}
