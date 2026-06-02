# Choosing a Model

A *model* decides how a match result is turned into rating changes. openskill.js
defaults to **Plackett-Luce**, which is a good fit for most games, but four other
models ship in the box. They trade accuracy for speed.

## Importing a model

Models are exported from the `openskill/models` subpath. Import the one you want
and pass it as the `model` [option](/reference/options) to `rate()` (or to any of
the `predict*` functions):

::: code-group

```ts [JavaScript]
import { rate } from 'openskill'
import { bradleyTerryFull } from 'openskill/models'

const [[a2], [b2]] = rate([[a1], [b1]], {
  model: bradleyTerryFull,
})
```

```python [Python]
from openskill.models import BradleyTerryFull

model = BradleyTerryFull()
[[a2], [b2]] = model.rate([[a1], [b1]])
```

:::

In Python the model is the object you call `.rate()` on; in JavaScript the model
is a function you pass as the `model` option.

The five available models are:

```ts
import {
  plackettLuce,
  bradleyTerryFull,
  bradleyTerryPart,
  thurstoneMostellerFull,
  thurstoneMostellerPart,
} from 'openskill/models'
```

::: tip TypeScript
Each model is typed as the exported [`Model`](/reference/types#model) type, and
the `model` option is fully typed, so editor autocomplete works on all of them.
:::

## How they differ

| Model                      | Distribution | Pairing | Best for                          |
| -------------------------- | ------------ | ------- | --------------------------------- |
| `plackettLuce` *(default)* | logistic     | —       | Any number of teams; scales best  |
| `bradleyTerryFull`         | logistic     | full    | Smaller matches needing accuracy  |
| `bradleyTerryPart`         | logistic     | partial | Very large fields (e.g. marathons)|
| `thurstoneMostellerFull`   | gaussian     | full    | TrueSkill-like behavior           |
| `thurstoneMostellerPart`   | gaussian     | partial | Very large fields, gaussian       |

- **Bradley-Terry** models follow a *logistic* distribution over a player's
  skill, similar to Glicko.
- **Thurstone-Mosteller** models follow a *gaussian* distribution, similar to
  TrueSkill. Accuracy isn't usually as good, but tuning the
  [`gamma`](/reference/options#gamma) function can improve it.
- **Plackett-Luce** (the default) is a generalized Bradley-Terry model for
  _k_ ≥ 3 teams. It scales the best and is the right default for free-for-alls.

### Full vs. partial pairing

Full pairing produces more accurate ratings, but in high-_k_ games (think a
100-person marathon), the Bradley-Terry and Thurstone-Mosteller models must
compute a joint probability that involves a _k_−1 dimensional integration — which
is expensive. In those cases use a **partial** pairing model, where each player's
rating only changes based on their neighbors in the ranking.

## Speed

Picking a lighter model can be dramatically faster than the default:

| Model                            | Speed (higher is better) |
| -------------------------------- | -----------------------: |
| `bradleyTerryFull`               |           62,643 ops/sec |
| `thurstoneMostellerFull`         |           59,336 ops/sec |
| `bradleyTerryPart`               |           40,152 ops/sec |
| `thurstoneMostellerPart`         |           38,666 ops/sec |
| `plackettLuce` *(default)*       |           23,492 ops/sec |
| TrueSkill *(for comparison)*     |            2,962 ops/sec |

Need something none of these provide? Write your own — see
[Custom Models](/guide/custom-models).
