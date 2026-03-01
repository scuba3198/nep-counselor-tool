import { describe, expect, it } from "vitest";
import { getTopDestinations, performDeepAIResearch } from "../actions";

describe("Server Actions with MSW", () => {
	it("fetches top destinations from mock API", async () => {
		const data = await getTopDestinations();
		expect(data).toHaveLength(1);
		expect(data[0].country).toBe("Japan");
	});

	it("fetches country research from mock API", async () => {
		const data = await performDeepAIResearch("Japan");
		expect(data.name).toBe("Japan");
		expect(data.indicator).toBe("Medium");
	});
});
