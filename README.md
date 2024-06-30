![](https://philihp.com/openskill.js/logo.png)

[![Version](https://img.shields.io/npm/v/openskill)](https://www.npmjs.com/package/openskill)
[![tests](https://github.com/philihp/openskill.js/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/philihp/openskill.js/actions/workflows/tests.yml)
[![Coverage Status](https://coveralls.io/repos/github/philihp/openskill.js/badge.svg?branch=main&force=reload)](https://coveralls.io/github/philihp/openskill.js?branch=main)
![Downloads](https://img.shields.io/npm/dt/openskill)
![License](https://img.shields.io/npm/l/openskill)

Javascript implementation of Weng-Lin Rating, as described at https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf

## Speed

Up to 20x faster than TrueSkill!

| Model                            | Speed (higher is better) | Variance |         Samples |
| -------------------------------- | -----------------------: | -------: | --------------: |
| Openskill/bradleyTerryFull       |           62,643 ops/sec |   ±1.09% | 91 runs sampled |
| Openskill/bradleyTerryPart       |           40,152 ops/sec |   ±0.73% | 91 runs sampled |
| Openskill/thurstoneMostellerFull |           59,336 ops/sec |   ±0.74% | 93 runs sampled |
| Openskill/thurstoneMostellerPart |           38,666 ops/sec |   ±1.21% | 92 runs sampled |
| Openskill/plackettLuce           |           23,492 ops/sec |   ±0.26% | 91 runs sampled |
| TrueSkill                        |            2,962 ops/sec |   ±3.23% | 82 runs sampled |

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

If `a1` and `a2` are on a team, and wins against a team of `b1` and `b2`, send this into `rate`

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

Teams can be asymmetric, too! For example, a game like [Axis and Allies](https://en.wikipedia.org/wiki/Axis_%26_Allies) can be 3 vs 2, and this can be modeled here.

### Ranking

When displaying a rating, or sorting a list of ratings, you can use `ordinal`

```js
> const { ordinal } = require('openskill')
> ordinal({ mu: 43.07, sigma: 2.42})
35.81
```

By default, this returns `mu - 3*sigma`, showing a rating for which there's a [99.7%](https://en.wikipedia.org/wiki/68–95–99.7_rule) likelihood the player's true rating is higher, so with early games, a player's ordinal rating will usually go up and could go up even if that player loses.

### Artificial Ranking

If your teams are listed in one order but your ranking is in a different order, for convenience you can specify a `ranks` option, such as

```js
> const a1 = b1 = c1 = d1 = rating()
> const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]], {
    rank: [4, 1, 3, 2] // 🐌 🥇 🥉 🥈
  })
[
  [{ mu: 20.963, sigma: 8.084 }], // 🐌
  [{ mu: 27.795, sigma: 8.263 }], // 🥇
  [{ mu: 24.689, sigma: 8.084 }], // 🥉
  [{ mu: 26.553, sigma: 8.179 }], // 🥈
]
```

It's assumed that the lower ranks are better (wins), while higher ranks are worse (losses). You can provide a `score` instead, where lower is worse and higher is better. These can just be raw scores from the game, if you want.

Ties should have either equivalent rank or score.

```js
> const a1 = b1 = c1 = d1 = rating()
> const [[a2], [b2], [c2], [d2]] = rate([[a1], [b1], [c1], [d1]], {
    score: [37, 19, 37, 42] // 🥈 🐌 🥈 🥇
  })
[
  [{ mu: 24.689, sigma: 8.179 }], // 🥈
  [{ mu: 22.826, sigma: 8.179 }], // 🐌
  [{ mu: 24.689, sigma: 8.179 }], // 🥈
  [{ mu: 27.795, sigma: 8.263 }], // 🥇
]
```

### Predicting Winners

For a given match of any number of teams, using `predictWin` you can find a relative
odds that each of those teams will win.

```js
> const { predictWin } = require('openskill')
> const a1 = rating()
> const a2 = rating({mu:33.564, sigma:1.123})
> const predictions = predictWin([[a1], [a2]])
[ 0.45110899943132493, 0.5488910005686751 ]
> predictions[0] + predictions[1]
1
```

### Predicting Draws

Also for a given match, using `predictDraw` you can get the relative chance that these
teams will draw. The number returned here should be treated as relative to other matches, but in reality the odds of an actual legal draw will be impacted by some meta-function based on the rules of the game.

```js
> const { predictDraw } = require('openskill')
> const prediction = predictDraw([[a1], [a2]])
0.09025530533015186
```

This can be used in a similar way that you might use _quality_ in TrueSkill if you were optimizing a matchmaking system, or optimizing an tournament tree structure for exciting finals and semi-finals such as in the NCAA.

### Alternative Models

By default, we use a Plackett-Luce model, which is probably good enough for most cases. When speed is an issue, the library runs faster with other models

```js
import { bradleyTerryFull } from './models'
const [[a2], [b2]] = rate([[a1], [b1]], {
  model: bradleyTerryFull,
})
```

- Bradley-Terry rating models follow a logistic distribution over a player's skill, similar to Glicko.
- Thurstone-Mosteller rating models follow a gaussian distribution, similar to TrueSkill. Gaussian CDF/PDF functions differ in implementation from system to system (they're all just chebyshev approximations anyway). The accuracy of this model isn't usually as great either, but tuning this with an alternative gamma function can improve the accuracy if you really want to get into it.
- Full pairing should have more accurate ratings over partial pairing, however in high _k_ games (like a 100+ person marathon race), Bradley-Terry and Thurstone-Mosteller models need to do a calculation of joint probability which involves is a _k_-1 dimensional integration, which is computationally expensive. Use partial pairing in this case, where players only change based on their neighbors.
- Plackett-Luce (**default**) is a generalized Bradley-Terry model for _k_ &GreaterEqual; 3 teams. It scales best.

## Implementations in other languages

- Python https://github.com/OpenDebates/openskill.py
- Kotlin https://github.com/brezinajn/openskill.kt
- Elixir https://github.com/philihp/openskill.ex
- Lua https://github.com/bstummer/openskill.lua
- Google Sheets https://docs.google.com/spreadsheets/d/12TA1ZG_qpBi4kDTclaOGB4sd5uJK8w-0My6puMd2-CY/edit?usp=sharing
- Google Apps Script https://github.com/haya14busa/gas-openskill
