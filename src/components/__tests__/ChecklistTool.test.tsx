import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChecklistItem } from "@/lib/checklists";
import ChecklistTool from "../ChecklistTool";

const mockItems: ChecklistItem[] = [
	{ id: "1", label: "Valid Passport", category: "Identity", required: true },
	{ id: "2", label: "Bank Statement", category: "Financial", required: true },
];

describe("ChecklistTool", () => {
	it("renders all checklist items", () => {
		render(<ChecklistTool items={mockItems} />);
		expect(screen.getByText("Valid Passport")).toBeInTheDocument();
		expect(screen.getByText("Bank Statement")).toBeInTheDocument();
	});

	it("updates progress when items are clicked", () => {
		render(<ChecklistTool items={mockItems} />);

		expect(screen.getByText("0% Complete")).toBeInTheDocument();

		const passportItem = screen.getByText("Valid Passport").closest("button");
		expect(passportItem).not.toBeNull();
		fireEvent.click(passportItem!);

		expect(screen.getByText("50% Complete")).toBeInTheDocument();
	});
});
