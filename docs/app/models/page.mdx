# Models

`openskill` ships five rating models. They all live in the `openskill/models`
subpath.

```js
import {
  plackettLuce,
  bradleyTerryFull,
  bradleyTerryPart,
  thurstoneMostellerFull,
  thurstoneMostellerPart,
} from 'openskill/models'
```

Pass one to `rate` via the `model` option:

```js
import { rate } from 'openskill'
import { bradleyTerryFull } from 'openskill/models'

const [[a2], [b2]] = rate([[a1], [b1]], { model: bradleyTerryFull })
```

## Plackett-Luce — default

A generalized Bradley-Terry model that scales to *k* ≥ 3 teams without
needing a *k*−1 dimensional integration. **Use this unless you have a reason
not to.**

## Bradley-Terry

Logistic distribution over player skill — similar to Glicko.

- `bradleyTerryFull` — full pairing. More accurate, but every team is
  compared against every other team.
- `bradleyTerryPart` — partial pairing. Each team is compared only with its
  ranking neighbors. Use this for high-*k* matches (e.g. 100-player races)
  where a full pairing would be expensive.

## Thurstone-Mosteller

Gaussian distribution over player skill — similar to TrueSkill. Accuracy is
generally a touch worse than Bradley-Terry, but it can be tuned.

- `thurstoneMostellerFull` — full pairing.
- `thurstoneMostellerPart` — partial pairing for high-*k* matches.

## Choosing a model

| Concern                                             | Pick                       |
| --------------------------------------------------- | -------------------------- |
| Default, fewest surprises                           | `plackettLuce`             |
| Highest throughput, ≤ a few teams                   | `bradleyTerryFull`         |
| Highest throughput, large *k*                       | `bradleyTerryPart`         |
| Drop-in TrueSkill-like behaviour                    | `thurstoneMostellerFull`   |
| TrueSkill-like behaviour with very large *k*        | `thurstoneMostellerPart`   |
