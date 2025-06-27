import { logs } from "@opentelemetry/api-logs";

const logger = logs.getLogger("sw-movies");

export function logInfo(message: string, attributes?: Record<string, any>) {
	logger.emit({
		severityText: "INFO",
		body: message,
		attributes,
	});
}

export function logError(
	message: string,
	error?: Error,
	attributes?: Record<string, any>,
) {
	logger.emit({
		severityText: "ERROR",
		body: message,
		attributes: {
			...attributes,
			...(error && {
				"error.message": error.message,
				"error.stack": error.stack,
				"error.name": error.name,
			}),
		},
	});
}

export function logWarn(message: string, attributes?: Record<string, any>) {
	logger.emit({
		severityText: "WARN",
		body: message,
		attributes,
	});
}

export function logDebug(message: string, attributes?: Record<string, any>) {
	logger.emit({
		severityText: "DEBUG",
		body: message,
		attributes,
	});
}
