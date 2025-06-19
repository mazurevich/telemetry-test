import { headers } from "next/headers";
import Link from "next/link";
import type { Movie } from "#/data/movie";

async function getMovies() {
	const host = (await headers()).get("host");
	if (!host) throw new Error("Host not found");

	const res = await fetch(`http://${host}/api/movies`, {
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Failed to fetch movies");
	return res.json();
}

export default async function MoviesPage() {
	const data = await getMovies();
	const movies = data;

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-6">Movies List</h1>
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
				{movies.map((movie: Movie) => (
					<div
						key={movie.uid}
						className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 flex flex-col justify-between border border-zinc-200 dark:border-zinc-800"
					>
						<div>
							<h2 className="text-xl font-semibold mb-2">
								<Link href={`/movies/${movie.uid}`}>
									{movie.properties.title}
								</Link>
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-300 mb-2 line-clamp-3">
								{movie.properties.opening_crawl}
							</p>
							<p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
								<span className="font-medium">Director:</span>{" "}
								{movie.properties.director}
							</p>
							<p className="text-xs text-zinc-500 dark:text-zinc-400">
								<span className="font-medium">Release Date:</span>{" "}
								{movie.properties.release_date}
							</p>
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
