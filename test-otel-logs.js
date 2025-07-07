const { logs } = require("@opentelemetry/api-logs");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-http");
const {
	LoggerProvider,
	SimpleLogRecordProcessor,
} = require("@opentelemetry/sdk-logs");

// Set up logging
const loggerProvider = new LoggerProvider();
const otlpLogExporter = new OTLPLogExporter({
	url: "http://localhost:4318/v1/logs",
});
const otlpLogProcessor = new SimpleLogRecordProcessor(otlpLogExporter);

loggerProvider.addLogRecordProcessor(otlpLogProcessor);
logs.setGlobalLoggerProvider(loggerProvider);

// Create a logger
const logger = logs.getLogger("test-logger");

// Send a test log
logger.emit({
	severityNumber: 9, // INFO
	severityText: "INFO",
	body: "Test log from OpenTelemetry to Elasticsearch",
	attributes: {
		"service.name": "test-service",
		"test.attribute": "test-value",
	},
});

console.log("Log sent to OpenTelemetry collector");

// Wait for the log to be sent
setTimeout(() => {
	console.log("Done");
	process.exit(0);
}, 2000);
