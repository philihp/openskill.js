import { readFileSync } from 'node:fs'
import { describe, it, expect } from '#test-helpers'
import { rate, Model, Rating } from '..'
import plackettLuce from '../models/plackett-luce'
import bradleyTerryFull from '../models/bradley-terry-full'
import bradleyTerryPart from '../models/bradley-terry-part'
import thurstoneMostellerFull from '../models/thurstone-mosteller-full'
import thurstoneMostellerPart from '../models/thurstone-mosteller-part'

// Full parity with openskill.py's own `test_rate`, asserted against the exact
// fixtures it uses (vendored under ./data — see ./data/README.md). Each scenario
// below feeds openskill.js the identical inputs openskill.py's test_rate feeds
// its models, then asserts the identical published constants.
//
// Upstream tests (one per model), all structured the same:
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L304-L388
//
// Some scenarios are KNOWN DIVERGENCES where openskill.js does not (yet) match
// openskill.py 6.2.0. They are still replicated here, with the upstream
// constants, but skipped and annotated so coverage is complete and the gaps are
// tracked rather than hidden:
//   - `margins`: openskill.js scales the margin post-hoc in rate.ts, whereas
//     openskill.py folds it into each model (a divisor inside the exponent).
//     Different algorithm => diverges for every model.
//   - the "part" models on 3+ teams: openskill.js pairs only adjacent teams
//     (ladderPairs), whereas openskill.py 6.2.0 rewrote them around a sliding
//     `window_size` (default 4). 2-team games still agree.

type PlayerExpect = { mu: number; sigma: number }
type Fixture = {
  model: { mu: number; sigma: number }
} & Record<string, Record<string, PlayerExpect[]>>

const load = (name: string): Fixture =>
  JSON.parse(readFileSync(new URL(`./data/${name}.json`, import.meta.url), 'utf8'))

const MODELS = [
  { key: 'plackettluce', model: plackettLuce, label: 'PlackettLuce' },
  { key: 'bradleyterryfull', model: bradleyTerryFull, label: 'BradleyTerryFull' },
  { key: 'bradleyterrypart', model: bradleyTerryPart, label: 'BradleyTerryPart' },
  { key: 'thurstonemostellerfull', model: thurstoneMostellerFull, label: 'ThurstoneMostellerFull' },
  { key: 'thurstonemostellerpart', model: thurstoneMostellerPart, label: 'ThurstoneMostellerPart' },
] as const

const SCENARIOS = ['normal', 'ranks', 'scores', 'margins', 'limit_sigma', 'ties', 'weights', 'balance'] as const
type Scenario = (typeof SCENARIOS)[number]

// Inputs mirror openskill.py's test_rate exactly; every player starts at the
// model's (mu, sigma), so a team is just a count.
const team = (n: number, mu: number, sigma: number): Rating[] => Array.from({ length: n }, () => ({ mu, sigma }))

const runScenario = (scenario: Scenario, model: Model, mu: number, sigma: number): Rating[][] => {
  const t = (n: number) => team(n, mu, sigma)
  switch (scenario) {
    case 'normal':
      return rate([t(1), t(2)], { model })
    case 'ranks':
      return rate([t(1), t(2), t(1), t(2)], { model, rank: [2, 1, 4, 3] })
    case 'scores':
      return rate([t(1), t(2)], { model, score: [1, 2] })
    case 'margins':
      return rate([t(2), t(2), t(2), t(2), t(2)], {
        model,
        score: [10, 5, 5, 2, 1],
        margin: 2.0,
        weight: [
          [1, 2],
          [2, 1],
          [1, 2],
          [3, 1],
          [1, 2],
        ],
      })
    case 'limit_sigma':
      return rate([t(1), t(2), t(3)], { model, rank: [2, 1, 3], limitSigma: true })
    case 'ties':
      return rate([t(1), t(2), t(3)], { model, rank: [1, 2, 1] })
    case 'weights':
      return rate([t(3), t(2), t(3), t(2)], {
        model,
        rank: [2, 1, 4, 3],
        weight: [
          [2, 0, 0],
          [1, 2],
          [0, 0, 1],
          [0, 1],
        ],
      })
    case 'balance':
      return rate([t(2), t(2)], { model, rank: [1, 2], balance: true })
  }
}

