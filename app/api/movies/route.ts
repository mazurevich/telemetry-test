import { trace } from "@opentelemetry/api";
import { type NextRequest, NextResponse } from "next/server";
import { moviesResponseSchema } from "#/data/movie";
import { createLogger } from "#/lib/logger";

export async function GET(request: NextRequest) {
	const requestId = crypto.randomUUID();
	const logger = createLogger({
		requestId,
		endpoint: "/api/movies",
	});

	logger.info("test");

	const tracer = trace.getTracer("movies");
	// const span = tracer.startSpan("GET https://swapi.tech/api/films/");
	// span.setAttribute("http.method", "GET");

	try {
		const url = "https://swapi.tech/api/films";
		logger.info("Fetching movies from SWAPI", { url });

		const response = await fetch(url);
		const data = await response.json();

		// span.setAttribute("http.url", url);
		// span.setAttribute("http.status_code", response.status.toString());

		const movies = moviesResponseSchema.parse(data);

		// logger.info({ msg: "Successfully fetched and parsed movies", count: movies.result.length, statusCode: response.status });

		// span.end();
		return NextResponse.json(movies.result);
	} catch (error) {
		logger.error("Failed to fetch movies", error as Error, {
			url: "https://swapi.tech/api/films",
		});
		// span.recordException(error as Error);
		// span.end();
		return NextResponse.json(
			{ error: "Failed to fetch movies" },
			{ status: 500 },
		);
	}
}
