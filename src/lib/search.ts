import { Effect, Layer, Schema } from "effect";
import { BraveSearchError, BraveSearchService } from "./services";
import { BraveSearchResponse } from "./types";

/**
 * Fetches search results from Brave Search API for a given query.
 * Focuses on study visas and requirements for Nepalese students.
 */
export function searchBrave(query: string): Effect.Effect<string, BraveSearchError> {
	return Effect.gen(function* () {
		const apiKey = process.env["BRAVE_SEARCH_API_KEY"];
		if (!apiKey) {
			return yield* Effect.dieMessage("BRAVE_SEARCH_API_KEY is missing from environment");
		}

		// 1. Fetch data with basic status checking
		const json = yield* Effect.tryPromise({
			try: async () => {
				const url = new URL("https://api.search.brave.com/res/v1/web/search");
				url.searchParams.append("q", `${query} student visa requirements for Nepal`);
				url.searchParams.append("count", "5");

				const response = await fetch(url.toString(), {
					headers: {
						Accept: "application/json",
						"Accept-Encoding": "gzip",
						"X-Subscription-Token": apiKey,
					},
				});

				if (!response.ok) {
					const errorBody = await response.text();
					throw new BraveSearchError(
						`Brave Search API error: ${response.status} - ${errorBody}`,
						response.status,
					);
				}

				return await response.json();
			},
			catch: (e) =>
				e instanceof BraveSearchError ? e : new BraveSearchError(String(e)),
		});

		// 2. RUNTIME VALIDATION: Use Effect Schema to decode the untrusted payload
		const responseData = yield* Schema.decodeUnknown(BraveSearchResponse)(json).pipe(
			Effect.mapError(
				(e) => new BraveSearchError(`Brave Search Response Schema Error: ${e.message}`),
			),
		);

		// 3. Extract results safely from the validated model
		const results = responseData.web?.results || [];

		if (results.length === 0) {
			return `No specific real-time results found for ${query}. Falling back to general knowledge.`;
		}

		const context = results
			.map(
				(r, i) =>
					`[Result ${i + 1}] Title: ${r.title}\nDescription: ${r.description}\nSource: ${r.url}`,
			)
			.join("\n\n");

		return `Real-time search context for ${query}:\n\n${context}`;
	});
}

export const BraveSearchServiceLive = Layer.succeed(BraveSearchService, {
	search: searchBrave,
});
