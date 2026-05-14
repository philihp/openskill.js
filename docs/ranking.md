# Ranking & Ordinal

A `Rating` is a Gaussian — `mu` is the mean (believed skill), and `sigma` is
the spread (uncertainty). To rank players you usually want a single number,
which is what `ordinal` is for.

## `ordinal`

```js
import { ordinal } from 'openskill'

ordinal({ mu: 43.07, sigma: 2.42 }) // 35.81
```

By default this returns `mu - 3 * sigma` — the lower bound of a [99.7%
confidence interval](https://en.wikipedia.org/wiki/68–95–99.7_rule). With
fresh players this means `ordinal` will rise as `sigma` shrinks, even after a
loss, which is desirable for newcomers ramping up.

## Artificial ordering with `rank`

If your `teams` array isn't already in finishing order, pass `rank`. Lower
ranks are better.

```js
import { rating, rate } from 'openskill'

const a1 = b1 = c1 = d1 = rating()

const [[a2], [b2], [c2], [d2]] = rate(
  [[a1], [b1], [c1], [d1]],
  { rank: [4, 1, 3, 2] } // 🐌 🥇 🥉 🥈
)
```

## Artificial ordering with `score`

Same idea, but with raw scores from your game — higher is better.

```js
const [[a2], [b2], [c2], [d2]] = rate(
  [[a1], [b1], [c1], [d1]],
  { score: [37, 19, 37, 42] } // 🥈 🐌 🥈 🥇
)
```

## Ties

Ties are encoded as equal `rank` or equal `score`. Players sharing a position
update against each other as if they drew.
