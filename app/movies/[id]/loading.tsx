export default function MovieDetailLoading() {
	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold mb-2">
				<div className="h-8 bg-gray-300 rounded-lg w-48 mb-4 animate-pulse" />
			</h1>
			<p className="mb-2">
				<strong>Director:</strong>{" "}
				<span className="h-6 inline-block bg-gray-200 rounded w-64 animate-pulse" />
			</p>
			<p className="mb-2">
				<strong>Producer:</strong>{" "}
				<span className="h-6 inline-block bg-gray-200 rounded w-64 animate-pulse" />
			</p>
			<p className="mb-2">
				<strong>Opening Crawl:</strong>{" "}
				<span className="h-6 inline-block bg-gray-200 rounded w-64 animate-pulse" />
			</p>
			<p className="mb-2">
				<strong>Release Date:</strong>{" "}
				<span className="h-6 inline-block bg-gray-200 rounded w-164 animate-pulse" />
			</p>
			<p className="mb-2">
				<strong>Episode:</strong>{" "}
				<span className="h-6 inline-block bg-gray-200 rounded w-64 animate-pulse" />
			</p>
		</main>
	);
}
