import { useEffect, useState } from "react";
import { useStore } from "zustand";
import useAuthStore from "../stores/AuthStore";
import { useUrl } from "crossroad";
import Button from "../components/Button";
import { Trash2, Unlock } from "lucide-react";
import UserTable from "../components/UserTable";
import useGetUsers from "../hooks/useGetUsers";
import useUsersStore from "../stores/UsersStore";
import useUserManage from "../hooks/useUserManage";

const Dashboard = () => {
	const { users } = useStore(useUsersStore);
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

	const { user, logout } = useStore(useAuthStore);
	const [_, setUrl] = useUrl();
	const { getUsers } = useGetUsers();
	const { handleBlock, handleUnblock, handleDelete } =
		useUserManage(selectedUsers);

	useEffect(() => {
		if (!user) {
			console.log("Redirecting to login");
			setUrl("/login");
		} else {
			getUsers();
		}
	}, [user, setUrl]);

	const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedUsers(users ? users.map((user) => Number(user.id)) : []);
		} else {
			setSelectedUsers([]);
		}
	};

	const handleSelectUser = (userId: number) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">User Management Dashboard</h1>
			<div className="mb-4 flex justify-between items-center">
				<div className="space-x-2 flex items-center">
					<Button
						onClick={handleBlock}
						className="bg-red-500 text-white px-4 py-2 rounded"
					>
						Block
					</Button>
					<Button
						onClick={handleUnblock}
						className="bg-green-500 text-white p-2 rounded"
					>
						<Unlock size={26} />
					</Button>
					<Button
						onClick={handleDelete}
						className="bg-gray-500 text-white p-2 rounded"
					>
						<Trash2 size={26} />
					</Button>
				</div>
				<Button
					className="bg-blue-500 text-white px-4 py-2 rounded"
					onClick={logout}
				>
					Logout
				</Button>
			</div>
			{users && users.length !== 0 && (
				<UserTable
					users={users}
					selectedUsers={selectedUsers}
					onSelectAll={handleSelectAll}
					onSelectUser={handleSelectUser}
				/>
			)}
		</div>
	);
};

export default Dashboard;
