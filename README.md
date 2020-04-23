[![Version](https://img.shields.io/npm/v/openskill)](https://www.npmjs.com/package/openskill)
![Tests](https://github.com/philihp/openskill.js/workflows/tests/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/philihp/openskill.js/badge.svg?branch=master&force=reload)](https://coveralls.io/github/philihp/openskill.js?branch=master)
![License](https://img.shields.io/npm/l/openskill)

```ascii

 ▒█████   ██▓███  ▓█████  ███▄    █   ██████  ██ ▄█▀ ██▓ ██▓     ██▓
▒██▒  ██▒▓██░  ██▒▓█   ▀  ██ ▀█   █ ▒██    ▒  ██▄█▒ ▓██▒▓██▒    ▓██▒
▒██░  ██▒▓██░ ██▓▒▒███   ▓██  ▀█ ██▒░ ▓██▄   ▓███▄░ ▒██▒▒██░    ▒██░
▒██   ██░▒██▄█▓▒ ▒▒▓█  ▄ ▓██▒  ▐▌██▒  ▒   ██▒▓██ █▄ ░██░▒██░    ▒██░
░ ████▓▒░▒██▒ ░  ░░▒████▒▒██░   ▓██░▒██████▒▒▒██▒ █▄░██░░██████▒░██████▒
░ ▒░▒░▒░ ▒▓▒░ ░  ░░░ ▒░ ░░ ▒░   ▒ ▒ ▒ ▒▓▒ ▒ ░▒ ▒▒ ▓▒░▓  ░ ▒░▓  ░░ ▒░▓  ░
  ░ ▒ ▒░ ░▒ ░      ░ ░  ░░ ░░   ░ ▒░░ ░▒  ░ ░░ ░▒ ▒░ ▒ ░░ ░ ▒  ░░ ░ ▒  ░
░ ░ ░ ▒  ░░          ░      ░   ░ ░ ░  ░  ░  ░ ░░ ░  ▒ ░  ░ ░     ░ ░
    ░ ░              ░  ░         ░       ░  ░  ░    ░      ░  ░    ░  ░

```

Javascript implementation of Weng-Lin Rating, as described at https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf

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
    { mu: 28.669648436582808, sigma: 8.071520788025197 },
    { mu: 33.83086971107981, sigma: 5.062772998705765 }
  ],
  [
    { mu: 43.071274808241974, sigma: 2.4166900452721256 },
    { mu: 23.149503312339064, sigma: 6.1378606973362135 }
  ]
]
```

In more simplified matches with one team against another, the losing team's players' `mu` components should always go down, and up for the winning team's players. `sigma` components should always go down.

When displaying a rating, or sorting a list of ratings, you can use `ordinal`

```js
> const { ordinal } = require('openskill')
> ordinal({ mu: 43.071274808241974, sigma: 2.4166900452721256})
35.821204672425594
```

By default, this returns `mu - 3*sigma`, showing a rating for which there's a 99.5% likelihood the player's true rating is higher, so with early games, a player's ordinal rating will usually go up and could go up even if that player loses.

## TODO

- Import other models
- Support shuffled rankings, e.g. `Openskill.rank([[p1],[p2],[p3],[p4]], ranks: [1, 4, 2, 3])`.
- Support tied rankings, e.g. `Openskill.rank([[p1],[p2],[p3],[p4]], ranks: [1, 2, 2, 4])`
- Configurable alternate `gamma` to avoid ill-conditioning problems from large numbers of teams, as discussed in the paper.
