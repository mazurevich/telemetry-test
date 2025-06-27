import { trace } from "@opentelemetry/api";
import { type NextRequest, NextResponse } from "next/server";
import { moviesResponseSchema } from "#/data/movie";
import { logError, logInfo } from "#/lib/logger";

export async function GET(request: NextRequest) {
	const tracer = trace.getTracer("movies");
	const span = tracer.startSpan("GET https://swapi.tech/api/films/");
	span.setAttribute("http.method", "GET");

	try {
		const url = "https://swapi.tech/api/films";
		logInfo("Fetching movies from SWAPI", { url });

		const response = await fetch(url);
		const data = await response.json();

		span.setAttribute("http.url", url);
		span.setAttribute("http.status_code", response.status.toString());

		const movies = moviesResponseSchema.parse(data);

		logInfo("Successfully fetched and parsed movies", {
			count: movies.result.length,
			statusCode: response.status,
		});

		span.end();
		return NextResponse.json(movies.result);
	} catch (error) {
		logError("Failed to fetch movies", error as Error, {
			url: "https://swapi.tech/api/films",
		});
		span.recordException(error as Error);
		span.end();
		return NextResponse.json(
			{ error: "Failed to fetch movies" },
			{ status: 500 },
		);
	}
}
