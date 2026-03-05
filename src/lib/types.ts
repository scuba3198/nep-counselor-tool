import { Schema } from "effect";

export const EaseIndicator = Schema.Literal(
	"Easy",
	"Medium",
	"Difficult",
	"Not Recommended",
);
export type EaseIndicator = Schema.Schema.Type<typeof EaseIndicator>;

const ScoreVector = Schema.Struct({
	visaSuccess: Schema.Number.pipe(Schema.between(1, 10)),
	financialBarrier: Schema.Number.pipe(Schema.between(1, 10)),
	jobProspects: Schema.Number.pipe(Schema.between(1, 10)),
	prPathways: Schema.Number.pipe(Schema.between(1, 10)),
});
type ScoreVector = Schema.Schema.Type<typeof ScoreVector>;

export const CountryData = Schema.Struct({
	id: Schema.String,
	name: Schema.String,
	indicator: EaseIndicator,
	scores: ScoreVector,
	why: Schema.String,
	visaDetails: Schema.Struct({
		type: Schema.String,
		requirementHighlight: Schema.String,
		processingTime: Schema.String,
	}),
	livingCost: Schema.String,
	currency: Schema.String,
	financials: Schema.optional(
		Schema.Struct({
			bankBalance: Schema.String,
			annualIncome: Schema.String,
		}),
	),
	isInvalid: Schema.optional(Schema.Boolean),
});
export type CountryData = Schema.Schema.Type<typeof CountryData>;

export const LeaderboardItem = Schema.Struct({
	rank: Schema.Number,
	country: Schema.String,
	successRate: Schema.Number,
	indicator: Schema.Literal("Easy", "Medium", "Difficult"),
	trend: Schema.Literal("up", "down", "stable"),
});
export type LeaderboardItem = Schema.Schema.Type<typeof LeaderboardItem>;

export const calculateIndicator = (scores: ScoreVector): EaseIndicator => {
	const average =
		scores.visaSuccess * 0.4 +
		scores.financialBarrier * 0.2 +
		scores.jobProspects * 0.2 +
		scores.prPathways * 0.2;

	if (average >= 8) return "Easy";
	if (average >= 5) return "Medium";
	if (average >= 3) return "Difficult";
	return "Not Recommended";
};
export const SearchResult = Schema.Struct({
	title: Schema.String,
	url: Schema.String,
	description: Schema.String,
});
export type SearchResult = Schema.Schema.Type<typeof SearchResult>;

export const BraveSearchResponse = Schema.Struct({
	web: Schema.optional(
		Schema.Struct({
			results: Schema.optional(Schema.Array(SearchResult)),
		}),
	),
});
export type BraveSearchResponse = Schema.Schema.Type<typeof BraveSearchResponse>;
