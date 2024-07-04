import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/'],
  splitting: false,
  sourcemap: "inline",
  dts: true,
  clean: true,
  format: ["cjs","esm"]
})
