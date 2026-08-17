import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const shared = {
  react: { singleton: true, requiredVersion: "18.3.1" },
  "react-dom": { singleton: true, requiredVersion: "18.3.1" },
  "react-router-dom": { singleton: true },
  zustand: { singleton: true },
  "@mantine/core": { singleton: true },
  "@mantine/hooks": { singleton: true },
  "@smartgarage/contracts": { singleton: true, requiredVersion: false },
  "@smartgarage/api-client": { singleton: true, requiredVersion: false },
  "@smartgarage/store": { singleton: true, requiredVersion: false },
  "@smartgarage/ui": { singleton: true, requiredVersion: false },
} as const;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      federation({
        name: "shell",
        remotes: {
          cliente: {
            type: "module",
            name: "cliente",
            entry: env.VITE_REMOTE_CLIENTE || "http://localhost:5001/remoteEntry.js",
          },
          taller: {
            type: "module",
            name: "taller",
            entry: env.VITE_REMOTE_TALLER || "http://localhost:5002/remoteEntry.js",
          },
        },
        shared,
      }),
    ],
    build: { target: "esnext" },
    server: { port: 5000, strictPort: true },
  };
});
