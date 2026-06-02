# Recording Matches

`rate()` is the heart of the library. Give it the teams that played a match and
it returns updated ratings in the same shape.

```ts
function rate(teams: Rating[][], options?: Options): Rating[][]
```

- `teams` is an array of teams; each team is an array of player ratings.
- The return value mirrors that structure with new ratings.

## Teams and ordering

By default, teams are assumed to be listed **best-to-worst** — the first team
won, the last team lost.

::: code-group

```ts [JavaScript]
import { rate } from 'openskill'

// [a1, a2] beat [b1, b2]
const [[a2, a3], [b2, b3]] = rate([
  [a1, a2],
  [b1, b2],
])
```

```python [Python]
from openskill.models import PlackettLuce

model = PlackettLuce()

# [a1, a2] beat [b1, b2]
[[a2, a3], [b2, b3]] = model.rate([[a1, a2], [b1, b2]])
```

:::

Teams can be **asymmetric**. A game like
[Axis & Allies](<https://en.wikipedia.org/wiki/Axis_%26_Allies>) can pit 3 players
against 2, and that's modeled fine:

```ts
rate([
  [p1, p2, p3], // winners
  [p4, p5], // losers
])
```

## Ranks

If your teams aren't already sorted by who won, pass an explicit `rank` array.
**Lower ranks are better** (rank 1 is the winner):

::: code-group

```ts [JavaScript]
const a1 = rating()
const b1 = rating()
const c1 = rating()
const d1 = rating()

const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]], {
  rank: [4, 1, 3, 2], // 🐌 🥇 🥉 🥈
})
```

```python [Python]
a1 = model.rating()
b1 = model.rating()
c1 = model.rating()
d1 = model.rating()

[[a2], [b2], [c2], [d2]] = model.rate(
    [[a1], [b1], [c1], [d1]],
    ranks=[4, 1, 3, 2],  # 🐌 🥇 🥉 🥈
)
```

:::

## Scores

Alternatively, provide a `score` for each team. **Higher scores are better** —
these can be the raw scores straight out of your game:

::: code-group

```ts [JavaScript]
const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]], {
  score: [37, 19, 37, 42], // 🥈 🐌 🥈 🥇
})
```

```python [Python]
[[a2], [b2], [c2], [d2]] = model.rate(
    [[a1], [b1], [c1], [d1]],
    scores=[37, 19, 37, 42],  # 🥈 🐌 🥈 🥇
)
```

:::

## Ties

Ties are expressed by giving teams the **same** rank or the **same** score. In
the score example above, the two `37`s are treated as a draw between those teams.

## Margin of victory

When you supply `score`, you can also set a `margin`. Wins by more than the
margin amplify the rating change proportionally to how lopsided the result was,
while closer games are treated as ordinary wins and losses.

::: code-group

```ts [JavaScript]
rate([[a1], [b1]], {
  score: [100, 40],
  margin: 10,
})
```

```python [Python]
model.rate(
    [[a1], [b1]],
    scores=[100, 40],
    margin=10,
)
```

:::

See [Options](/reference/options) for `tau`, `limitSigma`, `model`, and the
other knobs you can pass here.
