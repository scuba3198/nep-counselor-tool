import { z } from "zod";

export const EaseIndicatorSchema = z.enum([
	"Easy",
	"Medium",
	"Difficult",
	"Not Recommended",
]);
export type EaseIndicator = z.infer<typeof EaseIndicatorSchema>;

const ScoreVectorSchema = z.object({
	visaSuccess: z.number().min(1).max(10),
	financialBarrier: z.number().min(1).max(10),
	jobProspects: z.number().min(1).max(10),
	prPathways: z.number().min(1).max(10),
});
type ScoreVector = z.infer<typeof ScoreVectorSchema>;

export const CountryDataSchema = z.object({
	id: z.string(),
	name: z.string(),
	indicator: EaseIndicatorSchema,
	scores: ScoreVectorSchema,
	why: z.string(),
	visaDetails: z.object({
		type: z.string(),
		requirementHighlight: z.string(),
		processingTime: z.string(),
	}),
	livingCost: z.string(),
	currency: z.string(),
	financials: z
		.object({
			bankBalance: z.string(),
			annualIncome: z.string(),
		})
		.optional(),
	isInvalid: z.boolean().optional(),
});
export type CountryData = z.infer<typeof CountryDataSchema>;

export const LeaderboardItemSchema = z.object({
	rank: z.number(),
	country: z.string(),
	successRate: z.number(),
	indicator: z.enum(["Easy", "Medium", "Difficult"]),
	trend: z.enum(["up", "down", "stable"]),
});
export type LeaderboardItem = z.infer<typeof LeaderboardItemSchema>;

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
