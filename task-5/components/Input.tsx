import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, ...props }, ref) => {
		return (
			<div className="flex flex-col w-full">
				{label && (
					<label
						htmlFor={props.id}
						className="mb-1 text-base font-medium text-gray-700"
					>
						{label}
					</label>
				)}
				<input
					ref={ref}
					{...props}
					className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className || ""}`}
				/>
			</div>
		);
	},
);

export default Input;
