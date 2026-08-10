import { describe, it, expect } from "vitest";
import { createApiClient } from "../factory";
import { MockApiClient } from "../mock-client";
import { HttpApiClient } from "../http-client";

describe("createApiClient", () => {
  it("defaults to MockApiClient when mode is unset", () => {
    expect(createApiClient()).toBeInstanceOf(MockApiClient);
  });

  it("returns HttpApiClient when VITE_API_MODE=http", () => {
    const api = createApiClient({ VITE_API_MODE: "http", VITE_API_BASE_URL: "https://api.x" });
    expect(api).toBeInstanceOf(HttpApiClient);
  });
});
