import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "SmartGarage Cliente",
        short_name: "SG Cliente",
        description: "Cotiza y haz seguimiento de tu vehículo.",
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
});
