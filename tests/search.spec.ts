import { expect, test } from "@playwright/test";

test("user can search for a country and view results", async ({ page }) => {
	await page.goto("/");

	// Wait for the app to load
	await expect(page.getByText("Visa Success Leaderboard")).toBeVisible();

	// Find the search input and fill it
	const searchInput = page.getByPlaceholder(/Search any country/i);
	await searchInput.fill("Japan");

	// Submit the search
	await page.getByRole("button", { name: /AI Research/i }).click();

	// Verify the true API result renders correctly on the screen
	// Gemini requests can take up to 10-15 seconds.
	await expect(page.getByRole("heading", { name: "Japan" })).toBeVisible({
		timeout: 20000,
	});

	// Japan explicitly requires COE based on our AI guardrails.
	await expect(page.getByText(/COE/i).first()).toBeVisible();
});
