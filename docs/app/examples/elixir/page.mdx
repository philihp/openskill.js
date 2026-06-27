# Elixir

> [github.com/philihp/openskill.ex](https://github.com/philihp/openskill.ex)

The Elixir port keeps with Elixir conventions: ratings are plain `{mu,
sigma}` tuples, and everything goes through the `Openskill` module. No
mutable state.

## Install

```elixir
# mix.exs
def deps do
  [
    {:openskill, "~> 0.3"}
  ]
end
```

## Idiomatic usage

```elixir
# 1. Create ratings — a Rating is just {mu, sigma}
a1 = Openskill.rating()                   # {25.0, 8.333...}
a2 = Openskill.rating(32.444, 5.123)
b1 = Openskill.rating(43.381, 2.421)
b2 = Openskill.rating(25.188, 6.211)

# 2. Team A beats Team B (first team listed wins by default)
[[a1n, a2n], [b1n, b2n]] = Openskill.rate([[a1, a2], [b1, b2]])

# 3. Sort a leaderboard by ordinal
[a1n, a2n, b1n, b2n]
|> Enum.sort_by(&Openskill.ordinal/1, :desc)
|> Enum.each(fn {mu, sigma} ->
  IO.puts("mu=#{Float.round(mu, 3)} sigma=#{Float.round(sigma, 3)}")
end)

# 4. Predictions
{:ok, win_probs} = Openskill.predict_win([[a1n, a2n], [b1n, b2n]])
{:ok, draw_prob} = Openskill.predict_draw([[a1n, a2n], [b1n, b2n]])
```

## Free-for-all with explicit ranks

```elixir
players = for _ <- 1..4, do: Openskill.rating()
teams   = Enum.map(players, &[&1])

# P2 won, P4 second, P3 third, P1 last
updated = Openskill.rate(teams, rank: [4, 1, 3, 2])
```

## Choosing a model

```elixir
updated =
  Openskill.rate(
    [[Openskill.rating()], [Openskill.rating()]],
    model: Openskill.BradleyTerryFull
  )
```
