import { ecsFormat } from "@elastic/ecs-pino-format";
import fs from "fs";
import path from "path";
import pino, { multistream } from "pino";

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === "development";

// Ensure log directory exists
const logDir = path.resolve(process.cwd(), "log");
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

// File destination for logs
const fileDestination = pino.destination(path.join(logDir, "app.log"));

const transport = pino.transport({
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
		},
	},
	multistream([
		transport,
		{
			stream: fileDestination,
			formatter: ecsFormat({
				serviceName: "sw-movies",
				serviceEnvironment: isDevelopment ? "development" : "production",
				serviceVersion: "1.0.0",
			}),
		},
	]),
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
