import { GoogleGenerativeAI } from "@google/generative-ai";
import { Effect, Schema, Layer } from "effect";
import { CountryData, LeaderboardItem, calculateIndicator } from "./types";
import { GeminiError, GeminiService } from "./services";

const MODEL_NAME = "gemini-3-flash-preview";

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

const ANALYZE_PROMPT = (countryName: string, searchContext: string) => `
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
    Return EXACTLY ONE JSON object matching the CountryData interface. DO NOT return an array. Use standard ISO codes for ID.
    The "indicator" must be one of: "Easy", "Medium", "Difficult", "Not Recommended".
    The "why" must be an authoritative summary specifically for counselors in Nepal.

      - VALIDATION: If the requested country is FICTIONAL, MYTHOLOGICAL, or NOT A REAL sovereign state (e.g., Wakanda, Hogwarts), set "isInvalid": true and provide a polite explanation in "why".

      MANDATORY FIELDS (DO NOT OMIT):
      - id, name, indicator, scores (1-10), why, livingCost, currency
      - visaDetails (must contain type, requirementHighlight, processingTime)
      - financials (must contain bankBalance and annualIncome as strings, e.g., "60k AUD | 55L NPR". Include tax proof/PAN requirements ONLY if they fall under Group A).
`;

const LEADERBOARD_PROMPT = `
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

export const GeminiServiceLive = Layer.effect(
	GeminiService,
	Effect.gen(function* () {
		const apiKey = process.env["GEMINI_API_KEY"];
		console.log(`DEBUG: GeminiServiceLive init. API Key present: ${!!apiKey}`);
		if (!apiKey) {
			return yield* Effect.dieMessage(
				"GEMINI_API_KEY is missing from environment",
			);
		}
		const genAI = new GoogleGenerativeAI(apiKey);
		const model = genAI.getGenerativeModel({
			model: MODEL_NAME,
			generationConfig: { responseMimeType: "application/json" },
		});

		return {
			analyzeCountry: (countryName, searchContext) =>
				Effect.gen(function* () {
					yield* Effect.logInfo(`Initiating AI Country Analysis for ${countryName}`);
					const result: any = yield* Effect.tryPromise({
						try: () => model.generateContent(ANALYZE_PROMPT(countryName, searchContext)),
						catch: (e) => new GeminiError(String(e)),
					});
					const response = result.response;
					const text = response.text();

					const rawParsed = yield* Effect.try({
						try: () => JSON.parse(text),
						catch: (e) => new GeminiError(`AI response could not be parsed as JSON: ${e}`),
					});

					const dataToParse = Array.isArray(rawParsed) ? rawParsed[0] : rawParsed;

					// Effect Schema validation
					const parsed = yield* Schema.decodeUnknown(CountryData)(dataToParse).pipe(
						Effect.mapError((e) => new GeminiError(`Validation failed: ${e}`)),
					);

					const isNonViable = NON_VIABLE_COUNTRIES.some(
						(c) =>
							parsed.name?.toLowerCase().includes(c.toLowerCase()) ||
							countryName.toLowerCase().includes(c.toLowerCase()),
					);

					const finalData: CountryData = {
						...parsed,
						indicator: isNonViable
							? "Not Recommended"
							: calculateIndicator(parsed.scores),
					};

					yield* Effect.logInfo(`AI Analysis Successful for ${finalData.name}`);
					return finalData;
				}),

			getTopDestinations: () =>
				Effect.gen(function* () {
					yield* Effect.logInfo("Refreshing AI Leaderboard");
					const result: any = yield* Effect.tryPromise({
						try: () => model.generateContent(LEADERBOARD_PROMPT),
						catch: (e) => new GeminiError(String(e)),
					});
					const response = result.response;
					const text = response.text();

					const rawItems = yield* Effect.try({
						try: () => JSON.parse(text),
						catch: (e) => new GeminiError(`AI response could not be parsed as JSON: ${e}`),
					});

					const validatedItems = yield* Schema.decodeUnknown(Schema.Array(LeaderboardItem))(rawItems).pipe(
						Effect.mapError((e) => new GeminiError(`Validation failed: ${e}`)),
					);

					const filteredItems = validatedItems.filter(
						(item) =>
							!NON_VIABLE_COUNTRIES.some((c) =>
								item.country?.toLowerCase().includes(c.toLowerCase()),
							),
					);

					yield* Effect.logInfo("Leaderboard Refresh Successful");
					return filteredItems;
				}),
		};
	}),
);
