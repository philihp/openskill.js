# Predictions

Besides updating ratings after a match, openskill.js can predict what *would*
happen in a hypothetical match. These are handy for matchmaking, seeding
tournaments, or showing odds to players.

All three functions take the same `teams` (and optional `options`) shape as
`rate()`.

## `predictWin`

Returns each team's relative probability of winning. The probabilities sum to 1.

::: code-group

```ts [JavaScript]
import { predictWin, rating } from 'openskill'

const a1 = rating()
const a2 = rating({ mu: 33.564, sigma: 1.123 })

const probabilities = predictWin([[a1], [a2]])
// [ 0.4511…, 0.5489… ]

probabilities[0] + probabilities[1] // 1
```

```python [Python]
from openskill.models import PlackettLuce

model = PlackettLuce()
a1 = model.rating()
a2 = model.rating(mu=33.564, sigma=1.123)

probabilities = model.predict_win([[a1], [a2]])
# [ 0.4511…, 0.5489… ]

sum(probabilities)  # 1
```

:::

This works for any number of teams, not just two.

## `predictDraw`

Returns the relative likelihood that the match ends in a draw. Treat the number
as relative to other matchups rather than an absolute probability — the real
odds of a legal draw depend on your game's rules.

::: code-group

```ts [JavaScript]
import { predictDraw } from 'openskill'

predictDraw([[a1], [a2]])
// 0.0902…
```

```python [Python]
model.predict_draw([[a1], [a2]])
# 0.0902…
```

:::

This plays the same role as *match quality* in TrueSkill: maximize it when you
want evenly matched games, exciting finals, or balanced brackets.

## `predictRank`

Returns the most likely finishing rank for each team along with the win
probability that produced it. Ties in probability share a rank.

::: code-group

```ts [JavaScript]
import { predictRank } from 'openskill'

predictRank([[a1], [a2], [a1]])
// [ [rank, probability], [rank, probability], [rank, probability] ]
```

```python [Python]
model.predict_rank([[a1], [a2], [a1]])
# [ (rank, probability), (rank, probability), (rank, probability) ]
```

:::

::: tip
Predictions accept the same model-affecting [options](/reference/options) as
`rate()` (such as `beta`), so predictions stay consistent with how you rate.
:::
