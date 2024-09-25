import DataTable from "@/components/DataTable";

export default async function Page() {
	return (
		<main className="min-h-screen flex justify-center items-center flex-col py-10">
			<h1 className="text-2xl font-medium font-mono">
				Random Fake Info Generator
			</h1>
			<DataTable />
		</main>
	);
}
