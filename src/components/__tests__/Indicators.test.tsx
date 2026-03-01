import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IndicatorBadge, ScoreBar } from "../Indicators";

describe("IndicatorBadge", () => {
	it("renders the correct indicator text", () => {
		render(<IndicatorBadge indicator="Easy" />);
		expect(screen.getByText("Easy")).toBeInTheDocument();
	});

	it("renders Not Recommended correctly", () => {
		render(<IndicatorBadge indicator="Not Recommended" />);
		expect(screen.getByText("Not Recommended")).toBeInTheDocument();
	});
});

describe("ScoreBar", () => {
	it("renders label and score out of 10", () => {
		render(<ScoreBar label="Job Prospects" score={8} />);
		expect(screen.getByText("Job Prospects")).toBeInTheDocument();
		expect(screen.getByText("8/10")).toBeInTheDocument();
	});
});
