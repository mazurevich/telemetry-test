import { notFound } from "next/navigation";

const getMovie = async (id: string) => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/movies/${id}`);
	const data = await res.json();
	return data;
};

export default async function MovieDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const movie = await getMovie(params.id);
	if (!movie) return notFound();

	const { properties } = movie;

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-2">
				{properties.title} ({properties.release_date})
			</h1>
			<p className="mb-2">
				<strong>Director:</strong> {properties.director}
			</p>
			<p className="mb-2">
				<strong>Producer:</strong> {properties.producer}
			</p>
			<p className="mb-2">
				<strong>Opening Crawl:</strong> {properties.opening_crawl}
			</p>
			<p className="mb-2">
				<strong>Release Date:</strong> {properties.release_date}
			</p>
			<p className="mb-2">
				<strong>Episode:</strong> {properties.episode_id}
			</p>
		</main>
	);
}
