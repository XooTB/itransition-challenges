import type { ChangeEvent } from "react";

interface SliderProps {
	min?: number;
	max?: number;
	step?: number;
	initialValue?: number;
	onChange?: (value: number) => void;
	value?: number;
}

const Slider = ({
	min = 0,
	max = 100,
	step = 1,
	value,
	onChange,
}: SliderProps) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value);
		if (onChange) {
			onChange(newValue);
		}
	};

	return (
		<div className="w-full max-w-xs">
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={handleChange}
				className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
			/>
			<div className="flex justify-between text-sm text-gray-600 mt-2">
				<span>{min}</span>
				<span>{value}</span>
				<span>{max}</span>
			</div>
		</div>
	);
};

export default Slider;
