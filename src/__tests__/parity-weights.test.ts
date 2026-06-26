import { describe, it, expect } from '#test-helpers'
import { rate, rating } from '..'
import bradleyTerryFull from '../models/bradley-terry-full'
import bradleyTerryPart from '../models/bradley-terry-part'
import thurstoneMostellerFull from '../models/thurstone-mosteller-full'
import thurstoneMostellerPart from '../models/thurstone-mosteller-part'

// Partial-play weight parity with openskill==6.2.0 (Python). Weights default to
// per-team normalization into [1, 2] (weight_bounds=(1.0, 2.0)), so only the
// relative contribution of players within a team affects their update. Every
// scenario below is bit-for-bit identical between the two libraries.
//
// Upstream equivalent — the `weights` case of `test_rate` in openskill.py:
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L373-L378

describe('weighted partial-play parity with openskill.py 6.x', () => {
  // Fixtures are created once and shared across every test on purpose: rate() and
  // the models must not mutate their inputs. If one ever did, the corruption
  // would surface in a later test here instead of being hidden behind freshly
  // constructed objects each run.
  const a = rating()
  const b = rating()
  const c = rating()
  const d = rating()
  const e = rating()
  const f = rating()
  const doubles = [
    [a, b],
    [c, d],
  ]
  const weight = [
    [0.9, 1.0],
    [1.0, 0.6],
  ]

  it('matches Python for Plackett-Luce', () => {
    expect.assertions(1)
    expect(rate(doubles, { weight })).toStrictEqual([
      [
        { mu: 26.964294621803063, sigma: 8.177962604389991 },
        { mu: 28.928589243606122, sigma: 8.019149320764225 },
      ],
      [
        { mu: 24.01785268909847, sigma: 8.256223750834579 },
        { mu: 23.035705378196937, sigma: 8.177962604389991 },
      ],
    ])
  })

  it('matches Python for Bradley-Terry Full', () => {
    expect.assertions(1)
    expect(rate(doubles, { weight, model: bradleyTerryFull })).toStrictEqual([
      [
        { mu: 26.964294621803063, sigma: 8.177962604389991 },
        { mu: 28.928589243606122, sigma: 8.019149320764225 },
      ],
      [
        { mu: 24.01785268909847, sigma: 8.256223750834579 },
        { mu: 23.035705378196937, sigma: 8.177962604389991 },
      ],
    ])
  })

  it('matches Python for Bradley-Terry Part', () => {
    expect.assertions(1)
    expect(rate(doubles, { weight, model: bradleyTerryPart })).toStrictEqual([
      [
        { mu: 26.964294621803063, sigma: 8.177962604389991 },
        { mu: 28.928589243606122, sigma: 8.019149320764225 },
      ],
      [
        { mu: 24.01785268909847, sigma: 8.256223750834579 },
        { mu: 23.035705378196937, sigma: 8.177962604389991 },
      ],
    ])
  })

  it('matches Python for Thurstone-Mosteller Full', () => {
    expect.assertions(1)
    expect(rate(doubles, { weight, model: thurstoneMostellerFull })).toStrictEqual([
      [
        { mu: 28.14872165539316, sigma: 7.93021870036415 },
        { mu: 31.29744331078632, sigma: 7.505021544427547 },
      ],
      [
        { mu: 23.42563917230342, sigma: 8.134487000558 },
        { mu: 21.85127834460684, sigma: 7.93021870036415 },
      ],
    ])
  })

  it('matches Python for Thurstone-Mosteller Part', () => {
    expect.assertions(1)
    expect(rate(doubles, { weight, model: thurstoneMostellerPart })).toStrictEqual([
      [
        { mu: 26.570818879381463, sigma: 8.284431340872874 },
        { mu: 28.141637758762926, sigma: 8.234817326108974 },
      ],
      [
        { mu: 24.21459056030927, sigma: 8.309127256533191 },
        { mu: 23.429181120618537, sigma: 8.284431340872874 },
      ],
    ])
  })

  it('reorders weights with ranks so they stay aligned with their teams', () => {
    expect.assertions(1)
    // Teams given out of finishing order; weights must follow each team through
    // the internal rank-sort. Bit-for-bit identical to openskill.py.
    const result = rate([[a, b], [c], [d, e, f]], {
      rank: [2, 1, 3],
      weight: [[0.5, 1.0], [1.0], [0.2, 1.0, 0.7]],
    })
    expect(result).toStrictEqual([
      [
        { mu: 26.724277243729713, sigma: 8.21346376041861 },
        { mu: 28.448554487459425, sigma: 8.09138955918764 },
      ],
      [{ mu: 30.964851089805897, sigma: 8.302664107675781 }],
      [
        { mu: 20.29329721136734, sigma: 8.171929968920235 },
        { mu: 22.64664860568367, sigma: 8.253236586510337 },
        { mu: 22.103567514687594, sigma: 8.234544776451207 },
      ],
    ])
  })
})
