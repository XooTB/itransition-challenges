import { useState } from "react";
import { useStore } from "zustand";
import useAuthStore from "../stores/AuthStore";
import { useUrl } from "crossroad";

const useUpdateUserStatus = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>();
	const { user, logout } = useStore(useAuthStore);
	const [_, setUrl] = useUrl();

	const updateUserStatus = async (id: number, status: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/changestatus/${id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user?.token}`,
					},
					body: JSON.stringify({ status }),
				},
			);

			if (response.status === 403) {
				setError("Your account is blocked. Please contact support.");
				setUrl("/login?status=user_blocked");
				return;
			}

			if (response.status === 404) {
				setError("Your account was not found. It may have been deleted.");
				setUrl("/login?status=user_deleted");
				logout();
				return;
			}

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "An unknown error occurred");
			}

			// Handle successful response
			const data = await response.json();
			// Process the data as needed

			setIsLoading(false);
		} catch (err: any) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
			setIsLoading(false);
		}
	};

	return { isLoading, error, updateUserStatus };
};

export default useUpdateUserStatus;
