"use server";

import invariant from "tiny-invariant";
import { z } from "zod";
import {
	analyzeCountryWithAI as geminiAnalyze,
	getTopDestinationsAI as geminiGetTop,
} from "@/lib/gemini";
import logger from "@/lib/logger";
import { searchBrave } from "@/lib/search";
import type { CountryData, LeaderboardItem } from "@/lib/types";

/**
 * Server Action to perform a deep AI research on a country.
 * Uses Brave Search API to fetch real-time visa intelligence.
 */
export async function performDeepAIResearch(
	countryName: string,
): Promise<CountryData> {
	// ADHERENCE: Agent Engineering Constitution - Input Validation at Trust Boundaries
	const schema = z.string().min(1, "Country name is required").max(100);
	const validation = schema.safeParse(countryName);

	// SECURITY: Add authentication check here if restricted to counselors.
	// if (!await isAuthenticated()) throw new Error("Unauthorized");

	if (!validation.success) {
		logger.error(
			{ errors: validation.error.format() },
			"Invalid countryName input",
		);
		// Return a generic error to the client
		throw new Error("Invalid request parameters");
	}

	const validatedCountry = validation.data;

	invariant(
		validatedCountry && validatedCountry.trim().length > 0,
		"countryName must be provided",
	);

	const searchContext = await searchBrave(validatedCountry);

	try {
		return await geminiAnalyze(countryName, searchContext);
	} catch (error) {
		console.error("SERVER_ACTION_CRASH:", error);
		// Return a safe error object instead of throwing to prevent generic 500 error in Next.js production
		return {
			id: "ERROR",
			name: countryName,
			indicator: "Not Recommended",
			why: `Intelligence Engine Error: ${error instanceof Error ? error.message : "Unknown error"}. Check server logs for digest.`,
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
		} as CountryData;
	}
}

/**
 * Server Action to fetch the current Top 10 Visa Destinations.
 */
export async function getTopDestinations(): Promise<LeaderboardItem[]> {
	return await geminiGetTop();
}
