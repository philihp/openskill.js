import { describe, it, expect } from '#test-helpers'
import { rate, rating } from '../..'
import { bradleyTerryPart } from '..'

// these games were first checked against rank-1.02, which paired only adjacent
// teams and summed their updates. The numbers are now regression values for the
// sliding window (default 4) that averages the updates, as openskill.py 6.2.0
// does. The 3 FFA games:
// 0, 1, 2, 3, 4 with a score of 9, 7, 7, 5, 5
// 4, 2, 1 with a score of 9, 5, 5
// 3, 1, 2, 0 with a score of 9, 9, 7, 7

describe('bradleyTerryPart#series', () => {
  it('runs as expected', () => {
    expect.assertions(10)
    const model = bradleyTerryPart
    const p00 = rating()
    const p10 = rating()
    const p20 = rating()
    const p30 = rating()
    const p40 = rating()
    const [[p01], [p11], [p21], [p31], [p41]] = rate([[p00], [p10], [p20], [p30], [p40]], {
      model,
      score: [9, 7, 7, 5, 5],
    })
    const p02 = p01
    const p32 = p31
    const [[p42], [p22], [p12]] = rate([[p41], [p21], [p11]], {
      model,
      score: [9, 5, 5],
    })
    const p43 = p42
    const [[p33], [p13], [p23], [p03]] = rate([[p32], [p12], [p22], [p02]], {
      model,
      score: [9, 9, 7, 7],
    })

    expect(p03.mu).toBeCloseTo(25.559581717)
    expect(p03.sigma).toBeCloseTo(7.811686624)
    expect(p13.mu).toBeCloseTo(25.944312054)
    expect(p13.sigma).toBeCloseTo(7.580746582)
    expect(p23.mu).toBeCloseTo(22.714284363)
    expect(p23.sigma).toBeCloseTo(7.580746582)
    expect(p33.mu).toBeCloseTo(24.956651627)
    expect(p33.sigma).toBeCloseTo(7.808990544)
    expect(p43.mu).toBeCloseTo(25.816391073)
    expect(p43.sigma).toBeCloseTo(7.815016512)
  })
})
