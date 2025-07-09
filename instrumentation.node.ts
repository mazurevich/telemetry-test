import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { SERVICE_NAME } from "./constants";

const metricReader = new PeriodicExportingMetricReader({
	exportIntervalMillis: 1000,

	exporter: new OTLPMetricExporter({
		url: "http://localhost:4318/v1/metrics",
	}),
});

const sdk = new NodeSDK({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: SERVICE_NAME,
	}),
	spanProcessor: new SimpleSpanProcessor(
		new OTLPTraceExporter({
			url: "http://localhost:4318/v1/traces",
		}),
	),
	metricReader,
	instrumentations: [
		new PinoInstrumentation({
			disableLogSending: true,
		}),
		new UndiciInstrumentation({}),
	],
});

process.on("SIGTERM", () =>
	sdk
		.shutdown()
		.then(
			() => console.log("OTEL SDK shut down successfully"),
			(err) => console.log("Error shutting down OTEL SDK", err),
		)
		.finally(() => process.exit(0)),
);

sdk.start();
