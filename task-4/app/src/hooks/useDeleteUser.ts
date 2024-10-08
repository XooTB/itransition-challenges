import { useState } from "react";
import { useStore } from "zustand";
import useAuthStore from "../stores/AuthStore";
import { useUrl } from "crossroad";

const useDeleteUser = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { user, logout } = useStore(useAuthStore);
	const [_, setUrl] = useUrl();

	const removeUser = async (id: number) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/delete/${id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user?.token}`,
					},
				},
			);

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error);
			}

			if (user?.id === id) {
				logout();
			}

			// const data = await response.json();

			setIsLoading(false);
		} catch (err: any) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	return { isLoading, error, removeUser };
};

export default useDeleteUser;
