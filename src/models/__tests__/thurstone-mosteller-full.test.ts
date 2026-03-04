import { rating } from '../..'
import rate from '../thurstone-mosteller-full'

describe('thurstoneMostellerFull', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]
  const team3 = [r, r, r]

  it('solo game does not change rating', () => {
    expect.assertions(1)
    expect(rate([team1])).toStrictEqual([team1])
  })

  it('2p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1])).toStrictEqual([
      [{ mu: 29.205246334857588, sigma: 7.632833420130952 }],
      [{ mu: 20.794753665142412, sigma: 7.632833420130952 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 33.410492669715175, sigma: 6.861184124806115 }],
      [{ mu: 25, sigma: 6.861184124806115 }],
      [{ mu: 16.589507330284825, sigma: 6.861184124806115 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 37.61573900457276, sigma: 5.990955614049813 }],
      [{ mu: 29.205246334857588, sigma: 5.990955614049813 }],
      [{ mu: 20.794753665142412, sigma: 5.990955614049813 }],
      [{ mu: 12.384260995427237, sigma: 5.990955614049813 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 41.82098533943035, sigma: 4.970638866839803 }],
      [{ mu: 33.410492669715175, sigma: 4.970638866839803 }],
      [{ mu: 25, sigma: 4.970638866839803 }],
      [{ mu: 16.589507330284825, sigma: 4.970638866839803 }],
      [{ mu: 8.17901466056965, sigma: 4.970638866839803 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.72407717049428, sigma: 8.154234193613432 },
        { mu: 25.72407717049428, sigma: 8.154234193613432 },
        { mu: 25.72407717049428, sigma: 8.154234193613432 },
      ],
      [{ mu: 34.00108396884494, sigma: 7.757937033019593 }],
      [
        { mu: 15.274838860660779, sigma: 7.3733815675445085 },
        { mu: 15.274838860660779, sigma: 7.3733815675445085 },
      ],
    ])
  })

  it('can use a custom gamma with k=2', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1], {
        gamma: (_, k) => 1 / k,
      })
    ).toStrictEqual([
      [{ mu: 29.205246334857588, sigma: 7.784759481252749 }],
      [{ mu: 20.794753665142412, sigma: 7.784759481252749 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], {
        gamma: (_, k) => 1 / k,
      })
    ).toStrictEqual([
      [{ mu: 41.82098533943035, sigma: 7.436215544405679 }],
      [{ mu: 33.410492669715175, sigma: 7.436215544405679 }],
      [{ mu: 25, sigma: 7.436215544405679 }],
      [{ mu: 16.589507330284825, sigma: 7.436215544405679 }],
      [{ mu: 8.17901466056965, sigma: 7.436215544405679 }],
    ])
  })

  it('works with ties in ranks', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], {
        rank: [1, 2, 2, 4, 5],
      })
    ).toStrictEqual([
      [{ mu: 41.82098533943035, sigma: 4.970638866839803 }],
      [{ mu: 29.20528633485759, sigma: 4.280577057550792 }],
      [{ mu: 29.20528633485759, sigma: 4.280577057550792 }],
      [{ mu: 16.589507330284825, sigma: 4.970638866839803 }],
      [{ mu: 8.17901466056965, sigma: 4.970638866839803 }],
    ])
  })
})
