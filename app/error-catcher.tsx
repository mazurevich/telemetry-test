"use client";

import { useEffect } from "react";

export const ErrorCatcher = () => {
	useEffect(() => {
		// Dynamic import to avoid SSR issues
		import("../lib/client-logger").then(({ clientLogger }) => {
			// window.onerror for uncaught errors
			window.onerror = (message, source, lineno, colno, error) => {
				clientLogger.error("Global error", {
					message,
					source,
					lineno,
					colno,
					error: error
						? error.stack || error.message || error.toString()
						: undefined,
				});
			};
			// window.onunhandledrejection for unhandled promise rejections
			window.onunhandledrejection = (event) => {
				clientLogger.error("Unhandled promise rejection", {
					reason: event.reason
						? event.reason.stack ||
							event.reason.message ||
							event.reason.toString()
						: undefined,
				});
			};
		});
		// Cleanup
		return () => {
			window.onerror = null;
			window.onunhandledrejection = null;
		};
	}, []);
	return null;
};
