# Getting Started

openskill.js is a JavaScript/TypeScript implementation of the
[Weng-Lin Bayesian rating system](https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf).
It is a faster, open-source alternative to TrueSkill that produces a rating for each
player from the outcomes of matches.

## Installation

Add `openskill` to the dependencies in your `package.json`:

```bash
npm install --save openskill
```

The package ships with both ES module and CommonJS builds plus TypeScript
declarations, so it works out of the box in either module system.

::: code-group

```ts [JavaScript]
// ES modules / TypeScript
import { rating, rate, ordinal } from 'openskill'

// or with CommonJS:
// const { rating, rate, ordinal } = require('openskill')
```

```python [Python]
# pip install openskill
from openskill.models import PlackettLuce

model = PlackettLuce()
rating = model.rating
```

:::

::: tip Two ports, one system
These docs are for the JavaScript/TypeScript library. The
[Python port](https://github.com/vivekjoshy/openskill.py) implements the same
math — as of v5.0.0 the two produce bit-for-bit identical results — so the tabs
throughout this guide show the equivalent call in each. The shapes differ
slightly: JavaScript uses plain `{ mu, sigma }` objects, while Python uses a
`model` instance whose `.rating()` produces typed rating objects.
:::

## A complete example

Every player is represented by a Gaussian curve described by two numbers:

- `mu` (μ) — the estimated skill, the mean of the curve.
- `sigma` (σ) — the uncertainty about that estimate, the standard deviation.

::: code-group

```ts [JavaScript]
import { rating, rate, ordinal } from 'openskill'

// Create some players. A fresh rating defaults to { mu: 25, sigma: 25/3 }.
const a1 = rating()
const a2 = rating({ mu: 32.444, sigma: 5.123 })
const b1 = rating({ mu: 43.381, sigma: 2.421 })
const b2 = rating({ mu: 25.188, sigma: 6.211 })

// Team [a1, a2] played team [b1, b2] and won.
// rate() takes teams ordered best-to-worst by default.
const [[x1, x2], [y1, y2]] = rate([
  [a1, a2],
  [b1, b2],
])

// The winners' mu went up, the losers' went down, and everyone's
// sigma shrank a little as we learned more about them.

// Turn a rating into a single sortable number for a leaderboard.
ordinal(x1)
```

```python [Python]
from openskill.models import PlackettLuce

model = PlackettLuce()

# Create some players. A fresh rating defaults to mu=25, sigma=25/3.
a1 = model.rating()
a2 = model.rating(mu=32.444, sigma=5.123)
b1 = model.rating(mu=43.381, sigma=2.421)
b2 = model.rating(mu=25.188, sigma=6.211)

# Team [a1, a2] played team [b1, b2] and won.
# rate() takes teams ordered best-to-worst by default.
[[x1, x2], [y1, y2]] = model.rate([[a1, a2], [b1, b2]])

# Turn a rating into a single sortable number for a leaderboard.
model.ordinal(x1)
```

:::

## What's next

- [Ratings & Ordinal](/guide/ratings) — how ratings are created and displayed.
- [Recording Matches](/guide/rating-matches) — teams, ranks, scores, and ties.
- [Predictions](/guide/predictions) — predict winners and draws.
- [Choosing a Model](/guide/models) — trade speed for accuracy.
- [Custom Models](/guide/custom-models) — write your own in TypeScript.
- [Options](/reference/options) — every tuning knob explained.
