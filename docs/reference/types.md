# Types

openskill.js is written in TypeScript and ships its declarations. All public
types are exported from the package root:

```ts
import type { Rating, Team, Rank, Model, Gamma, Options } from 'openskill'
```

## `Rating`

A single player's rating — the only state you need to persist.

```ts
type Rating = {
  mu: number // estimated skill (mean)
  sigma: number // uncertainty (standard deviation)
}
```

## `Team`

An array of player ratings.

```ts
type Team = Rating[]
```

## `Rank`

```ts
type Rank = number
```

## `Model`

A rating model: takes ranked teams, returns updated teams in the same shape.
Implement this to write a [custom model](/guide/custom-models).

```ts
type Model = (teams: Team[], options?: Options) => Team[]
```

## `Gamma`

The per-update `sigma`-shrink function. See [`gamma`](/reference/options#gamma).

```ts
type Gamma = (
  c: number,
  k: number,
  mu: number,
  sigmaSq: number,
  team: Rating[],
  qRank: number
) => number
```

## `Options`

The shared options bag accepted by every function. See
[Options](/reference/options) for what each field does and its default.

```ts
type Options = {
  z?: number
  mu?: number
  sigma?: number
  epsilon?: number
  gamma?: Gamma
  beta?: number
  model?: Model
  rank?: Rank[]
  score?: number[]
  weight?: number[][]
  weightBounds?: [number, number] | null
  tau?: number
  margin?: number
  alpha?: number
  target?: number
  limitSigma?: boolean
  balance?: boolean
  kappa?: number
}
```
