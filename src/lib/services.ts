import { Context, Effect } from "effect";
import type { CountryData, LeaderboardItem } from "./types";

// --- Errors ---

export class GeminiError extends Error {
    readonly _tag = "GeminiError";
    constructor(message: string) {
        super(message);
    }
}

export class BraveSearchError extends Error {
    readonly _tag = "BraveSearchError";
    constructor(message: string, readonly status?: number) {
        super(message);
    }
}

// --- Service Tags ---

export class GeminiService extends Context.Tag("GeminiService")<
    GeminiService,
    {
        readonly analyzeCountry: (
            countryName: string,
            searchContext: string,
        ) => Effect.Effect<CountryData, GeminiError>;
        readonly getTopDestinations: () => Effect.Effect<
            LeaderboardItem[],
            GeminiError
        >;
    }
>() { }

export class BraveSearchService extends Context.Tag("BraveSearchService")<
    BraveSearchService,
    {
        readonly search: (query: string) => Effect.Effect<string, BraveSearchError>;
    }
>() { }
