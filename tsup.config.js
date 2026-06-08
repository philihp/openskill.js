import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ["src/", "!src/**/__tests__/**", "!src/**/*.test.*"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  format: ["cjs","esm"]
})
