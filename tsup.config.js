import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: ['src/'],
  splitting: false,
  sourcemap: "inline",
  dts: true,
  clean: true,
  format: ["cjs","esm"]
})
