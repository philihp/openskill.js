# Ratings & Ordinal

## Creating ratings

A rating is a plain object with two numeric properties:

```ts
type Rating = {
  mu: number // estimated skill (mean)
  sigma: number // uncertainty (standard deviation)
}
```

Use `rating()` to create one. With no arguments you get the defaults; pass a
partial object to override either field:

::: code-group

```ts [JavaScript]
import { rating } from 'openskill'

rating()
// { mu: 25, sigma: 8.333333333333334 }   (8.33… is 25/3)

rating({ mu: 32.444, sigma: 5.123 })
// { mu: 32.444, sigma: 5.123 }
```

```python [Python]
from openskill.models import PlackettLuce

model = PlackettLuce()

model.rating()
# PlackettLuceRating(mu=25.0, sigma=8.333333333333334)

model.rating(mu=32.444, sigma=5.123)
# PlackettLuceRating(mu=32.444, sigma=5.123)
```

:::

You can also change the defaults used for new ratings by passing
[options](/reference/options) as a second argument:

```ts
rating({}, { mu: 1000, sigma: 1000 / 3 })
// { mu: 1000, sigma: 333.333… }
```

Store `mu` and `sigma` per player in your database. That pair is the complete
state — nothing else needs to be persisted between matches.

## Displaying & sorting with `ordinal`

A rating is two numbers, but a leaderboard needs one. `ordinal` collapses a
rating into a single conservative estimate of skill:

::: code-group

```ts [JavaScript]
import { ordinal } from 'openskill'

ordinal({ mu: 43.07, sigma: 2.42 })
// 35.81
```

```python [Python]
from openskill.models import PlackettLuce

model = PlackettLuce()

model.ordinal(model.rating(mu=43.07, sigma=2.42))
# 35.81
```

:::

By default this returns `mu - 3 * sigma`. That subtracts three standard
deviations, so there is a [99.7%](https://en.wikipedia.org/wiki/68–95–99.7_rule)
chance the player's true skill is *higher* than the displayed number. A practical
consequence: new players (with high `sigma`) start low and climb as the system
becomes confident in them — their ordinal can rise even after a loss.

You can tune how conservative this is, or rescale the output entirely, with the
`z`, `alpha`, and `target` [options](/reference/options#ordinal-options):

```ts
// Display on a 0–1000-ish scale instead of around 0.
ordinal({ mu: 43.07, sigma: 2.42 }, { alpha: 20, target: 500 })
```
