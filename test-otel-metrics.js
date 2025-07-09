const {
	MeterProvider,
	PeriodicExportingMetricReader,
} = require("@opentelemetry/sdk-metrics");
const {
	OTLPMetricExporter,
} = require("@opentelemetry/exporter-metrics-otlp-http");

const metricReader = new PeriodicExportingMetricReader({
	exporter: new OTLPMetricExporter({ url: "http://localhost:4318/v1/metrics" }),
	exportIntervalMillis: 1000,
});

const meterProvider = new MeterProvider({
	readers: [metricReader],
});

const meter = meterProvider.getMeter("test");
const counter = meter.createCounter("test_counter");

setInterval(() => {
	counter.add(1);
	console.log("Added 1 to test_counter");
}, 1000);
