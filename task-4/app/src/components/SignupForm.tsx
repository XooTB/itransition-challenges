import Button from "./Button";
import Input from "./Input";
import useUserRegistration from "../hooks/useUserRegistration";
import { useState } from "react";
import type { FormEvent } from "react";
import { useStore } from "zustand";
import useAuthStore from "../stores/AuthStore";
import { useUrl } from "crossroad";

const SignupForm = () => {
	// States for form fields
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Hooks Initialization
	const { isLoading, error, registerUser } = useUserRegistration();
	const { user } = useStore(useAuthStore);
	const [_, setUrl] = useUrl();

	// Handle form submission
	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		await registerUser(name, email, password);
	};

	return (
		<div className="border w-1/3 flex flex-col justify-center items-center py-20 rounded-lg">
			<h1 className="text-3xl font-medium pb-5">Signup</h1>
			<form className="w-1/2 flex flex-col gap-5" onSubmit={handleFormSubmit}>
				<Input
					label="Name"
					type="text"
					name="name"
					placeholder="Enter your Name"
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<Input
					label="Email"
					type="email"
					name="email"
					placeholder="Enter your Email"
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<Input
					label="Password"
					type="password"
					name="password"
					placeholder="Enter your Password"
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				{error && <p className="text-red-500">{error}</p>}
				<Button disabled={isLoading} type="submit">
					{isLoading ? "Loading..." : "Signup"}
				</Button>
			</form>
			<p className="pt-4">
				Already have a account?{" "}
				<a href="/login" className="text-blue-500 font-semibold">
					Login
				</a>
			</p>
		</div>
	);
};

export default SignupForm;
