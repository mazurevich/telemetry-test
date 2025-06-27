import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
	LoggerProvider,
	SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";
import {
	ConsoleMetricExporter,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

export function register() {
	// Set up logging
	const loggerProvider = new LoggerProvider();
	const logExporter = new OTLPLogExporter({
		url: "http://localhost:4318/v1/logs",
	});
	loggerProvider.addLogRecordProcessor(
		new SimpleLogRecordProcessor(logExporter),
	);
	logs.setGlobalLoggerProvider(loggerProvider);

	registerOTel({
		serviceName: "sw-movies",
		// traceExporter: new ConsoleSpanExporter(),
		traceExporter: new OTLPHttpJsonTraceExporter({
			url: "http://localhost:4318/v1/traces",
		}),
		metricReader: new PeriodicExportingMetricReader({
			exporter: new ConsoleMetricExporter({}),
			exportIntervalMillis: 1000,
		}),
		// instrumentations: [getNodeAutoInstrumentations()],
	});
}
