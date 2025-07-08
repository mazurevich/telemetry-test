import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: [
		"pino",
		"pino-pretty",
		"@elastic/ecs-pino-format",
		"elastic-apm-node",
	],
};

export default nextConfig;
