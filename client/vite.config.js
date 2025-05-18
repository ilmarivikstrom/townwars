import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "game-logic": path.resolve(__dirname, "../shared/src"),
    },
  },
  server: {
    port: 5173,
    watch: {
      usePolling: true,
      disableGlobbing: false,
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
  },
  build: {
    outDir: "../dist",
  },
});
