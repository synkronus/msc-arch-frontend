import { seed } from "@smartgarage/contracts";
import type { ApiClient } from "./api-client";
import { MockApiClient } from "./mock-client";
import { HttpApiClient } from "./http-client";

export function createApiClient(env: ImportMetaEnv | undefined = import.meta.env): ApiClient {
  const mode = env?.VITE_API_MODE ?? "mock";
  const baseUrl = env?.VITE_API_BASE_URL ?? "";
  return mode === "http" ? new HttpApiClient(baseUrl) : new MockApiClient(seed);
}

export const api: ApiClient = createApiClient();
