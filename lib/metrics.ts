import { metrics } from "@opentelemetry/api";
import { SERVICE_NAME } from "#/constants";

export const createCounterMetric = ({
	scope = SERVICE_NAME,
	name,
	description,
}: {
	scope?: string;
	name: string;
	description: string;
}) => {
	const provider = metrics.getMeterProvider();
	const meter = provider.getMeter(scope);
	const counter = meter.createCounter(name, { description });

	return counter;
};
