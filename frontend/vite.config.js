// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";


export default defineConfig({
  // ✅ Root deployment for Shop
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png"], // ✅ Add your logo files here
      manifest: {
        short_name: "Shop",
        name: "CodedAB Shop",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/", // ✅ Match base path
        scope: "/", // ✅ Match base path
        display: "standalone",
        theme_color: "#ff7a00", // Orange theme
        background_color: "#ffffff",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "obligingly-overvehement-paulette.ngrok-free.app",
    ],
    proxy: {
      "/shop/api": {
        target: "http://127.0.0.1:8002", // Backend API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shop\/api/, "/api"),
      },
      "/shop/uploads": {
        target: "http://127.0.0.1:8002", // File uploads
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shop\/uploads/, "/uploads"),
      },
    },
  },
});
