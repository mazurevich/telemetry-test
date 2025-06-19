import { type NextRequest, NextResponse } from "next/server";
import { movieResponseSchema } from "#/data/movie";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const response = await fetch(`https://swapi.tech/api/films/${params.id}`);
	const data = await response.json();

	const movie = movieResponseSchema.parse(data);
	return NextResponse.json(movie.result);
}
