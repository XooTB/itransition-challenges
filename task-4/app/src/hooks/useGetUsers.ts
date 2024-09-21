import { useState } from "react";
import useAuthStore from "../stores/AuthStore";
import { useStore } from "zustand";
import useUsersStore from "../stores/UsersStore";
import { useUrl } from "crossroad";

const useGetUsers = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [_, setUrl] = useUrl();

	// Store Initialization
	const { user, logout } = useStore(useAuthStore);
	const { addUsers } = useStore(useUsersStore);

	const getUsers = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user?.token}`,
				},
			});

			if (response.status === 401) {
				setError("Unauthorized");
				logout();
				setUrl("/login?status=timeout");
				setIsLoading(false);
				return;
			}

			if (response.status === 403) {
				setError("Your account is blocked. Please contact support.");
				logout();
				setUrl("/login?status=user_blocked");
				setIsLoading(false);
				return;
			}

			if (response.status === 404) {
				setError("Your account was not found. It may have been deleted.");
				logout();
				setUrl("/login?status=user_deleted");
				setIsLoading(false);
				return;
			}

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			const data = await response.json();
			addUsers(data);

			setIsLoading(false);
		} catch (err: any) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	return { isLoading, error, getUsers };
};

export default useGetUsers;
