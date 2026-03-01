import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
	level: process.env["LOG_LEVEL"] || "info",
	base: { env: process.env["NODE_ENV"] || "development" },
	...(isProduction
		? {}
		: {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
					},
				},
			}),
});

/**
 * Creates a child logger with a specific request ID or context.
 */
export function createRequestContext(requestId: string) {
	return logger.child({ requestId });
}

export default logger;
