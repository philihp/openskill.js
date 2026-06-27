# Python

> [github.com/vivekjoshy/openskill.py](https://github.com/vivekjoshy/openskill.py)

The Python port is the canonical reference implementation —
`openskill.js` v5 produces bit-for-bit identical output.

## Install

```bash
pip install openskill
```

## Idiomatic usage

The Python API is built around model classes. Construct a model once, then
use it to mint and update ratings.

```python
from openskill.models import PlackettLuce

model = PlackettLuce()

# 1. Create ratings
a1 = model.rating(name="Alice")
a2 = model.rating(name="Bob",   mu=32.444, sigma=5.123)
b1 = model.rating(name="Carol", mu=43.381, sigma=2.421)
b2 = model.rating(name="Dan",   mu=25.188, sigma=6.211)

# 2. Team A beats Team B
[[a1, a2], [b1, b2]] = model.rate([[a1, a2], [b1, b2]])

# 3. Single-number ranking via ordinal()
leaderboard = sorted(
    [a1, a2, b1, b2],
    key=lambda r: r.ordinal(),
    reverse=True,
)

# 4. Predictions
win_probs = model.predict_win([[a1, a2], [b1, b2]])
draw_prob = model.predict_draw([[a1, a2], [b1, b2]])
```

## Free-for-all with explicit ranks

```python
from openskill.models import PlackettLuce

model = PlackettLuce()
players = [model.rating() for _ in range(4)]
teams   = [[p] for p in players]

# P2 won, P4 second, P3 third, P1 last
updated = model.rate(teams, ranks=[4, 1, 3, 2])
```

## Choosing a different model

```python
from openskill.models import BradleyTerryFull, ThurstoneMostellerPart

fast_model = BradleyTerryFull()
massive_match_model = ThurstoneMostellerPart()
```
