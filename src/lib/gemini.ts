import { GoogleGenerativeAI } from "@google/generative-ai";
import invariant from "tiny-invariant";
import { z } from "zod";
import logger from "./logger";
import {
	type CountryData,
	CountryDataSchema,
	calculateIndicator,
	type LeaderboardItem,
	LeaderboardItemSchema,
} from "./types";

function getGenAI() {
	const apiKey = process.env["GEMINI_API_KEY"];
	invariant(apiKey, "GEMINI_API_KEY is missing from environment");
	return new GoogleGenerativeAI(apiKey);
}

const MODEL_NAME = "gemini-2.0-flash-preview";

const NON_VIABLE_COUNTRIES = [
	"Somalia",
	"Afghanistan",
	"Yemen",
	"Syria",
	"North Korea",
	"Iraq",
	"Palestine",
	"Libya",
];

export async function analyzeCountryWithAI(
	countryName: string,
	searchContext: string,
): Promise<CountryData> {
	const genAI = getGenAI();
	const model = genAI.getGenerativeModel({
		model: MODEL_NAME,
		generationConfig: {
			responseMimeType: "application/json",
		},
	});

	const prompt = `
    You are a Formal Visa Intelligence Architect. 
    Analyze the following search context regarding visa requirements, costs, and opportunities for Nepalese students in ${countryName}.
    
    SEARCH CONTEXT:
    ${searchContext}

    SCORING MATRIX INVARIANTS (STRICT 1-10 SCALE):
    - visaSuccess: 1-10 (Weighted 40%). 
    - financialBarrier: 1-10 (Weighted 20%, 10 is easiest/cheapest).
    - jobProspects: 1-10 (Weighted 20%).
    - prPathways: 1-10 (Weighted 20%).

    CONTEXTUAL MAPPING (Strictly for Nepalese Applicants):
    - GROUP A (High-Proof): Australia, USA, Canada, UK. 
      -> These often require 2-3 years of Income Tax Returns (ITR), PAN, and property valuation.
    - GROUP B (Document-Centric): Japan, South Korea. 
      -> DO NOT mention 3 years of ITR for these. Japan REQUIRES "Relationship Certificate" (Nata Pramanit) and a "Certificate of Eligibility" (COE). Focus on these.
    - GROUP C (Financial-Security): Germany, Austria. 
      -> DO NOT mention ITR. These REQUIRE a "Blocked Account" (Sperrkonto). Focus on this.
    - GROUP D (Standard-Proof): Cyprus, Malta, Mauritius.
      -> Focus on Bank Balance/Solvency. ITR is usually NOT mandatory.

    RESEARCH GUARDRAIL:
    - Requirements MUST reflect official embassy/VFS standards specifically for applicants applying FROM NEPAL.
    - NEVER use "3 years of Income Tax Returns" as a boilerplate. Only use it for Group A.
    - For Japan: MUST mention "Relationship Certificate" and "COE".
    - For Germany: MUST mention "Blocked Account".

    OUTPUT REQUIREMENT:
    Return a JSON object matching the CountryData interface. Use standard ISO codes for ID.
    The "indicator" must be one of: "Easy", "Medium", "Difficult", "Not Recommended".
    The "why" must be an authoritative summary specifically for counselors in Nepal.

      - VALIDATION: If the requested country is FICTIONAL, MYTHOLOGICAL, or NOT A REAL sovereign state (e.g., Wakanda, Hogwarts), set "isInvalid": true and provide a polite explanation in "why".

      MANDATORY FIELDS (DO NOT OMIT):
      - id, name, indicator, scores (1-10), why, livingCost, currency
      - visaDetails (must contain type, requirementHighlight, processingTime)
      - financials (must contain bankBalance and annualIncome as strings, e.g., "60k AUD | 55L NPR". Include tax proof/PAN requirements ONLY if they fall under Group A).
  `;

	const startTime = Date.now();
	try {
		logger.info(
			{ countryName, event: "ai_analysis_start" },
			"Initiating AI Country Analysis",
		);
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		const rawParsed = JSON.parse(text);
		invariant(rawParsed, "AI response could not be parsed as JSON");

		// ZOD VALIDATION: This handles type checking and missing fields.
		const parsed = CountryDataSchema.parse(rawParsed);
		invariant(
			parsed.id && parsed.name,
			"Parsed AI response is missing essential identifying fields",
		);

		const isNonViable = NON_VIABLE_COUNTRIES.some(
			(c) =>
				parsed.name?.toLowerCase().includes(c.toLowerCase()) ||
				countryName.toLowerCase().includes(c.toLowerCase()),
		);

		const finalData = {
			...parsed,
			indicator: isNonViable
				? "Not Recommended"
				: calculateIndicator(parsed.scores),
		} as CountryData;

		const duration = Date.now() - startTime;
		logger.info(
			{
				country: finalData.name,
				successScore: finalData.scores.visaSuccess,
				event: "ai_analysis_success",
				latencyMs: duration,
			},
			"AI Analysis Successful",
		);
		return finalData;
	} catch (error) {
		logger.error({ error, countryName }, "Gemini AI Analysis Failed");
		throw new Error("Could not complete AI intelligence refresh.");
	}
}

export async function getTopDestinationsAI(): Promise<LeaderboardItem[]> {
	const genAI = getGenAI();
	const model = genAI.getGenerativeModel({
		model: MODEL_NAME,
		generationConfig: {
			responseMimeType: "application/json",
		},
	});

	const prompt = `
    You are a Global Visa Compliance Officer.
    Identify the TOP 10 countries with the HIGHEST visa success rates and BEST opportunities for Nepalese students right now.
    
    Consider:
    - Current rejection trends for Nepalese applicants.
    - Official financial requirements (Mention tax returns ONLY where mandatory for Nepal).
    - Post-study work rights.
    - Cost vs Value for a Nepalese student.

    IMPORTANT: Do NOT include countries in high-conflict or politically unstable zones (e.g. Somalia, Afghanistan, North Korea).

    Return an array of 10 items matching this interface:
    interface LeaderboardItem {
      rank: number;
      country: string;
      successRate: number; // 1-100 percentage
      indicator: "Easy" | "Medium" | "Difficult";
      trend: "up" | "down" | "stable";
    }

    Return ONLY the JSON array.
  `;

	try {
		logger.info("Refreshing AI Leaderboard");
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		const rawItems = JSON.parse(text);

		// ZOD VALIDATION: Ensure every item in the list is valid
		const validatedItems = z.array(LeaderboardItemSchema).parse(rawItems);

		const filteredItems = validatedItems.filter(
			(item) =>
				!NON_VIABLE_COUNTRIES.some((c) =>
					item.country?.toLowerCase().includes(c.toLowerCase()),
				),
		);

		logger.info(
			{ count: filteredItems.length },
			"Leaderboard Refresh Successful",
		);
		return filteredItems;
	} catch (error) {
		logger.error({ error }, "Gemini Leaderboard Generation Failed");
		return [];
	}
}
