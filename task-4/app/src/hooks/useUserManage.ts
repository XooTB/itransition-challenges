import { useStore } from "zustand";
import useUsersStore from "../stores/UsersStore";
import useUpdateUserStatus from "./useUpdateUserStatus";
import useDeleteUser from "./useDeleteUser";

const useUserManage = (selectedUsers: number[]) => {
	const { blockUser, unBlockUser, deleteUser } = useStore(useUsersStore);
	const { updateUserStatus } = useUpdateUserStatus();
	const { removeUser } = useDeleteUser();

	const handleBlock = () => {
		selectedUsers.map(async (userId) => {
			await updateUserStatus(userId, "blocked");
			blockUser(userId);
		});
	};

	const handleUnblock = async () => {
		selectedUsers.map(async (user) => {
			await updateUserStatus(user, "active");
			unBlockUser(user);
		});
	};

	const handleDelete = () => {
		selectedUsers.map(async (user) => {
			await removeUser(user);
			deleteUser(user);
		});
	};

	return { handleBlock, handleUnblock, handleDelete };
};

export default useUserManage;
