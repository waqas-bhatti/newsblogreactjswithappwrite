import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Puts all node_modules in vendor.js
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Warn if chunk size > 1000 KB (1 MB)
    sourcemap: true, // Enable source maps for easier debugging
  },
});
