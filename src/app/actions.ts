"use server";

import invariant from "tiny-invariant";
import { z } from "zod";
import {
	analyzeCountryWithAI as geminiAnalyze,
	getTopDestinationsAI as geminiGetTop,
} from "@/lib/gemini";
import logger from "@/lib/logger";
import type { CountryData, LeaderboardItem } from "@/lib/types";

/**
 * Server Action to perform a deep AI research on a country.
 * In a production app, this would trigger a real-time web search
 * and pass the content to Gemini.
 */
export async function performDeepAIResearch(
	countryName: string,
): Promise<CountryData> {
	// ADHERENCE: Agent Engineering Constitution - Input Validation at Trust Boundaries
	const schema = z.string().min(1, "Country name is required").max(100);
	const validation = schema.safeParse(countryName);

	if (!validation.success) {
		logger.error(
			{ errors: validation.error.format() },
			"Invalid countryName input",
		);
		throw new Error("Invalid input provided to research action");
	}

	const validatedCountry = validation.data;

	invariant(
		validatedCountry && validatedCountry.trim().length > 0,
		"countryName must be provided",
	);
	// SIMULATION: In a real system, we'd use a Search API here.
	// For now, we provide the context that we know or would have found.
	const simulatedContext = `
    Latest updates for ${countryName}:
    - New visa regulations released this month focusing on financial solvency.
    - Specific student quotas for international applicants.
    - Work rights extended to 24 hours per week.
    - Post-study work permit duration remains 2-3 years.
    - Inflation impacting living costs in major cities.
  `;

	return await geminiAnalyze(countryName, simulatedContext);
}

/**
 * Server Action to fetch the current Top 10 Visa Destinations.
 */
export async function getTopDestinations(): Promise<LeaderboardItem[]> {
	return await geminiGetTop();
}
