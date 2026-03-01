export interface PolicyUpdate {
	id: string;
	countryId: string;
	countryName: string;
	title: string;
	date: string;
	impact: "High" | "Medium" | "Low";
	summary: string;
	link: string;
}

export const MOCK_UPDATES: PolicyUpdate[] = [
	{
		id: "upd-1",
		countryId: "AU",
		countryName: "Australia",
		title: "Genuine Student (GS) Requirement Live",
		date: "2024-03-23",
		impact: "High",
		summary:
			"The GTE has been officially replaced by the GS requirement. Applicants must now answer targeted questions instead of a 300-word statement.",
		link: "https://homeaffairs.gov.au",
	},
	{
		id: "upd-2",
		countryId: "GB",
		countryName: "UK",
		title: "Dependent Visa Restrictions",
		date: "2024-01-01",
		impact: "High",
		summary:
			"Most international students can no longer bring dependents unless they are on a postgraduate research program.",
		link: "https://gov.uk",
	},
	{
		id: "upd-3",
		countryId: "CA",
		countryName: "Canada",
		title: "Provincial Attestation Letter (PAL) Required",
		date: "2024-01-22",
		impact: "High",
		summary:
			"Most study permit applications now require a PAL from the province or territory before submission.",
		link: "https://canada.ca",
	},
];
