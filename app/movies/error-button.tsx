"use client";

export function ErrorButton() {
	return (
		<button
			className="bg-red-500 text-white px-4 py-2 rounded-md active:scale-95 transition-all duration-100 hover:bg-red-600 hover:cursor-pointer"
			type="button"
			onClick={() => {
				throw new Error("Test error");
			}}
		>
			Error
		</button>
	);
}
