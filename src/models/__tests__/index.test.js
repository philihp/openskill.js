import { rate, rating } from '../..'

// numbers in this test suite come from rank-1.02 on a 3-way
// these differ in that it uses an epsilon of 0.1

describe('models#index', () => {
  const r = rating()
  it('runs BT full', () => {
    expect.assertions(6)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'bradleyTerryFull',
      epsilon: 0.1,
    })
    expect(a.mu).toBeCloseTo(30.270462767)
    expect(b.mu).toBeCloseTo(25.0)
    expect(c.mu).toBeCloseTo(19.729537233)
    expect(a.sigma).toBeCloseTo(7.788474808)
    expect(b.sigma).toBeCloseTo(7.788474808)
    expect(c.sigma).toBeCloseTo(7.788474808)
  })
  it('runs BT partial', () => {
    expect.assertions(6)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'bradleyTerryPart',
      epsilon: 0.1,
    })
    expect(a.mu).toBeCloseTo(27.635231383)
    expect(b.mu).toBeCloseTo(25.0)
    expect(c.mu).toBeCloseTo(22.364768617)
    expect(a.sigma).toBeCloseTo(8.065506316)
    expect(b.sigma).toBeCloseTo(7.788474808)
    expect(c.sigma).toBeCloseTo(8.065506316)
  })
  it('runs PL', () => {
    expect.assertions(6)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'plackettLuce',
      epsilon: 0.1,
    })
    expect(a.mu).toBeCloseTo(27.8689)
    expect(b.mu).toBeCloseTo(25.7172)
    expect(c.mu).toBeCloseTo(21.4139)
    expect(a.sigma).toBeCloseTo(8.2048)
    expect(b.sigma).toBeCloseTo(8.0578)
    expect(c.sigma).toBeCloseTo(8.0578)
  })
  it('runs TM full', () => {
    expect.assertions(6)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'thurstonMostellerFull',
      epsilon: 0.1,
    })
    expect(a.mu).toBeCloseTo(33.461437)
    expect(b.mu).toBeCloseTo(25.0)
    expect(c.mu).toBeCloseTo(16.538563)
    expect(a.sigma).toBeCloseTo(6.856959)
    expect(b.sigma).toBeCloseTo(6.856959)
    expect(c.sigma).toBeCloseTo(6.856959)
  })
  it('runs TM partial', () => {
    expect.assertions(6)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'thurstonMostellerPart',
      epsilon: 0.1,
      gamma: () => 1, // this is how it is in the source from Weng-Lin... mistake?
    })
    expect(a.mu).toBeCloseTo(27.108981)
    expect(b.mu).toBeCloseTo(25.0)
    expect(c.mu).toBeCloseTo(22.891019)
    expect(a.sigma).toBeCloseTo(8.0633358)
    expect(b.sigma).toBeCloseTo(7.784024)
    expect(c.sigma).toBeCloseTo(8.063358)
  })
})
