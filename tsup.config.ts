import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  splitting: false,
  dts: true,
  sourcemap: true,
  clean: true,
});
