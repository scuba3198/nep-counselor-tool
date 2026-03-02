import invariant from "tiny-invariant";
import logger from "./logger";

export interface SearchResult {
    title: string;
    url: string;
    description: string;
}

/**
 * Fetches search results from Brave Search API for a given query.
 * Focuses on study visas and requirements for Nepalese students.
 */
export async function searchBrave(query: string): Promise<string> {
    const apiKey = process.env["BRAVE_SEARCH_API_KEY"];
    invariant(apiKey, "BRAVE_SEARCH_API_KEY is missing from environment");

    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.append("q", `${query} student visa requirements for Nepal`);
    url.searchParams.append("count", "5");

    try {
        logger.info({ query }, "Initiating Brave Search");
        const response = await fetch(url.toString(), {
            headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip",
                "X-Subscription-Token": apiKey,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Brave Search API error: ${response.status} - ${errorBody}`);
        }

        const data = await response.json();
        const results = (data.web?.results || []) as SearchResult[];

        if (results.length === 0) {
            return `No specific real-time results found for ${query}. Falling back to general knowledge.`;
        }

        const context = results
            .map((r, i) => `[Result ${i + 1}] Title: ${r.title}\nDescription: ${r.description}\nSource: ${r.url}`)
            .join("\n\n");

        return `Real-time search context for ${query}:\n\n${context}`;
    } catch (error) {
        logger.error({ error, query }, "Brave Search Failed");
        return `Search failed for ${query}. Fallback to internal knowledge. Error: ${error instanceof Error ? error.message : String(error)}`;
    }
}
