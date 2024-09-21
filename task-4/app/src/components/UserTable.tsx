import type { User } from "../stores/UsersStore";

type UserTableProps = {
	users: User[];
	selectedUsers: number[];
	onSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSelectUser: (userId: number) => void;
};

const UserTable = ({
	users,
	selectedUsers,
	onSelectAll,
	onSelectUser,
}: UserTableProps) => (
	<table className="min-w-full bg-white">
		<thead>
			<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
				<th className="py-3 px-6 text-left">
					<input
						type="checkbox"
						onChange={onSelectAll}
						checked={selectedUsers.length === users.length && users.length > 0}
					/>
				</th>
				<th className="py-3 px-6 text-left">ID</th>
				<th className="py-3 px-6 text-left">Name</th>
				<th className="py-3 px-6 text-left">Email</th>
				<th className="py-3 px-6 text-left">Last Login</th>
				<th className="py-3 px-6 text-left">Registration Time</th>
				<th className="py-3 px-6 text-left">Status</th>
			</tr>
		</thead>
		<tbody className="text-gray-600 text-sm font-light">
			{users.map((user) => (
				<tr
					key={user.id}
					className="border-b border-gray-200 hover:bg-gray-100"
				>
					<td className="py-3 px-6 text-left whitespace-nowrap">
						<input
							type="checkbox"
							onChange={() => onSelectUser(user.id)}
							checked={selectedUsers.includes(user.id)}
						/>
					</td>
					<td className="py-3 px-6 text-left">{user.id}</td>
					<td className="py-3 px-6 text-left">{user.name}</td>
					<td className="py-3 px-6 text-left">{user.email}</td>
					<td className="py-3 px-6 text-left">{user.last_login_time}</td>
					<td className="py-3 px-6 text-left">{user.registration_time}</td>
					<td className="py-3 px-6 text-left">
						<span
							className={`py-1 px-3 rounded-full text-xs ${
								user.status === "active"
									? "bg-green-200 text-green-600"
									: "bg-red-200 text-red-600"
							}`}
						>
							{user.status}
						</span>
					</td>
				</tr>
			))}
		</tbody>
	</table>
);

export default UserTable;
