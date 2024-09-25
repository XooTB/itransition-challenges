import React from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Button from "./Button";

type Info = {
	index: number;
	id: string;
	fullName: string;
	address: string;
	phoneNumber: string;
};

interface Props {
	data: Info[];
}

const ExportButtons = ({ data }: Props) => {
	const exportToJson = () => {
		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		saveAs(blob, "data.json");
	};

	const exportToCsv = () => {
		const csv = Papa.unparse(data);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		saveAs(blob, "data.csv");
	};

	return (
		<div className="flex gap-4">
			<Button onClick={exportToJson}>Export to JSON</Button>
			<Button onClick={exportToCsv}>Export to CSV</Button>
		</div>
	);
};

export default ExportButtons;
