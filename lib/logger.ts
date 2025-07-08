import { trace } from "@opentelemetry/api";
import pino from "pino";

// Environment-based configuration
// const isDevelopment = process.env.NODE_ENV === "development";
const isDevelopment = false;

console.log("process.env", JSON.stringify(process.env, null, 2));

const telemetryTransport = pino.transport({
	target: "pino-opentelemetry-transport",
});
const prettyTransport = pino.transport({
	target: "pino-pretty",
	options: {
		colorize: true,
		translateTime: "SYS:standard",
		ignore: "pid,hostname",
	},
});
const logger = pino(
	{
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
	},
	pino.multistream([telemetryTransport, prettyTransport]),
);

// Create a logger factory for creating child loggers with context
export const createLogger = (context?: Record<string, any>) => {
	if (context) {
		return logger.child(context);
	}
	return logger;
};

// Export the main logger instance
export { logger };
