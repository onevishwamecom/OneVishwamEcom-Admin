import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5174,
    open: '/admin/login',
    // Proxy /api to the dummy API server (server/dummy-api.mjs, port 5002).
    proxy: {
      '/api': {
        target: 'https://asia-south1-onevishwam.cloudfunctions.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});