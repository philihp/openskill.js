import { rate, rating } from '../..'
import { bradleyTerryPart } from '..'

// numbers in this test suite come from rank-1.02 based on 3 FFA games:
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
    const [[p01], [p11], [p21], [p31], [p41]] = rate(
      [[p00], [p10], [p20], [p30], [p40]],
      {
        model,
        score: [9, 7, 7, 5, 5],
      }
    )
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

    expect(p03.mu).toBeCloseTo(27.303389976)
    expect(p03.sigma).toBeCloseTo(7.786799495)
    expect(p13.mu).toBeCloseTo(25.349369733)
    expect(p13.sigma).toBeCloseTo(7.097135632)
    expect(p23.mu).toBeCloseTo(22.388557102)
    expect(p23.sigma).toBeCloseTo(6.9235932)
    expect(p33.mu).toBeCloseTo(22.414946624)
    expect(p33.sigma).toBeCloseTo(7.540451289)
    expect(p43.mu).toBeCloseTo(27.834104352)
    expect(p43.sigma).toBeCloseTo(7.80374707)
  })
})
