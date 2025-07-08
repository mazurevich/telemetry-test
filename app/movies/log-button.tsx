"use client";

import { clientLogger } from "#/lib/client-logger";
import { useRef } from "react";

export function LogButton() {
	const countRef = useRef(0);
	return (
		<button
			className="bg-blue-500 text-white px-4 py-2 rounded-md active:scale-95 transition-all duration-100 hover:bg-blue-600 hover:cursor-pointer"
			type="button"
			onClick={() =>
				clientLogger.warn(`@Hello from client: ${new Date().toISOString()} ${countRef.current++}`, {
					rnd: Math.floor(Math.random() * 100),
				})
			}
		>
			Log
		</button>
	);
}
