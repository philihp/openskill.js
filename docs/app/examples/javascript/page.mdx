# JavaScript / TypeScript

> [github.com/philihp/openskill.js](https://github.com/philihp/openskill.js)

## Install

```bash
npm install --save openskill
```

## Idiomatic usage

```js
import { rating, rate, ordinal, predictWin, predictDraw } from 'openskill'
import { plackettLuce } from 'openskill/models'

// 1. Create ratings for two teams of two
const a1 = rating()
const a2 = rating({ mu: 32.444, sigma: 5.123 })
const b1 = rating({ mu: 43.381, sigma: 2.421 })
const b2 = rating({ mu: 25.188, sigma: 6.211 })

// 2. Team A beats Team B (first team listed is the winner by default)
const [[a1n, a2n], [b1n, b2n]] = rate([
  [a1, a2],
  [b1, b2],
])

// 3. Sort a leaderboard by ordinal
const leaderboard = [
  { name: 'Alice', rating: a1n },
  { name: 'Bob',   rating: a2n },
  { name: 'Carol', rating: b1n },
  { name: 'Dan',   rating: b2n },
].sort((a, b) => ordinal(b.rating) - ordinal(a.rating))

// 4. Predict the next match
const winProbabilities = predictWin([[a1n, a2n], [b1n, b2n]])
const drawProbability  = predictDraw([[a1n, a2n], [b1n, b2n]])

// 5. Pick a different model when speed matters more than precision
import { bradleyTerryFull } from 'openskill/models'

const [[x1n], [y1n]] = rate(
  [[rating()], [rating()]],
  { model: bradleyTerryFull }
)
```

## Free-for-all match with explicit ranks

```js
import { rating, rate } from 'openskill'

const players = [rating(), rating(), rating(), rating()]
const teams   = players.map((r) => [r])

// 4-player FFA: P2 won, P4 second, P3 third, P1 last
const updated = rate(teams, { rank: [4, 1, 3, 2] })
```

## TypeScript

Types ship with the package — no `@types/openskill` needed.

```ts
import type { Rating } from 'openskill'

function leaderboardEntry(name: string, r: Rating) {
  return { name, mu: r.mu, sigma: r.sigma }
}
```
