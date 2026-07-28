import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "server-only" throws outside a React Server context; tests run in Node.
      "server-only": path.resolve(__dirname, "./src/test/stubs/server-only.ts"),
    },
  },
});
