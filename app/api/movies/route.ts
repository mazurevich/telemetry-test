import { trace } from "@opentelemetry/api";
import { type NextRequest, NextResponse } from "next/server";
import { moviesResponseSchema } from "#/data/movie";

export async function GET(request: NextRequest) {
	const tracer = trace.getTracer("movies");
	const span = tracer.startSpan("GET https://swapi.tech/api/films/");
	span.setAttribute("http.method", "GET");

	const url = "https://swapi.tech/api/films";
	const response = await fetch(url);
	const data = await response.json();

	span.setAttribute("http.url", url);
	span.setAttribute("http.status_code", response.status.toString());
	const movies = moviesResponseSchema.parse(data);
	span.end();
	return NextResponse.json(movies.result);
}
