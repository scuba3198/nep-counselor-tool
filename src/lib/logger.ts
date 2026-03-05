import { Logger as EffectLogger } from "effect";

// ATOMIC ISOLATION: Replacing Pino with standard console to eliminate module-load failure risks in Next.js 16/Vercel.
function sanitize(obj: any) {
	if (!obj || typeof obj !== "object") return obj;
	const sanitized = { ...obj };
	const sensitiveKeys = [
		"apiKey",
		"key",
		"password",
		"token",
		"secret",
		"GEMINI_API_KEY",
		"BRAVE_SEARCH_API_KEY",
	];
	for (const key of sensitiveKeys) {
		if (key in sanitized) sanitized[key] = "[REDACTED]";
	}
	return sanitized;
}

// Custom Effect Logger that sanitizes and stringifies
export const customLogger = EffectLogger.make<any, void>((options) => {
	const { logLevel, message, annotations } = options;
	const level = logLevel.label.toLowerCase();
	const msg = Array.isArray(message) ? message.join(" ") : String(message);
	const output = {
		level,
		msg,
		...sanitize(annotations),
	};

	if (level === "error") {
		console.error(JSON.stringify(output));
	} else if (level === "warn") {
		console.warn(JSON.stringify(output));
	} else {
		console.log(JSON.stringify(output));
	}
});

// Legacy support for non-effect code
const legacyLogger = {
	info: (obj: any, msg?: string) =>
		console.log(JSON.stringify({ level: "info", ...sanitize(obj), msg })),
	error: (obj: any, msg?: string) =>
		console.error(JSON.stringify({ level: "error", ...sanitize(obj), msg })),
	debug: (obj: any, msg?: string) =>
		console.log(JSON.stringify({ level: "debug", ...sanitize(obj), msg })),
	warn: (obj: any, msg?: string) =>
		console.warn(JSON.stringify({ level: "warn", ...sanitize(obj), msg })),
};

export function createRequestContext(requestId: string) {
	return { ...legacyLogger, requestId };
}

export default legacyLogger;