// Returns the divergence reason, or null when openskill.js matches openskill.py.
const divergence = (modelKey: string, scenario: Scenario): string | null => {
  if (scenario === 'margins') return 'margin applied post-hoc in rate.ts vs in-model divisor'
  if (modelKey.endsWith('part') && ['ranks', 'limit_sigma', 'ties', 'weights'].includes(scenario)) {
    return 'part model pairs only adjacent teams; openskill.py uses a sliding window'
  }
  return null
}

const assertScenario = (got: Rating[][], expected: Record<string, PlayerExpect[]>): void => {
  const teams = Object.keys(expected)
    .sort((a, b) => Number(a.split('_')[1]) - Number(b.split('_')[1]))
    .map((k) => expected[k])
  expect(got.length).toBe(teams.length)
  teams.forEach((players, i) => {
    players.forEach((player, j) => {
      // toBeCloseTo(_, 10) => tolerance 5e-11; the worst observed drift is ~1e-15
      // (one ULP, Thurstone-Mosteller only). Everything else is bit-for-bit.
      expect(got[i][j].mu).toBeCloseTo(player.mu, 10)
      expect(got[i][j].sigma).toBeCloseTo(player.sigma, 10)
    })
  })
}

describe('Weng-Lin parity with openskill.py 6.2.0', () => {
  for (const { key, model, label } of MODELS) {
    const fixture = load(key)
    const { mu, sigma } = fixture.model
    describe(label, () => {
      for (const scenario of SCENARIOS) {
        const reason = divergence(key, scenario)
        const check = () => assertScenario(runScenario(scenario, model, mu, sigma), fixture[scenario])
        if (reason) {
          it.skip(`${scenario} [KNOWN DIVERGENCE: ${reason}]`, check)
        } else {
          it(scenario, check)
        }
      }
    })
  }
})

// openskill.py also unit-tests the weight_bounds option per model. These are
// model-agnostic in openskill.js (normalization happens in rate() before the
// model runs) and use 2-team games, so every model — including the "part"
// models — matches. Replicating test_weight_bounds_{default,custom,none}:
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L585-L640
describe('weight_bounds parity with openskill.py 6.2.0', () => {
  for (const { model, label } of MODELS) {
    describe(label, () => {
      const t = (n: number) => team(n, 25, 25 / 3)
      const weight = [
        [0.5, 1, 2],
        [1, 1, 1],
      ]

      // test_weight_bounds_default: the default bounds are (1.0, 2.0).
      it('defaults to [1, 2]', () => {
        const teams = [t(3), t(3)]
        expect(rate(teams, { model, rank: [1, 2], weight })).toStrictEqual(
          rate(teams, { model, rank: [1, 2], weight, weightBounds: [1, 2] })
        )
      })

      // test_weight_bounds_custom: narrower bounds => smaller within-team spread.
      it('narrower bounds shrink the within-team spread', () => {
        const teams = [t(3), t(3)]
        const wide = rate(teams, { model, rank: [1, 2], weight, weightBounds: [1, 2] })
        const narrow = rate(teams, { model, rank: [1, 2], weight, weightBounds: [0.9, 1.1] })
        expect(narrow[0][2].mu - narrow[0][0].mu).toBeLessThan(wide[0][2].mu - wide[0][0].mu)
      })

      // test_weight_bounds_none_disables_normalization: with normalization off,
      // uniform raw weights leave every winner with the same mu change.
      it('weightBounds: null applies raw weights (uniform => equal updates)', () => {
        const result = rate([t(3), t(3)], {
          model,
          rank: [1, 2],
          weight: [
            [1, 1, 1],
            [1, 1, 1],
          ],
          weightBounds: null,
        })
        expect(result[0][0].mu).toBeCloseTo(result[0][1].mu, 12)
        expect(result[0][1].mu).toBeCloseTo(result[0][2].mu, 12)
      })
    })
  }
})
