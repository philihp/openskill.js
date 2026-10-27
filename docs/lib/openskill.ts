// The docs import the library from its source, so every graph on the site is
// computed by the same code that the package ships. Everything else in docs/
// imports from this module, so this is the one place that knows the path.
export * from '../../src'
export * from '../../src/models'
export { marginFactor } from '../../src/margin'
export { normalize } from '../../src/util'
