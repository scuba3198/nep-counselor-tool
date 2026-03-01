import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";

// Provide a dummy key to satisfy tiny-invariant during test initialization
process.env.NEXT_PUBLIC_GEMINI_API_KEY = "test-mock-key";
process.env.NODE_ENV = "test";

import { server } from "./src/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
