"use client";
import type React from "react";
import Input from "./Input";
import Button from "./Button";
import { Dice5 } from "lucide-react";
import { useEffect } from "react";
import type { ChangeEvent } from "react";

type Props = {
	seed: number;
	randomizer: () => void;
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const SeedGen = ({ seed, randomizer, handleChange }: Props) => {
	useEffect(() => {
		randomizer();
	}, []);

	return (
		<div className="w-2/3 flex justify-center items-center gap-5">
			<h1 className="text-lg">Seed</h1>
			<Input
				type="number"
				className="w-full"
				value={seed}
				onChange={handleChange}
			/>
			<Button className="flex gap-2 items-center text-xs" onClick={randomizer}>
				<Dice5 size={30} /> Randomize
			</Button>
		</div>
	);
};

export default SeedGen;
