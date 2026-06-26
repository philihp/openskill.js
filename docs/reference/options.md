# Options

Every function in openskill.js — `rating`, `rate`, `ordinal`, and the `predict*`
family — accepts an optional `options` object. The same `Options` type is shared
across all of them; each function only reads the fields relevant to it.

```ts
import { rate } from 'openskill'

rate(teams, {
  model: plackettLuce,
  beta: 25 / 6,
  tau: 25 / 300,
  limitSigma: true,
})
```

## Rating parameters

These shape the underlying skill model. The defaults below match openskill.py.

| Option   | Type     | Default    | Description                                                                                                                                                            |
| -------- | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mu`     | `number` | `25`       | The mean of a fresh rating — the assumed skill of a brand-new player.                                                                                                 |
| `sigma`  | `number` | `25/3` ≈ 8.33 | The standard deviation of a fresh rating — how uncertain we are about a new player. Larger means ratings move faster early on.                                     |
| `beta`   | `number` | `25/6` ≈ 4.17 | The assumed variability of *performance* around true skill within a single game. Larger `beta` means a single result tells us less, so updates are smaller.        |
| `tau`    | `number` | `25/300` ≈ 0.083 | Additive dynamics factor. Before each `rate()`, `sigma` is bumped via `sqrt(sigma² + tau²)` so it never gets permanently "stuck" low. Set `tau: 0` to disable. |
| `kappa`  | `number` | `0.0001`   | A floor that keeps `sigma` from collapsing toward zero during an update. Rarely needs changing.                                                                       |
| `gamma`  | `Gamma`  | see below  | Controls how much each team's `sigma` shrinks per update. [Details below.](#gamma)                                                                                    |

::: warning Changed in v5.0.0
In v5, `sigma`, `beta`, and `tau` default to **fixed** values (`25/3`, `25/6`,
`25/300`) instead of being derived from `mu`. If you use a custom `mu` and want
the old behavior, pass derived values explicitly — e.g. `sigma: mu / 3`,
`beta: mu / 6`, `tau: mu / 300`. See the
[changelog](https://github.com/philihp/openskill.js/blob/main/CHANGELOG.md).
:::

## Match parameters

Used by `rate()` to interpret a single match. See
[Recording Matches](/guide/rating-matches) for examples.

| Option       | Type         | Default              | Description                                                                                                                |
| ------------ | ------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `model`      | `Model`      | `plackettLuce`       | Which [rating model](/guide/models) to use. Import from `openskill/models`.                                               |
| `rank`       | `number[]`   | teams' given order   | Finishing position per team; **lower is better**. Equal ranks are ties.                                                  |
| `score`      | `number[]`   | —                    | Raw score per team; **higher is better**. Equal scores are ties. Converted internally to ranks.                          |
| `margin`     | `number`     | —                    | Used with `score`: wins by more than this margin amplify the rating change. Closer games behave like ordinary results.   |
| `weight`     | `number[][]` | —                    | Per-player weights for [partial play](#weights-partial-play), matching the shape of `teams`. A player's rating update scales with their weight.   |
| `weightBounds` | `[number, number] \| null` | `[1, 2]` | Range each team's `weight` values are normalized into before use. Pass `null` to apply raw weights without normalization. [See below.](#weights-partial-play) |
| `limitSigma` | `boolean`    | `false`              | When `true`, prevents `sigma` from increasing. Combined with `tau`, this stops a player's ordinal dropping after a win.  |
| `balance`    | `boolean`    | `false`              | Enables a balance adjustment between teams of differing strength.                                                         |

## Ordinal parameters {#ordinal-options}

Used by `ordinal()` (and `predictRank` via the same machinery) to turn a rating
into a single sortable number: `target + alpha * (mu - z * sigma)`.

| Option   | Type     | Default | Description                                                                                              |
| -------- | -------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `z`      | `number` | `3`     | How many standard deviations below `mu` to report. `3` ⇒ ~99.7% confidence the true skill is higher.    |
| `alpha`  | `number` | `1`     | Multiplier applied to the whole metric. Use it to rescale onto a friendlier display range.              |
| `target` | `number` | `0`     | A constant added to shift the baseline (e.g. so the lowest ratings land near a chosen floor).           |

## Model-specific parameters

| Option    | Type     | Default | Used by                       | Description                                                            |
| --------- | -------- | ------- | ----------------------------- | --------------------------------------------------------------------- |
| `epsilon` | `number` | `0.1`   | Thurstone-Mosteller models    | The draw margin used when comparing gaussian performances.            |

## `gamma`

`gamma` is a function that controls how much a team's `sigma` shrinks on each
update. Lowering it makes ratings more stable (slower to change uncertainty);
raising it makes them more reactive.

```ts
type Gamma = (
  c: number, // the normalizing constant for this match
  k: number, // the number of teams in the match
  mu: number, // this team's combined mu
  sigmaSq: number, // this team's combined sigma squared
  team: Rating[], // the team's player ratings
  qRank: number // this team's rank
) => number
```

The default implementation is:

```ts
const defaultGamma: Gamma = (c, _k, _mu, sigmaSq) => Math.sqrt(sigmaSq) / c
```

A common reason to override it is to slow down `sigma` changes in
Thurstone-Mosteller models, or to make a particular game feel more or less
volatile. See [Custom Models](/guide/custom-models#customizing-gamma-instead)
for a worked example.

## Weights (partial play) {#weights-partial-play}

`weight` lets a player absorb more or less of a match's rating change than their
teammates — useful when players contribute unevenly, for example someone who
subbed in late or sat out part of a rotation. It is a nested array shaped exactly
like `teams`: one number per player.

```ts
rate(
  [
    [alice, bob],
    [carol, dave],
  ],
  {
    weight: [
      [1.0, 0.5], // bob only played half the match
      [1.0, 1.0],
    ],
  }
)
```

A higher weight makes a player's `mu` and `sigma` move more on a win and (because
the update is damped, not reversed) cushions them on a loss; a lower weight does
the opposite. A weight of `1` everywhere is a no-op.

### Normalization

By default each team's weights are **normalized** into `weightBounds` (`[1, 2]`)
before they are applied, matching openskill.py. The team's smallest weight maps to
`1` and its largest to `2`, so only the _relative_ differences **within** a team
matter — the absolute scale, and any difference _between_ teams, is discarded.

One consequence is that **uniform** within-team weights cancel out entirely: if
every player on a team shares the same weight, normalization collapses them all to
`1` and the result is identical to passing no weights.

To apply weights as-is — no normalization, absolute scale preserved — pass
`weightBounds: null`. This is what you want for true partial-play scaling where,
say, a six-player roster rotating through five slots should each take `5/6` of a
normal update:

```ts
rate(teams, {
  weightBounds: null,
  weight: [
    [5 / 6, 5 / 6, 5 / 6, 5 / 6, 5 / 6, 5 / 6],
    [1, 1, 1, 1, 1],
  ],
})
```
