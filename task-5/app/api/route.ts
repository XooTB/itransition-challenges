import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import RecordGenerator from "@/lib/recordGenerator";
import type { GeneratorOptions } from "@/lib/recordGenerator";

export async function GET(request: NextRequest) {
	const seed = request.nextUrl.searchParams.get("seed");
	const region = request.nextUrl.searchParams.get("region");
	const count = request.nextUrl.searchParams.get("count");
	const page = request.nextUrl.searchParams.get("page");

	const options: GeneratorOptions = {
		region: region as GeneratorOptions["region"],
		seed: Number.parseInt(seed ?? "0"),
		pageNumber: Number.parseInt(page ?? "1"),
	};

	const recordGenerator = new RecordGenerator(options);

	const record = recordGenerator.generatePage(
		count ? Number.parseInt(count) : 10,
	);
	return NextResponse.json([...record]);
}
