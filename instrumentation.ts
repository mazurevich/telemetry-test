import { logs } from "@opentelemetry/api-logs";
// import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import {
	ConsoleLogRecordExporter,
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
	const otlpLogExporter = new OTLPLogExporter({
		url: "http://localhost:4318/v1/logs",
	});
	const otlpLogProcessor = new SimpleLogRecordProcessor(otlpLogExporter);

	const consoleLogExporter = new ConsoleLogRecordExporter();
	const consoleLogProcessor = new SimpleLogRecordProcessor(consoleLogExporter);

	loggerProvider.addLogRecordProcessor(otlpLogProcessor);
	// for debug purpose also add console log exporter
	loggerProvider.addLogRecordProcessor(consoleLogProcessor);
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
		logRecordProcessor: otlpLogProcessor,
		// instrumentations: [getNodeAutoInstrumentations()],
	});
}
