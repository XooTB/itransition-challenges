import { create } from "zustand";

export type User = {
	id: number;
	name: string;
	email: string;
	last_login_time: string;
	registration_time: string;
	status: string;
};

type UsersStore = {
	users: User[] | null;
	addUser: (user: User) => void;
	addUsers: (users: User[]) => void;
	deleteUser: (userId: number) => void;
	updateUser: (userId: number, user: User) => void;
	blockUser: (userId: number) => void;
	unBlockUser: (userId: number) => void;
};

const useUsersStore = create<UsersStore>()((set) => ({
	users: null,
	addUser: (user) =>
		set((state) => ({ users: state.users ? [...state.users, user] : [user] })),
	addUsers: (users) => set({ users }),
	deleteUser: (userId) =>
		set((state) => ({
			users: state.users?.filter((user) => user.id !== userId),
		})),
	updateUser: (userId, user) =>
		set((state) => ({
			users: state.users?.map((u) => (u.id === userId ? user : u)),
		})),
	blockUser: (userId) => {
		return set((state) => ({
			users: state.users?.map((u) =>
				u.id === userId ? { ...u, status: "blocked" } : u,
			),
		}));
	},
	unBlockUser: (userId) => {
		return set((state) => ({
			users: state.users?.map((u) =>
				u.id === userId ? { ...u, status: "active" } : u,
			),
		}));
	},
}));

export default useUsersStore;
