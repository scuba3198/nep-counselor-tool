declare namespace NodeJS {
	interface ProcessEnv {
		GEMINI_API_KEY: string;
		LOG_LEVEL?: "info" | "debug" | "warn" | "error" | "fatal" | "silent";
		NODE_ENV: "development" | "production" | "test";
	}
}
