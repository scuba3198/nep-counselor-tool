import { HttpResponse, http } from "msw";
import type { CountryData } from "@/lib/types";

export const mockCountryData: CountryData = {
	id: "JP",
	name: "Japan",
	indicator: "Medium",
	scores: {
		visaSuccess: 8,
		financialBarrier: 6,
		jobProspects: 9,
		prPathways: 7,
	},
	why: "High job demand for specific technical roles, requires N4 level language minimum.",
	livingCost: "1,200,000 JPY/year",
	currency: "JPY",
	visaDetails: {
		type: "Student Visa (Requires COE)",
		requirementHighlight: "Must show Relationship Certificate and COE.",
		processingTime: "2-3 months",
	},
	financials: {
		bankBalance: "25L NPR",
		annualIncome: "10L NPR",
	},
};

export const mockLeaderboard = [
	{
		rank: 1,
		country: "Japan",
		successRate: 85,
		indicator: "Medium" as const,
		trend: "up" as const,
	},
];

export const handlers = [
	http.post(
		"https://generativelanguage.googleapis.com/v1beta/models/:model",
		async ({ request }) => {
			const text = await request.text();

			// Basic routing based on prompt content
			if (text.includes("TOP 10")) {
				return HttpResponse.json({
					candidates: [
						{
							content: {
								parts: [
									{
										text: JSON.stringify(mockLeaderboard),
									},
								],
							},
						},
					],
				});
			}

			return HttpResponse.json({
				candidates: [
					{
						content: {
							parts: [
								{
									text: JSON.stringify(mockCountryData),
								},
							],
						},
					},
				],
			});
		},
	),
];
