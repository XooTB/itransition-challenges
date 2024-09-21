import { type FormEvent, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import useUserLogin from "../hooks/useUserLogin";
import { useQuery } from "crossroad";

const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { isLoading, error, loginUser } = useUserLogin();
	const [query] = useQuery("status");

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginUser(email, password);
	};

	const handleQuery = () => {
		if (query === "user_blocked") {
			return "Your account is blocked. Please contact support.";
		}

		if (query === "user_deleted") {
			return "Your account was not found. It may have been deleted.";
		}

		if (query === "timeout") {
			return "Your session has expired. Please login again.";
		}

		if (query === "not_found") {
			return "User not found. Please check your credentials.";
		}
	};

	return (
		<div className="border w-1/3 flex flex-col justify-center items-center py-20 rounded-lg">
			<h1 className="text-3xl font-medium pb-5">Login</h1>
			<form className="w-1/2 flex flex-col gap-5" onSubmit={handleFormSubmit}>
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
				{query && <p className="text-red-500">{handleQuery()}</p>}
				<Button disabled={isLoading} type="submit">
					{isLoading ? "Loading..." : "Login"}
				</Button>
			</form>
			<p className="pt-4">
				Don't have an account?{" "}
				<a href="/register" className="text-blue-500 font-semibold">
					Register
				</a>
			</p>
		</div>
	);
};

export default LoginForm;
