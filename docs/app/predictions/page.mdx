# Predictions

`openskill` exposes three prediction helpers in addition to `rate`. They take
the same `teams` shape as `rate` and never mutate the inputs.

## `predictWin`

Relative odds that each team will win, normalized to sum to 1.

```js
import { rating, predictWin } from 'openskill'

const a1 = rating()
const a2 = rating({ mu: 33.564, sigma: 1.123 })

const probs = predictWin([[a1], [a2]])
// [ 0.4511..., 0.5489... ]

probs[0] + probs[1] // 1
```

## `predictDraw`

Relative likelihood that the match ends in a draw. The number is most useful
as a *score for matchmaking* — higher means a more competitive match. The
absolute value depends on the rules of your game.

```js
import { predictDraw } from 'openskill'

predictDraw([[a1], [a2]])
// 0.0902...
```

This is analogous to the *quality* metric in TrueSkill — use it to optimize
matchmaking, seedings, or tournament brackets.

## `predictRank`

The predicted finishing order with associated probabilities. Useful when you
care about more than just *who wins*.

```js
import { predictRank } from 'openskill'

predictRank([[a1], [b1], [c1]])
```
