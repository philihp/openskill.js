![](https://philihp.com/openskill.js/logo.png)

[![Version](https://img.shields.io/npm/v/openskill)](https://www.npmjs.com/package/openskill)
![Tests](https://github.com/philihp/openskill.js/workflows/tests/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/philihp/openskill.js/badge.svg?branch=main&force=reload)](https://coveralls.io/github/philihp/openskill.js?branch=main)
![Downloads](https://img.shields.io/npm/dt/fast-shuffle)
![License](https://img.shields.io/npm/l/openskill)

Javascript implementation of Weng-Lin Rating, as described at https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf

## Speed

Openskill is crazy-stupid-fast.

| Model                           | Speed (higher is better) | Variance |         Samples |
| ------------------------------- | -----------------------: | -------: | --------------: |
| Openskill/bradleyTerryFull      |           62,643 ops/sec |   ±1.09% | 91 runs sampled |
| Openskill/bradleyTerryPart      |           40,152 ops/sec |   ±0.73% | 91 runs sampled |
| Openskill/thurstonMostellerFull |           59,336 ops/sec |   ±0.74% | 93 runs sampled |
| Openskill/thurstonMostellerPart |           38,666 ops/sec |   ±1.21% | 92 runs sampled |
| Openskill/plackettLuce          |           23,492 ops/sec |   ±0.26% | 91 runs sampled |
| TrueSkill                       |            2,962 ops/sec |   ±3.23% | 82 runs sampled |

See [this post](https://philihp.com/2020/openskill.html) for more.

## Installation

Add `openskill` to your list of dependencies in `package.json`:

```bash
npm install --save openskill
```

## Usage

If you're writing ES6, you can `import`, otherwise use CommonJS's `require`

```js
import { rating, rate, ordinal } from 'openskill'
```

Ratings are kept as an object which represent a gaussian curve, with properties where `mu` represents the _mean_, and `sigma` represents the spread or standard deviation. Create these with:

```js
> const { rating } = require('openskill')
> const a1 = rating()
{ mu: 25, sigma: 8.333333333333334 }
> const a2 = rating({ mu: 32.444, sigma: 5.123 })
{ mu: 32.444, sigma: 5.123 }
> const b1 = rating({ mu: 43.381, sigma: 2.421 })
{ mu: 43.381, sigma: 2.421 }
> const b2 = rating({ mu: 25.188, sigma: 6.211 })
{ mu: 25.188, sigma: 6.211 }
```

If `a1` and `a2` are on a team, and wins against a team of `b1` and `b2`, send this into `rank`

```js
> const { rate } = require('openskill')
> const [[x1, x2], [y1, y2]] = rate([[a1, a2], [b1, b2]])
[
  [
    { mu: 28.67..., sigma: 8.07...},
    { mu: 33.83..., sigma: 5.06...}
  ],
  [
    { mu: 43.07..., sigma: 2.42...},
    { mu: 23.15..., sigma: 6.14...}
  ]
]
```

In more simplified matches with one team against another, the losing team's players' `mu` components should always go down, and up for the winning team's players. `sigma` components should always go down.

When displaying a rating, or sorting a list of ratings, you can use `ordinal`

```js
> const { ordinal } = require('openskill')
> ordinal({ mu: 43.07, sigma: 2.42})
35.81
```

By default, this returns `mu - 3*sigma`, showing a rating for which there's a 99.5% likelihood the player's true rating is higher, so with early games, a player's ordinal rating will usually go up and could go up even if that player loses.

### Artificial Ranking

If your teams are listed in one order but your ranking is in a different order, for convenience you can specify a `ranks` option, such as

```js
> const a1 = b1 = c1 = d1 = rating()
> const [a2, b2, c2, d2] = rate([[a1], [b1], [c1], [d1]], {
    rank: [4, 1, 3, 2]
  })
[
  { mu: 20.963, sigma: 8.084 }, // 🐌
  { mu: 27.795, sigma: 8.263 }, // 🥇
  { mu: 24.689, sigma: 8.084 }, // 🥉
  { mu: 26.553, sigma: 8.179 }, // 🥈
]
```

It's assumed that the lower ranks are better (wins), while higher ranks are worse (losses). You can provide a `score` instead, where lower is worse and higher is better. These can just be raw scores from the game, if you want.

Ties should have either equivalent rank or score.

```js
> const a1 = b1 = c1 = d1 = rating()
> const [a2, b2, c2, d2] = rate([a1], [b1], [c1], [d1]], {
    rank: [2, 4, 2, 1]
  })
[
  { mu: 24.689, sigma: 8.179 }, // 🥈
  { mu: 22.826, sigma: 8.179 }, // 🐌
  { mu: 24.689, sigma: 8.179 }, // 🥈
  { mu: 27.795, sigma: 8.263 }, // 🥇
]
```

### Which Model do I want?

- Bradley-Terry rating models follow a logistic distribution over a player's skill, similar to Glicko.
- Thurstone-Mosteller rating models follow a gaussian distribution, similar to TrueSkill. Like TrueSkill, you'll need a way to calculate the cumulative distribution function, which can differ by implementation and can cause innacuracies. Experimentally, this model is not as accurate, but tuning it with a custom gamma may yield better results. It could be better, but it is not recommended. An alternative gamma function can improve the accuracy in some cases.
- Full pairing should have a better prediction rate over partial pairing, however in Bradley-Terry and Thurston-Mosteller models in _k_-team matches where _k_ is high (e.g. 1000+ person marathon races), the calculation of joint probability involves an expensive _k_-1 dimensional integration.
- Plackett-Luce is a generalized Bradley-Terry model for _k_ >= 3 teams.

## Implementations in other languages

- Kotlin https://github.com/brezinajn/openskill
- Elixir https://github.com/philihp/openskill.ex
