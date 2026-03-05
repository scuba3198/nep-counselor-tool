import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";

// Provide dummy keys for Effect services initialization in tests
process.env["GEMINI_API_KEY"] = "test-mock-key";
process.env["BRAVE_SEARCH_API_KEY"] = "test-mock-key";

import { server } from "./src/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
