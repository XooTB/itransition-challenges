import { useState } from "react";
import useAuthStore from "../stores/AuthStore";
import { useStore } from "zustand";
import { useUrl } from "crossroad";

const useUserLogin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [_, setUrl] = useUrl();

	// Store Initialization
	const { login } = useStore(useAuthStore);

	const loginUser = async (email: string, password: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.status === 401) {
				setUrl("/login?status=not_found");
				setIsLoading(false);
				throw new Error("Invalid credentials");
			}

			if (response.status === 403) {
				setUrl("/login?status=user_blocked");
				setIsLoading(false);
				return;
			}

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			const data = await response.json();
			login(data.id, data.token);

			setUrl("/dashboard");

			setIsLoading(false);
		} catch (err: any) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	return { isLoading, error, loginUser };
};

export default useUserLogin;
