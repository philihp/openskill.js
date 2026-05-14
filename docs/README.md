# openskill.js

[![Version](https://img.shields.io/npm/v/openskill)](https://www.npmjs.com/package/openskill)
[![tests](https://github.com/philihp/openskill.js/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/philihp/openskill.js/actions/workflows/tests.yml)
[![Coverage](https://coveralls.io/repos/github/philihp/openskill.js/badge.svg?branch=main&force=reload)](https://coveralls.io/github/philihp/openskill.js?branch=main)
![Downloads](https://img.shields.io/npm/dt/openskill)
![License](https://img.shields.io/npm/l/openskill)

A JavaScript / TypeScript implementation of the Weng-Lin Bayesian online
skill-ranking method, described in
[*A Bayesian Approximation Method for Online Ranking*](https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf).

`openskill` is a faster, simpler, and patent-free alternative to TrueSkill that
supports asymmetric teams, free-for-all matches, partial rankings, and ties.

## Why openskill?

- **Fast** — up to 20× faster than TrueSkill (see the [benchmarks](#speed)).
- **Flexible** — Bradley-Terry, Thurstone-Mosteller, and Plackett-Luce models.
- **Portable** — bit-for-bit compatible with the reference
  [Python implementation](https://github.com/vivekjoshy/openskill.py), so you
  can train in one runtime and serve in another.
- **Tiny API** — `rating`, `rate`, `ordinal`, `predictWin`, `predictDraw`,
  `predictRank`. That's it.

## Speed

| Model                            | Speed (higher is better) | Variance |         Samples |
| -------------------------------- | -----------------------: | -------: | --------------: |
| Openskill/bradleyTerryFull       |           62,643 ops/sec |   ±1.09% | 91 runs sampled |
| Openskill/bradleyTerryPart       |           40,152 ops/sec |   ±0.73% | 91 runs sampled |
| Openskill/thurstoneMostellerFull |           59,336 ops/sec |   ±0.74% | 93 runs sampled |
| Openskill/thurstoneMostellerPart |           38,666 ops/sec |   ±1.21% | 92 runs sampled |
| Openskill/plackettLuce           |           23,492 ops/sec |   ±0.26% | 91 runs sampled |
| TrueSkill                        |            2,962 ops/sec |   ±3.23% | 82 runs sampled |

See [this post](https://philihp.com/2020/openskill.html) for more.

## Implementations in other languages

The same algorithm has been ported to several other ecosystems. The
[Examples by Language](examples/javascript.md) section of this site shows
idiomatic usage for each port.

| Language          | Repository                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| JavaScript        | [philihp/openskill.js](https://github.com/philihp/openskill.js)                                                            |
| Python            | [vivekjoshy/openskill.py](https://github.com/vivekjoshy/openskill.py)                                                      |
| Java              | [pocketcombats/openskill-java](https://github.com/pocketcombats/openskill-java)                                            |
| Kotlin            | [brezinajn/openskill.kt](https://github.com/brezinajn/openskill.kt)                                                        |
| Elixir            | [philihp/openskill.ex](https://github.com/philihp/openskill.ex)                                                            |
| Lua               | [bstummer/openskill.lua](https://github.com/bstummer/openskill.lua)                                                        |
| Google Apps Script | [haya14busa/gas-openskill](https://github.com/haya14busa/gas-openskill)                                                    |
| Google Sheets     | [Spreadsheet template](https://docs.google.com/spreadsheets/d/12TA1ZG_qpBi4kDTclaOGB4sd5uJK8w-0My6puMd2-CY/edit?usp=sharing) |

## Next

- [Installation & Quick Start →](getting-started.md)
- [Full API Reference →](api.md)
