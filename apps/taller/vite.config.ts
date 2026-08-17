import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
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

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "taller",
      filename: "remoteEntry.js",
      exposes: { "./App": "./src/App.tsx" },
      shared,
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "SmartGarage Taller",
        short_name: "SG Taller",
        description: "Gestión de taller: agenda, órdenes y clientes.",
        theme_color: "#F59E0B",
        background_color: "#0F172A",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" },
        ],
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,woff2}"] },
    }),
  ],
  build: { target: "esnext" },
});
