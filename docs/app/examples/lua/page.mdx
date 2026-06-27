# Lua

> [github.com/bstummer/openskill.lua](https://github.com/bstummer/openskill.lua)

## Install

Drop the `openskill` module into your `package.path` (e.g. via
[LuaRocks](https://luarocks.org/) or by vendoring the source).

```bash
luarocks install openskill
```

## Idiomatic usage

```lua
local openskill = require("openskill")

-- 1. Create ratings
local a1 = openskill.rating()                             -- mu=25, sigma=8.333...
local a2 = openskill.rating({ mu = 32.444, sigma = 5.123 })
local b1 = openskill.rating({ mu = 43.381, sigma = 2.421 })
local b2 = openskill.rating({ mu = 25.188, sigma = 6.211 })

-- 2. Team A beats Team B (first team listed wins by default)
local updated = openskill.rate({ { a1, a2 }, { b1, b2 } })
local a1n, a2n = updated[1][1], updated[1][2]
local b1n, b2n = updated[2][1], updated[2][2]

-- 3. Single-number ranking via ordinal
local board = { a1n, a2n, b1n, b2n }
table.sort(board, function(x, y)
  return openskill.ordinal(x) > openskill.ordinal(y)
end)

for _, r in ipairs(board) do
  print(string.format("mu=%.3f sigma=%.3f", r.mu, r.sigma))
end

-- 4. Predictions
local win_probs = openskill.predictWin({ { a1n, a2n }, { b1n, b2n } })
local draw_prob = openskill.predictDraw({ { a1n, a2n }, { b1n, b2n } })
```

## Free-for-all with explicit ranks

```lua
local openskill = require("openskill")

local teams = {}
for i = 1, 4 do
  teams[i] = { openskill.rating() }
end

-- P2 won, P4 second, P3 third, P1 last
local updated = openskill.rate(teams, { rank = { 4, 1, 3, 2 } })
```

## Choosing a model

```lua
local openskill = require("openskill")
local models    = require("openskill.models")

local updated = openskill.rate(
  { { openskill.rating() }, { openskill.rating() } },
  { model = models.bradleyTerryFull }
)
```
