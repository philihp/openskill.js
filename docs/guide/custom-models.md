# Custom Models

If none of the [built-in models](/guide/models) fit your game, you can write your
own. A model is just a function — there are no classes to extend.

## The `Model` type

Import the `Model` type from the package root and annotate your function with it:

```ts
import type { Model, Options, Rating } from 'openskill'

const myModel: Model = (teams, options) => {
  // ...inspect teams, return updated ratings in the same shape
  return teams
}
```

The type is:

```ts
type Model = (teams: Rating[][], options?: Options) => Rating[][]
```

- `teams` arrives **already sorted best-to-worst** and grouped by team. `rate()`
  resolves any `rank`/`score` you passed before calling your model, and unwinds
  the result back into your original order afterward — so your model only has to
  deal with a clean, ranked list.
- The return value must mirror the input: the same number of teams, each with the
  same number of players, in the same order.

Use it exactly like a built-in model:

```ts
import { rate } from 'openskill'

const [[a2], [b2]] = rate([[a1], [b1]], { model: myModel })
```

## Reading constants from options

Most models start by resolving the tuning [options](/reference/options) into
concrete numbers. You can derive your own defaults, or reuse the library's
internal constants helper indirectly by reading the same fields:

```ts
import type { Model } from 'openskill'

const eloLikeModel: Model = (teams, options = {}) => {
  const beta = options.beta ?? 25 / 6
  const kappa = options.kappa ?? 0.0001

  return teams.map((team) =>
    team.map(({ mu, sigma }) => ({
      mu, // ...your update rule here
      sigma: Math.max(sigma, kappa),
    }))
  )
}
```

## A minimal working example

Here's a complete, if naive, model that nudges winners up and losers down by a
flat amount. It demonstrates the contract: same shape in, same shape out.

```ts
import { rate } from 'openskill'
import type { Model } from 'openskill'

// teams[0] is the winner (best rank), teams[teams.length - 1] is the loser.
const flatModel: Model = (teams) => {
  const last = teams.length - 1
  return teams.map((team, place) => {
    const direction = place === 0 ? +1 : place === last ? -1 : 0
    return team.map(({ mu, sigma }) => ({
      mu: mu + direction,
      sigma: Math.max(sigma * 0.999, 0.01),
    }))
  })
}

const [[a2], [b2]] = rate([[a1], [b1]], { model: flatModel })
```

## Customizing `gamma` instead

Often you don't need a whole new model — you just want to change how much a
team's `sigma` shrinks per update. Every built-in model accepts a `gamma`
function for exactly this, so you can keep Plackett-Luce's math and only adjust
that one piece. See [`gamma`](/reference/options#gamma) in the options reference
for its signature and the default implementation.

```ts
import { rate } from 'openskill'
import type { Gamma } from 'openskill'

// Shrink sigma more slowly than the default of sqrt(sigmaSq) / c.
const gentleGamma: Gamma = (c, _k, _mu, sigmaSq) => Math.sqrt(sigmaSq) / c / 2

rate([[a1], [b1]], { gamma: gentleGamma })
```

## Reference

The official [Weng-Lin paper](https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf)
defines the math behind the built-in models, and the
[source for each model](https://github.com/philihp/openskill.js/tree/main/src/models)
is short and readable if you want a fuller template to start from.
