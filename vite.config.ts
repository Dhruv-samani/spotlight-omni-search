import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "Spotlight",
      fileName: (format) => `index.${format === "es" ? "mjs" : "umd.js"}`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "lucide-react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "lucide-react": "LucideReact",
        },
      },
    },
    minify: 'esbuild',
  },
  // Dev specific config
  ...(command === "serve"
    ? {
        root: "dev",
        server: {
          port: 3000,
          open: true,
        },
      }
    : {}),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    css: true,
  },
}));
