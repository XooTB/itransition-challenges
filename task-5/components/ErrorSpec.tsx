"use client";

import type React from "react";
import { useCallback } from "react";
import Input from "./Input";
import Slider from "./Slider";

interface ErrorSpecProps {
	errorRate: number;
	setErrorRate: (value: number) => void;
}

const ErrorSpec = ({ errorRate, setErrorRate }: ErrorSpecProps) => {
	const handleSliderChange = useCallback(
		(value: number) => {
			setErrorRate(Math.round(value * 100)); // Convert 0-10 to 0-1000
		},
		[setErrorRate],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = Math.min(1000, Math.max(0, Number(e.target.value)));
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
						min={0}
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
				initialValue={errorRate / 100}
				onChange={handleSliderChange}
			/>
		</div>
	);
};

export default ErrorSpec;
