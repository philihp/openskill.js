# Getting Started

## Installation

```bash
npm install --save openskill
```

`openskill` ships both ESM and CommonJS builds plus TypeScript definitions, so
it works out of the box in modern Node.js, Bun, Deno, and bundlers.

```js
// ESM
import { rating, rate, ordinal } from 'openskill'

// CommonJS
const { rating, rate, ordinal } = require('openskill')
```

## Hello, rating

Every player has a rating represented as a Gaussian distribution: `mu` is the
believed skill, `sigma` is the uncertainty.

```js
import { rating } from 'openskill'

const a1 = rating()
// { mu: 25, sigma: 8.333333333333334 }

const a2 = rating({ mu: 32.444, sigma: 5.123 })
// { mu: 32.444, sigma: 5.123 }
```

## Rating a match

Pass an array of teams (where each team is an array of ratings) to `rate`. The
first team in the array is the winner by default.

```js
import { rating, rate } from 'openskill'

const a1 = rating()
const a2 = rating()
const b1 = rating()
const b2 = rating()

// Team A beats Team B
const [[newA1, newA2], [newB1, newB2]] = rate([
  [a1, a2],
  [b1, b2],
])
```

Teams can be asymmetric — a 3v2, 1v4, or 8-way free-for-all all work the same
way.

## Comparing players

Use `ordinal` to get a single number you can sort by.

```js
import { ordinal } from 'openskill'

ordinal({ mu: 27.6, sigma: 8.07 }) // ≈ 3.39
```

By default this returns `mu - 3 * sigma`, the lower bound of a 99.7%
confidence interval — newer players ramp up as their `sigma` shrinks.

## Breaking changes in v5.0.0

Outputs now match the [Python reference](https://github.com/vivekjoshy/openskill.py)
bit-for-bit. To get there, a few defaults changed:

- Hyperparameter defaults (`sigma`, `beta`, `tau`, `epsilon`) are now
  constants instead of being derived from `mu`. If you used to pass only `mu`
  and rely on derived defaults, pass the others explicitly.
- `tau` is applied unconditionally. Pass `tau: 0` to keep the old behaviour.
- `epsilon` (the Thurstone-Mosteller draw margin) defaults to `0.1`. The
  former `0.0001` value was both the draw margin and the per-step `sigma`
  floor; the floor now lives behind `kappa` (default `0.0001`).
- The standard-normal CDF/PDF in `src/statistics.ts` are now computed via
  `erf` using Python's `NormalDist` formulas. This only affects the
  Thurstone-Mosteller models.

## Next

- [API Reference →](api.md)
- [Models →](models.md)
- [Examples by language →](examples/javascript.md)
