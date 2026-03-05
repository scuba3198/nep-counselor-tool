"use server";

import { Effect, Logger } from "effect";
import { GeminiServiceLive } from "@/lib/gemini";
import { BraveSearchServiceLive } from "@/lib/search";
import {
	BraveSearchService,
	GeminiService,
} from "@/lib/services";
import type { CountryData, LeaderboardItem } from "@/lib/types";
import { customLogger } from "@/lib/logger";

/**
 * Server Action to perform a deep AI research on a country.
 * Uses Brave Search API to fetch real-time visa intelligence.
 */
export async function performDeepAIResearch(
	countryName: string,
): Promise<CountryData> {
	const program = Effect.gen(function* () {
		const braveSearch = yield* BraveSearchService;
		const gemini = yield* GeminiService;

		// Input Validation
		if (!countryName || countryName.trim().length === 0) {
			return yield* Effect.fail(new Error("Country name is required"));
		}

		const searchContext = yield* braveSearch.search(countryName);
		return yield* gemini.analyzeCountry(countryName, searchContext);
	}).pipe(
		Effect.catchAll((error) => {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return Effect.succeed({
				id: "ERROR",
				name: countryName,
				indicator: "Not Recommended",
				why: `Intelligence Engine Error: ${errorMessage}. Check server logs for digest.`,
				isInvalid: true,
				scores: {
					visaSuccess: 0,
					financialBarrier: 0,
					jobProspects: 0,
					prPathways: 0,
				},
				livingCost: "N/A",
				currency: "N/A",
				visaDetails: {
					type: "AI Error",
					requirementHighlight: "Internal Server Fault",
					processingTime: "N/A",
				},
			} as CountryData);
		}),
		Effect.provide(GeminiServiceLive),
		Effect.provide(BraveSearchServiceLive),
		Effect.provide(Logger.replace(Logger.defaultLogger, customLogger)),
	);

	return await Effect.runPromise(program);
}

/**
 * Server Action to fetch the current Top 10 Visa Destinations.
 */
export async function getTopDestinations(): Promise<LeaderboardItem[]> {
	const runnable = GeminiService.pipe(
		Effect.flatMap((s) => s.getTopDestinations()),
		Effect.provide(GeminiServiceLive),
		Effect.provide(Logger.replace(Logger.defaultLogger, customLogger)),
		Effect.catchAll(() => Effect.succeed([])),
	);

	return await Effect.runPromise(runnable);
}
