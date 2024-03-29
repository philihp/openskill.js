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
      [{ mu: 29.20524620886059, sigma: 7.632833464033909 }],
      [{ mu: 20.79475379113941, sigma: 7.632833464033909 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 33.41049241772118, sigma: 6.861184222487201 }],
      [{ mu: 25, sigma: 6.861184222487201 }],
      [{ mu: 16.58950758227882, sigma: 6.861184222487201 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 37.61573862658177, sigma: 5.99095578185474 }],
      [{ mu: 29.20524620886059, sigma: 5.99095578185474 }],
      [{ mu: 20.79475379113941, sigma: 5.99095578185474 }],
      [{ mu: 12.38426137341823, sigma: 5.99095578185474 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 41.82098483544236, sigma: 4.970639136506507 }],
      [{ mu: 33.41049241772118, sigma: 4.970639136506507 }],
      [{ mu: 25, sigma: 4.970639136506507 }],
      [{ mu: 16.58950758227882, sigma: 4.970639136506507 }],
      [{ mu: 8.17901516455764, sigma: 4.970639136506507 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.72407717517514, sigma: 8.154234192355084 },
        { mu: 25.72407717517514, sigma: 8.154234192355084 },
        { mu: 25.72407717517514, sigma: 8.154234192355084 },
      ],
      [{ mu: 34.0010841338675, sigma: 7.7579369709569805 }],
      [
        { mu: 15.274838690957358, sigma: 7.373381474061001 },
        { mu: 15.274838690957358, sigma: 7.373381474061001 },
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
      [{ mu: 29.20524620886059, sigma: 7.784759515283723 }],
      [{ mu: 20.79475379113941, sigma: 7.784759515283723 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], {
        gamma: (_, k) => 1 / k,
      })
    ).toStrictEqual([
      [{ mu: 41.82098483544236, sigma: 7.436215601407348 }],
      [{ mu: 33.41049241772118, sigma: 7.436215601407348 }],
      [{ mu: 25, sigma: 7.436215601407348 }],
      [{ mu: 16.58950758227882, sigma: 7.436215601407348 }],
      [{ mu: 8.17901516455764, sigma: 7.436215601407348 }],
    ])
  })

  it('works with ties in ranks', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], {
        rank: [1, 2, 2, 4, 5],
      })
    ).toStrictEqual([
      [{ mu: 41.82098483544236, sigma: 4.970639136506507 }],
      [{ mu: 29.205286208860592, sigma: 4.270361249811069 }],
      [{ mu: 29.205286208860592, sigma: 4.270361249811069 }],
      [{ mu: 16.58950758227882, sigma: 4.970639136506507 }],
      [{ mu: 8.17901516455764, sigma: 4.970639136506507 }],
    ])
  })
})
