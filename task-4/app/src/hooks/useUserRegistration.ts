import { useState } from "react";
import useAuthStore from "../stores/AuthStore";
import { useStore } from "zustand";
import { useUrl } from "crossroad";

const useUserRegistration = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [_, setUrl] = useUrl();

	// Store Initialization
	const { login } = useStore(useAuthStore);

	const registerUser = async (
		name: string,
		email: string,
		password: string,
	) => {
		setIsLoading(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});

			if (response.status === 400) {
				setError("Email already exists!");
				setIsLoading(false);
				return;
			}

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			const data = await response.json();
			setSuccessMessage(data.message);
			login(data.id, data.token);

			setUrl("/dashboard");

			setIsLoading(false);
		} catch (err: any) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	return { isLoading, error, registerUser, successMessage };
};

export default useUserRegistration;
