import { NextResponse } from "next/server";
import { logDebug, logError, logInfo, logWarn } from "#/lib/logger";

export async function GET() {
	// Test different log levels
	logDebug("This is a debug message", {
		test: "debug",
		timestamp: new Date().toISOString(),
	});
	logInfo("This is an info message", {
		test: "info",
		timestamp: new Date().toISOString(),
	});
	logWarn("This is a warning message", {
		test: "warn",
		timestamp: new Date().toISOString(),
	});

	// Test error logging
	try {
		throw new Error("This is a test error");
	} catch (error) {
		logError("This is an error message", error as Error, {
			test: "error",
			timestamp: new Date().toISOString(),
		});
	}

	return NextResponse.json({
		message: "Test logs sent to OTLP collector",
		timestamp: new Date().toISOString(),
	});
}
