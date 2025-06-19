import { type NextRequest, NextResponse } from "next/server";
import { moviesResponseSchema } from "#/data/movie";

export async function GET(request: NextRequest) {
	const response = await fetch("https://swapi.tech/api/films/");
	const data = await response.json();

	const movies = moviesResponseSchema.parse(data);
	return NextResponse.json(movies.result);
}
