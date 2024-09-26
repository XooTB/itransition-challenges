"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import SeedGen from "./SeedGen";
import ErrorGenerator from "@/lib/errorGenerator";
import ErrorSpec from "./ErrorSpec";
import ExportButtons from "./ExportButtons";

type Info = {
	index: number;
	id: string;
	fullName: string;
	address: string;
	phoneNumber: string;
};

type Props = {
	data: Info[];
	tableRef: React.RefObject<HTMLTableElement>;
};

const Table = ({ data, tableRef }: Props) => {
	return (
		<table className="w-full border bg-white" ref={tableRef}>
			<thead className="">
				<tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
					<th className="py-3 px-6 text-left">ID</th>
					<th className="py-3 px-6 text-left">UID</th>
					<th className="py-3 px-6 text-left">Full Name</th>
					<th className="py-3 px-6 text-left">Address</th>
					<th className="py-3 px-6 text-left">Phone Number</th>
				</tr>
			</thead>
			<tbody className="text-gray-600 text-sm font-light">
				{data.map((info, i) => (
					<tr
						key={info.id}
						className="border-b border-gray-200 hover:bg-gray-100"
					>
						<td className="py-3 px-6 text-left">{info.index}</td>
						<td className="py-3 px-6 text-left">{info.id}</td>
						<td className="py-3 px-6 text-left">{info.fullName}</td>
						<td className="py-3 px-6 text-left">{info.address}</td>
						<td className="py-3 px-6 text-left">{info.phoneNumber}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

const DataTable = () => {
	const [data, setData] = useState<Info[]>([]);
	const [erroredData, setErroredData] = useState<Info[]>([]);
	const [seed, setSeed] = useState<number>(
		Math.floor(Math.random() * 100000000000000),
	);
	const [region, setRegion] = useState<string>("England");
	const [page, setPage] = useState<number>(1);
	const tableRef = useRef<HTMLTableElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorRate, setErrorRate] = useState<number>(0);

	console.log(errorRate);

	const handleRegionChange = async (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const newRegion = e.target.value;
		setRegion(newRegion);
		setPage(1);
		await fetchData(newRegion);
	};

	const fetchData = async (currentRegion: string) => {
		setIsLoading(true);
		try {
			const res = await fetch(
				`/api?seed=${seed}&region=${currentRegion}&count=20&page=1`,
			);
			const data = await res.json();
			setData(data);
			setIsLoading(false);
		} catch (err) {
			console.error(err);
			setIsLoading(false);
		}
	};

	const infiniteFetch = async () => {
		setIsLoading(true);
		try {
			const res = await fetch(
				`/api?seed=${seed}&region=${region}&count=10&page=${page + 1}`,
			);
			const newData = await res.json();
			setData((prevData) => [...prevData, ...newData]);
			setIsLoading(false);
		} catch (err) {
			console.error(err);
			setIsLoading(false);
		}
	};

	const randomizeSeed = () => {
		const seed = Math.floor(Math.random() * 100000000000000);
		setSeed(seed);
		setPage(1);
		fetchData(region);
	};

	const handleSeedUpdate = (e: ChangeEvent<HTMLInputElement>) => {
		const seed = Number.parseInt(e.target.value);
		setSeed(seed);
		setPage(1);
		fetchData(region);
	};

	useEffect(() => {
		if (page === 1) {
			fetchData(region);
		} else {
			infiniteFetch();
		}
	}, [page]);

	const handleScroll = () => {
		if (
			tableRef.current &&
			window.scrollY + window.innerHeight >=
				tableRef.current.offsetHeight + tableRef.current.offsetTop &&
			!isLoading
		) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	useEffect(() => {
		const errorGenerator = new ErrorGenerator(seed, errorRate);
		const newData = data.map((info) => errorGenerator.applyErrors(info));
		setErroredData(newData);
	}, [errorRate, data]);

	return (
		<div className="w-full px-20 rounded-lg mt-10">
			<div>
				<div className="flex items-center justify-center gap-5 pb-10">
					<SeedGen
						seed={seed}
						randomizer={randomizeSeed}
						handleChange={handleSeedUpdate}
					/>
					<select
						className="px-2 py-2 rounded-lg"
						onChange={handleRegionChange}
					>
						<option value="England">England</option>
						<option value="Germany">Germany</option>
						<option value="Poland">Poland</option>
						<option value="France">France</option>
					</select>
				</div>
				<div className="flex items-center justify-center pb-10">
					<ErrorSpec errorRate={errorRate} setErrorRate={setErrorRate} />
					{errorRate > 0 ? (
						<ExportButtons data={erroredData} />
					) : (
						<ExportButtons data={data} />
					)}
				</div>
			</div>
			{errorRate > 0 ? (
				<Table data={erroredData} tableRef={tableRef} />
			) : (
				<Table data={data} tableRef={tableRef} />
			)}
		</div>
	);
};

export default DataTable;
