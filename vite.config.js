import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5174,
    open: "/admin/login",
    proxy: {
      "/api": {
        target: "https://asia-south1-onevishwam.cloudfunctions.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom", "@reduxjs/toolkit", "react-redux"],
          ui: ["sweetalert2"],
          dnd: ["@dnd-kit/react"],
        },
      },
    },
  },
});
