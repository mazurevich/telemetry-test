import { z } from "zod";

export const movieSchema = z.object({
	properties: z.object({
		created: z.string(),
		edited: z.string(),
		starships: z.array(z.string()),
		vehicles: z.array(z.string()),
		planets: z.array(z.string()),
		producer: z.string(),
		title: z.string(),
		episode_id: z.number(),
		director: z.string(),
		release_date: z.string(),
		opening_crawl: z.string(),
		characters: z.array(z.string()),
		species: z.array(z.string()),
		url: z.string(),
	}),
	_id: z.string(),
	description: z.string(),
	uid: z.string(),
	__v: z.number(),
});

export const moviesSchema = z.array(movieSchema);

export const moviesResponseSchema = z.object({
	message: z.string(),
	result: moviesSchema,
});

export const movieResponseSchema = z.object({
	message: z.string(),
	result: movieSchema,
});

export type Movie = z.infer<typeof movieSchema>;
export type MoviesResponse = z.infer<typeof moviesResponseSchema>;
