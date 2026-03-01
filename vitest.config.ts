import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		globals: true,
		coverage: {
			reporter: ["text", "json", "html", "lcov"],
			exclude: ["node_modules/", "src/mocks/"],
		},
		exclude: ["**/node_modules/**", "**/dist/**", "**/tests/**"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
