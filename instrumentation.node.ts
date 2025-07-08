import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const sdk = new NodeSDK({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: "sw-movies",
	}),
	spanProcessor: new SimpleSpanProcessor(
		new OTLPTraceExporter({
			url: "http://localhost:4318/v1/traces",
		}),
	),
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
