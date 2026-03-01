export interface ChecklistItem {
	id: string;
	label: string;
	category: "Academic" | "Financial" | "Personal" | "Language";
	mandatory: boolean;
}

/**
 * Specific country checklists are now dynamically augmented by AI.
 * We maintain only the global base checklist for Nepalese students.
 */
export const COUNTRY_CHECKLISTS: Record<string, ChecklistItem[]> = {};

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
	{
		id: "gl-1",
		label: "Passport (Valid for 6+ months)",
		category: "Personal",
		mandatory: true,
	},
	{
		id: "gl-2",
		label: "SLC/SEE, +2, and Bachelor Transcripts",
		category: "Academic",
		mandatory: true,
	},
	{
		id: "gl-3",
		label: "IELTS 6.0 / PTE 50+ Overall",
		category: "Language",
		mandatory: true,
	},
	{
		id: "gl-4",
		label: "Bank Balance (Varies: usually 1 yr Tuition + Living)",
		category: "Financial",
		mandatory: true,
	},
	{
		id: "gl-5",
		label: "Annual Income Proof (Varies by Destination)",
		category: "Financial",
		mandatory: true,
	},
];
