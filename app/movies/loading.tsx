import React from "react";

const MoviesLoadingSkeleton = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<div className="h-8 bg-gray-300 rounded-lg w-48 mb-4 animate-pulse"></div>
			</div>

			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						key={`movie-skeleton-${
							// biome-ignore lint/suspicious/noArrayIndexKey: index it ok here
							index
						}`}
						className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
					>
						<div className="p-6 flex flex-col justify-between">
							<div>
								<div className="h-6 bg-gray-300 rounded mb-2"></div>
								<div className="h-16 bg-gray-200 rounded mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default MoviesLoadingSkeleton;
