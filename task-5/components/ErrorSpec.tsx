"use client";

import type React from "react";
import { useCallback, useState } from "react";
import Input from "./Input";
import Slider from "./Slider";

interface ErrorSpecProps {
	errorRate: number;
	setErrorRate: (value: number) => void;
}

const ErrorSpec = ({ errorRate, setErrorRate }: ErrorSpecProps) => {
	const [sliderValue, setSliderValue] = useState<number>(errorRate);

	const handleSliderChange = useCallback(
		(value: number) => {
			setErrorRate(value);
			setSliderValue(value);
		},
		[setErrorRate],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = Number(e.target.value);
			setErrorRate(value);
		},
		[setErrorRate],
	);

	return (
		<div className="w-full flex flex-col items-center">
			<div className="flex items-center justify-start gap-3">
				<label htmlFor="errorInput" className="text-xl">
					Error Rate:
				</label>
				<div className="w-32">
					<Input
						id="errorInput"
						type="number"
						max={1000}
						value={Math.round(errorRate)}
						onChange={handleInputChange}
					/>
				</div>
				<p className="">Errors</p>
			</div>
			<Slider
				min={0}
				max={10}
				step={0.1}
				onChange={handleSliderChange}
				value={Math.min(errorRate, 10)}
			/>
		</div>
	);
};

export default ErrorSpec;
