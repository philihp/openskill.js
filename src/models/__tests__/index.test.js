import { rate, rating } from '../..'

describe('models#index', () => {
  const r = rating()
  it('runs TM full', () => {
    expect.assertions(1)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'thurstonMostellerFull',
    })
    expect([a, b, c]).toStrictEqual([
      { mu: 33.41049241772118, sigma: 6.861184222487201 },
      { mu: 25, sigma: 6.861184222487201 },
      { mu: 16.58950758227882, sigma: 6.861184222487201 },
    ])
  })
  it('runs TM partial', () => {
    expect.assertions(1)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'thurstonMostellerPart',
    })
    expect([a, b, c]).toStrictEqual([
      { mu: 29.20524620886059, sigma: 7.632833464033909 },
      { mu: 25, sigma: 6.861184222487201 },
      { mu: 20.79475379113941, sigma: 7.632833464033909 },
    ])
  })
  it('runs BT full', () => {
    expect.assertions(1)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'bradleyTerryFull',
    })
    expect([a, b, c]).toStrictEqual([
      { mu: 30.2704627669473, sigma: 7.788474807872566 },
      { mu: 25, sigma: 7.788474807872566 },
      { mu: 19.7295372330527, sigma: 7.788474807872566 },
    ])
  })
  it('runs BT partial', () => {
    expect.assertions(1)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'bradleyTerryPart',
    })
    expect([a, b, c]).toStrictEqual([
      { mu: 27.63523138347365, sigma: 8.065506316323548 },
      { mu: 25, sigma: 7.788474807872566 },
      { mu: 22.36476861652635, sigma: 8.065506316323548 },
    ])
  })
  it('runs PL', () => {
    expect.assertions(1)
    const [[a], [b], [c]] = rate([[r], [r], [r]], {
      model: 'plackettLuce',
    })
    expect([a, b, c]).toStrictEqual([
      { mu: 27.868876552746237, sigma: 8.204837030780652 },
      { mu: 25.717219138186557, sigma: 8.057829747583874 },
      { mu: 21.413904309067206, sigma: 8.057829747583874 },
    ])
  })
})
