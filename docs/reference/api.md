# API

All functions are named exports from the package root:

```ts
import { rating, rate, ordinal, predictWin, predictDraw, predictRank } from 'openskill'
```

Models are exported from the `openskill/models` subpath:

```ts
import {
  plackettLuce,
  bradleyTerryFull,
  bradleyTerryPart,
  thurstoneMostellerFull,
  thurstoneMostellerPart,
} from 'openskill/models'
```

## `rating(init?, options?)`

Create a rating object.

```ts
function rating(init?: { mu?: number; sigma?: number }, options?: Options): Rating
```

- `init` — override `mu` and/or `sigma` for this rating.
- `options` — supply alternate defaults (e.g. a custom `mu`/`sigma` baseline).
- **Returns** a `Rating`: `{ mu, sigma }`.

## `rate(teams, options?)`

Update ratings from the result of a match.

```ts
function rate(teams: Rating[][], options?: Options): Rating[][]
```

- `teams` — array of teams, each an array of player ratings, ordered
  best-to-worst unless `rank` or `score` is given.
- `options` — match and model [options](/reference/options) (`model`, `rank`,
  `score`, `margin`, `tau`, `limitSigma`, …).
- **Returns** the updated ratings in the same shape as `teams`.

## `ordinal(rating, options?)`

Collapse a rating into a single conservative, sortable number.

```ts
function ordinal(rating: Rating, options?: Options): number
```

- **Returns** `target + alpha * (mu - z * sigma)`; defaults to `mu - 3 * sigma`.
- Tunable via the [`z`, `alpha`, `target`](/reference/options#ordinal-options)
  options.

## `predictWin(teams, options?)`

```ts
function predictWin(teams: Rating[][], options?: Options): number[]
```

- **Returns** each team's probability of winning. The values sum to `1`.

## `predictDraw(teams, options?)`

```ts
function predictDraw(teams: Rating[][], options?: Options): number
```

- **Returns** the relative likelihood of a draw (treat as relative, not absolute).

## `predictRank(teams, options?)`

```ts
function predictRank(teams: Rating[][], options?: Options): [number, number][]
```

- **Returns** a `[rank, probability]` pair per team. Teams with equal win
  probability share a rank.
