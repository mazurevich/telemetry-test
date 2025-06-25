import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

export function register() {
	registerOTel({
		serviceName: "sw-movies",
		// traceExporter: new ConsoleSpanExporter(),
		traceExporter: new OTLPHttpJsonTraceExporter({
			url: "http://0.0.0.0:4318",
		}),
	});
}
