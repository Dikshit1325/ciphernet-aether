import { defineConfig } from "vite";

// Build config specifically for bundling the extension popup into a single file
export default defineConfig({
  build: {
    outDir: "extensions/dist",
    emptyOutDir: true,
    lib: {
      entry: "extensions/src/popup-entry.ts",
      name: "popup",
      fileName: "popup",
      formats: ["iife"],
    },
    rollupOptions: {
      // ensure no externalization of firebase
    },
  },
});
