import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
	id: number;
	token: string;
};

type AuthStore = {
	user: User | null;
	login: (id: string, token: string) => void;
	logout: () => void;
};

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			login: (id, token) => set({ user: { id, token } }),
			logout: () => set({ user: null }),
		}),
		{
			name: "auth-storage",
		},
	),
);

export default useAuthStore;
