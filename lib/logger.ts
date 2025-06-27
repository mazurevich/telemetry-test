import { trace } from "@opentelemetry/api";
import pino from "pino";

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Create the base logger configuration
const createLoggerConfig = () => {
	const baseConfig = {
		level: isDevelopment ? "debug" : "info",
		timestamp: pino.stdTimeFunctions.isoTime,
		formatters: {
			level: (label: string) => ({ level: label }),
			log: (object: any) => {
				// Add trace context if available
				const currentSpan = trace.getActiveSpan();
				if (currentSpan) {
					const spanContext = currentSpan.spanContext();
					return {
						...object,
						traceId: spanContext.traceId,
						spanId: spanContext.spanId,
					};
				}
				return object;
			},
		},
		transport: isDevelopment
			? {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:standard",
						ignore: "pid,hostname",
					},
				}
			: undefined,
	};

	return baseConfig;
};

// Create the main logger instance
const logger = pino(createLoggerConfig());

// Create a logger factory for creating child loggers with context
export const createLogger = (context?: Record<string, any>) => {
	if (context) {
		return logger.child(context);
	}
	return logger;
};

// Export the main logger instance
export { logger };

// Helper functions for common logging patterns
export const logError = (error: Error, context?: Record<string, any>) => {
	const errorLogger = context ? logger.child(context) : logger;
	errorLogger.error({
		err: {
			message: error.message,
			stack: error.stack,
			name: error.name,
		},
	});
};

export const logRequest = (req: any, context?: Record<string, any>) => {
	const requestLogger = context ? logger.child(context) : logger;
	requestLogger.info({
		method: req.method,
		url: req.url,
		userAgent: req.headers?.["user-agent"],
		ip: req.headers?.["x-forwarded-for"] || req.headers?.["x-real-ip"],
	});
};

export const logResponse = (
	res: any,
	duration: number,
	context?: Record<string, any>,
) => {
	const responseLogger = context ? logger.child(context) : logger;
	responseLogger.info({
		statusCode: res.statusCode,
		duration: `${duration}ms`,
	});
};
