// Client-side logging utility
export class ClientLogger {
	private static instance: ClientLogger;
	private queue: Array<{ level: string; message: string; meta?: any }> = [];
	private isProcessing = false;

	private constructor() {
		// Set up periodic flushing of logs
		setInterval(() => {
			this.flush();
		}, 5000); // Flush every 5 seconds

		// Flush logs before page unload
		if (typeof window !== "undefined") {
			window.addEventListener("beforeunload", () => {
				this.flush();
			});
		}
	}

	static getInstance(): ClientLogger {
		if (!ClientLogger.instance) {
			ClientLogger.instance = new ClientLogger();
		}
		return ClientLogger.instance;
	}

	private async flush() {
		if (this.isProcessing || this.queue.length === 0) return;

		this.isProcessing = true;
		const logsToSend = [...this.queue];
		this.queue = [];

		try {
			await fetch("/api/logs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					logs: logsToSend.map((log) => ({
						...log,
						timestamp: new Date().toISOString(),
						environment: "client",
					})),
				}),
			});
		} catch (error) {
			console.error("Failed to send logs to API:", error);
			// Re-queue failed logs
			this.queue.unshift(...logsToSend);
		} finally {
			this.isProcessing = false;
		}
	}

	info(message: string, meta?: any) {
		this.queue.push({ level: "info", message, meta });
		if (process.env.NODE_ENV === "development") {
			console.log(`[INFO] ${message}`, meta);
		}
	}

	warn(message: string, meta?: any) {
		this.queue.push({ level: "warn", message, meta });
		if (process.env.NODE_ENV === "development") {
			console.warn(`[WARN] ${message}`, meta);
		}
	}

	error(message: string, meta?: any) {
		this.queue.push({ level: "error", message, meta });
		if (process.env.NODE_ENV === "development") {
			console.error(`[ERROR] ${message}`, meta);
		}
	}

	debug(message: string, meta?: any) {
		if (process.env.NODE_ENV === "development") {
			this.queue.push({ level: "debug", message, meta });
			console.debug(`[DEBUG] ${message}`, meta);
		}
	}
}

// Export a singleton instance
export const clientLogger = ClientLogger.getInstance();
