"use client";

import { clientLogger } from "#/lib/client-logger";

export function LogButton() {
	return (
		<button
			className="bg-blue-500 text-white px-4 py-2 rounded-md"
			type="button"
			onClick={() => clientLogger.warn("Hello from client")}
		>
			Log
		</button>
	);
}
