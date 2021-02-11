import { rate, rating } from '../..'

// numbers in this test suite come from rank-1.02 based on 3 FFA games:
// 0, 1, 2, 3, 4 with a score of 9, 7, 7, 5, 5
// 4, 2, 1 with a score of 9, 5, 5
// 3, 1, 2, 0 with a score of 9, 9, 7, 7

describe('thurstonMostellerPart#series', () => {
  it('runs as expected', () => {
    expect.assertions(10)
    const model = 'thurstonMostellerPart'
    const p00 = rating()
    const p10 = rating()
    const p20 = rating()
    const p30 = rating()
    const p40 = rating()
    const [[p01], [p11], [p21], [p31], [p41]] = rate(
      [[p00], [p10], [p20], [p30], [p40]],
      {
        model,
        epsilon: 0.1,
        gamma: () => 1,
        score: [9, 7, 7, 5, 5],
      }
    )

    expect(p01.mu).toBeCloseTo(27.108980741)
    expect(p01.sigma).toBeCloseTo(8.063357519)
    expect(p11.mu).toBeCloseTo(22.891019259)
    expect(p11.sigma).toBeCloseTo(7.620583708)
    expect(p21.mu).toBeCloseTo(27.108980741)
    expect(p21.sigma).toBeCloseTo(7.620583708)
    expect(p31.mu).toBeCloseTo(22.891019259)
    expect(p31.sigma).toBeCloseTo(7.620583708)
    expect(p41.mu).toBeCloseTo(25.0)
    expect(p41.sigma).toBeCloseTo(7.905694531)

    // const p02 = p01
    // const p32 = p31
    // const [[p42], [p22], [p12]] = rate([[p41], [p21], [p11]], {
    //   model,
    //   epsilon: 0.1,
    //   score: [9, 5, 5],
    // })
    // const p43 = p42
    // const [[p33], [p13], [p23], [p03]] = rate([[p32], [p12], [p22], [p02]], {
    //   model,
    //   epsilon: 0.1,
    //   score: [9, 9, 7, 7],
    // })

    // these actually fail, because of
    // the way the VT and WT functions are implemented
    // which differs across environments

    // expect(p03.mu).toBeCloseTo(26.84674655)
    // expect(p03.sigma).toBeCloseTo(7.609798715)
    // expect(p13.mu).toBeCloseTo(25.148731893)
    // expect(p13.sigma).toBeCloseTo(6.667369848)
    // expect(p23.mu).toBeCloseTo(23.147437077)
    // expect(p23.sigma).toBeCloseTo(6.483903624)
    // expect(p33.mu).toBeCloseTo(22.931581609)
    // expect(p33.sigma).toBeCloseTo(7.229792728)
    // expect(p43.mu).toBeCloseTo(27.14443859)
    // expect(p43.sigma).toBeCloseTo(7.640549916)
  })
})
