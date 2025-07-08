import { type NextRequest, NextResponse } from "next/server";
import { createLogger } from "#/lib/logger";

export async function POST(request: NextRequest) {
	const startTime = Date.now();
	const requestId = crypto.randomUUID();

	// Create a child logger with request context
	const requestLogger = createLogger({
		requestId,
		endpoint: "/api/logs",
	});

	try {
		const body = await request.json();

		// Get client IP from headers
		const clientIp =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("x-real-ip") ||
			"unknown";

		// Handle batch logs
		if (body.logs && Array.isArray(body.logs)) {
			for (const logEntry of body.logs) {
				const { level, message, timestamp, meta, traceId, spanId } = logEntry;

				if (!level || !message) continue;

				const logContext = {
					...meta,
					clientTimestamp: timestamp,
					environment: body.environment || "client",
					userAgent: body.userAgent || request.headers.get("user-agent"),
					ip: clientIp,
					traceId,
					spanId,
				};

				switch (level) {
					case "error":
						requestLogger.error(`[CLIENT] ${message}`, logContext);
						break;
					case "warn":
						requestLogger.warn(`[CLIENT] ${message}`, logContext);
						break;
					case "debug":
						requestLogger.debug(`[CLIENT] ${message}`, logContext);
						break;
					default:
						requestLogger.info(`[CLIENT] ${message}`, logContext);
				}
			}
		} else {
			// Handle single log (backward compatibility)
			const { level, message, timestamp, meta, environment } = body;

			// Validate required fields
			if (!level || !message) {
				return NextResponse.json(
					{ error: "Missing required fields: level and message" },
					{ status: 400 },
				);
			}

			const logContext = {
				...meta,
				clientTimestamp: timestamp,
				environment: environment || "client",
				userAgent: request.headers.get("user-agent"),
				ip: clientIp,
			};

			switch (level) {
				case "error":
					requestLogger.error(`[CLIENT] ${message}`, logContext);
					break;
				case "warn":
					requestLogger.warn(`[CLIENT] ${message}`, logContext);
					break;
				case "debug":
					requestLogger.debug(`[CLIENT] ${message}`, logContext);
					break;
				default:
					requestLogger.info(`[CLIENT] ${message}`, logContext);
			}
		}

		const duration = Date.now() - startTime;
		requestLogger.info({
			message: "Client logs processed successfully",
			duration: `${duration}ms`,
			logCount: body.logs?.length || 1,
		});

		return NextResponse.json({
			success: true,
			requestId,
			processed: body.logs?.length || 1,
		});
	} catch (error) {
		const duration = Date.now() - startTime;
		requestLogger.error({
			msg: "Error processing client logs",
			error: error instanceof Error ? error.message : String(error),
			duration: `${duration}ms`,
		});

		return NextResponse.json(
			{ error: "Internal server error", requestId },
			{ status: 500 },
		);
	}
}
