import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/models/index.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  hash: false,
  outExtensions: ({ format }) =>
    format === 'cjs' ? { js: '.cjs', dts: '.d.cts' } : { js: '.js', dts: '.d.ts' },
})
