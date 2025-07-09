"use client";
import { useCallback } from "react";

export function LogButton() {
	const handleClick = useCallback(async () => {
		const { clientLogger } = await import("#/lib/client-logger");
		clientLogger.warn(`Hello from client: ${new Date().toISOString()}`, {
			rnd: Math.floor(Math.random() * 100),
		});
	}, []);

	return (
		<button
			className="bg-blue-500 text-white px-4 py-2 rounded-md active:scale-95 transition-all duration-100 hover:bg-blue-600 hover:cursor-pointer"
			type="button"
			onClick={handleClick}
		>
			Log
		</button>
	);
}
