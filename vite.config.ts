import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import { join } from "path";

export default defineConfig({
  plugins: [
    ...VitePluginNode({
      adapter: "express",
      appPath: "./src/app/index.ts",
      exportName: "app",
    }),
  ],
  resolve: {
    alias: {
      "@": join(__dirname, "src"),
    },
  },
  server: {
    port: 3005,
    host: "0.0.0.0",
    open: "/",
  },
  publicDir: false,
});
