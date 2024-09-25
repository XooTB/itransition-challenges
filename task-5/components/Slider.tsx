import { useState } from "react";
import type { ChangeEvent } from "react";

interface SliderProps {
	min?: number;
	max?: number;
	step?: number;
	initialValue?: number;
	onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
	min = 0,
	max = 100,
	step = 1,
	initialValue = 50,
	onChange,
}) => {
	const [value, setValue] = useState<number>(initialValue);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value);
		setValue(newValue);
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
