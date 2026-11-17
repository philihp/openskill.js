/* oxlint-disable typescript/no-unused-vars */
// Type-level checks for the examples on the "Custom models" docs page
// (docs/app/models/custom/page.mdx). If you change an example there, change
// it here too. `npm run typecheck` fails if the public types stop accepting it.
import { mergeRight, sum } from 'ramda'
import { rate, rating } from '../index'
import type { Gamma, Model, Options, Rating } from '../index'
import { plackettLuce } from '../models'

type Expect<T extends true> = T
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false

// --- Example 1: a custom gamma ---------------------------------------------

// Shrink sigma at half the default speed.
const slowGamma: Gamma = (c, _k, _mu, sigmaSq) => Math.sqrt(sigmaSq) / c / 2

// --- Example 2: a built-in model with fixed options ------------------------

const slowPlackettLuce: Model = (teams, options = {}) => plackettLuce(teams, mergeRight(options, { gamma: slowGamma }))

// --- Example 3: a model from the start -------------------------------------

const elo: Model = (teams, { beta = 25 / 6, rank = teams.map((_, i) => i) }: Options = {}) => {
  const K = 2
  const mus = teams.map((team) => sum(team.map(({ mu }) => mu)))
  return teams.map((team, i) => {
    const change = sum(
      mus.map((qMu, q) => {
        if (q === i) return 0
        // 1 for a win, 0 for a loss, 0.5 for a tie. A lower rank is better.
        const actual = rank[i] < rank[q] ? 1 : rank[i] > rank[q] ? 0 : 0.5
        // The chance that team i wins against team q.
        const expected = 1 / (1 + Math.exp((qMu - mus[i]) / beta))
        return K * (actual - expected)
      })
    )
    return team.map(({ mu, sigma }) => ({ mu: mu + change, sigma }))
  })
}

// --- Usage -----------------------------------------------------------------

const a = rating()
const b = rating()
const c = rating()

const withGamma = rate([[a], [b]], { gamma: slowGamma })
type _withGamma = Expect<Equal<typeof withGamma, [[Rating], [Rating]]>>

const withWrapped = rate([[a, b], [c]], { model: slowPlackettLuce })
type _withWrapped = Expect<Equal<typeof withWrapped, [[Rating, Rating], [Rating]]>>

const withElo = rate([[a], [b], [c]], { model: elo, rank: [2, 1, 3] })
type _withElo = Expect<Equal<typeof withElo, [[Rating], [Rating], [Rating]]>>

// Every built-in model is a Model, so the type in the docs is the correct type.
const builtIn: Model = plackettLuce

// A Gamma must return a number.
// @ts-expect-error gamma returns a string
const badGamma: Gamma = () => 'fast'

// A Model must return teams of ratings.
// @ts-expect-error model returns numbers, not teams
const badModel: Model = (teams) => teams.map(() => 0)
