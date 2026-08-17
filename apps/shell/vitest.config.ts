import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const dir = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@smartgarage/contracts": dir("../../packages/contracts/src/index.ts"),
      "@smartgarage/api-client": dir("../../packages/api-client/src/index.ts"),
      "@smartgarage/store": dir("../../packages/store/src/index.ts"),
      "@smartgarage/ui": dir("../../packages/ui/src/index.ts"),
      "cliente/App": dir("./src/__stubs__/RemoteStub.tsx"),
      "taller/App": dir("./src/__stubs__/RemoteStub.tsx"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.test.tsx", "src/**/*.test.ts"],
  },
});
