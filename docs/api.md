# API Reference

```js
import {
  rating,
  rate,
  ordinal,
  predictWin,
  predictDraw,
  predictRank,
} from 'openskill'
```

## `rating(options?)`

Create a new rating.

```ts
rating(options?: { mu?: number; sigma?: number }): Rating
```

```js
rating()                          // { mu: 25, sigma: 8.333... }
rating({ mu: 1500, sigma: 200 })  // { mu: 1500, sigma: 200 }
```

## `rate(teams, options?)`

Update ratings after a match. `teams` is an array of arrays — each inner
array is one team. By default the team listed first won; use `rank` or
`score` for arbitrary orderings.

```ts
rate(
  teams: Rating[][],
  options?: {
    model?: typeof plackettLuce
      | typeof bradleyTerryFull
      | typeof bradleyTerryPart
      | typeof thurstoneMostellerFull
      | typeof thurstoneMostellerPart
    rank?: number[]
    score?: number[]
    tau?: number
    preventSigmaIncrease?: boolean
    mu?: number
    sigma?: number
    beta?: number
    epsilon?: number
    kappa?: number
  }
): Rating[][]
```

### Default usage — first team wins

```js
const [[a1n, a2n], [b1n, b2n]] = rate([
  [a1, a2],
  [b1, b2],
])
```

### With ranks

Lower rank = better placement. Equal ranks are ties.

```js
rate([[a1], [b1], [c1], [d1]], { rank: [4, 1, 3, 2] })
// → 🐌 🥇 🥉 🥈
```

### With scores

Higher score = better. Equal scores are ties.

```js
rate([[a1], [b1], [c1], [d1]], { score: [37, 19, 37, 42] })
// → 🥈 🐌 🥈 🥇
```

## `ordinal(rating, options?)`

Reduce a rating to a single number for display or sorting.

```ts
ordinal(r: Rating, options?: { z?: number; alpha?: number; target?: number }): number
```

```js
ordinal({ mu: 25, sigma: 8.333 }) // ≈ 0.0
```

## `predictWin(teams)`

Returns an array of probabilities, one per team, that sums to 1.

```js
predictWin([[a1], [b1]])
// [0.4511..., 0.5489...]
```

## `predictDraw(teams)`

Returns the relative likelihood that a match between these teams ends in a
draw. Useful for matchmaking quality scores.

```js
predictDraw([[a1], [b1]])
// 0.0902...
```

## `predictRank(teams)`

Returns the predicted finishing order with associated probabilities.

```js
predictRank([[a1], [b1], [c1]])
```

## Selecting a model

```js
import { rate } from 'openskill'
import { bradleyTerryFull } from 'openskill/models'

rate(teams, { model: bradleyTerryFull })
```

See [Models](models.md) for guidance on choosing one.
