import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["src/", "!src/**/__tests__/**", "!src/**/*.test.*"],
  splitting: false,
  sourcemap: "inline",
  dts: false,
  clean: true,
  format: ["cjs","esm"]
})
