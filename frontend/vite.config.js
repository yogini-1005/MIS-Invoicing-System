import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react()],
  base: '/MIS-Invoicing-System/',
  root: path.resolve(__dirname, "."), // Points to frontend folder
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: path.resolve(__dirname, "../dist"), // Output to parent's dist folder
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html") // Looks in frontend folder
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src") // Points to frontend/src
    },
  },
});