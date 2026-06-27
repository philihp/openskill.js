import { describe, it, expect } from '#test-helpers'
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
      [{ mu: 29.230718708993216, sigma: 7.630934718709003 }],
      [{ mu: 20.769281291006784, sigma: 7.630934718709003 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 33.46143741798643, sigma: 6.856958868037088 }],
      [{ mu: 25, sigma: 6.856958868037088 }],
      [{ mu: 16.53856258201357, sigma: 6.856958868037088 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 37.69215612697965, sigma: 5.983694941648218 }],
      [{ mu: 29.230718708993216, sigma: 5.983694941648218 }],
      [{ mu: 20.769281291006784, sigma: 5.983694941648218 }],
      [{ mu: 12.307843873020353, sigma: 5.983694941648218 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 41.92287483597286, sigma: 4.958964145006544 }],
      [{ mu: 33.46143741798643, sigma: 4.958964145006544 }],
      [{ mu: 25, sigma: 4.958964145006544 }],
      [{ mu: 16.53856258201357, sigma: 4.958964145006544 }],
      [{ mu: 8.077125164027137, sigma: 4.958964145006544 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.729796801442728, sigma: 8.153169236399172 },
        { mu: 25.729796801442728, sigma: 8.153169236399172 },
        { mu: 25.729796801442728, sigma: 8.153169236399172 },
      ],
      [{ mu: 34.02513843037207, sigma: 7.757460494129447 }],
      [
        { mu: 15.245064768185204, sigma: 7.372121080126496 },
        { mu: 15.245064768185204, sigma: 7.372121080126496 },
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
      [{ mu: 29.230718708993216, sigma: 7.783287764262074 }],
      [{ mu: 20.769281291006784, sigma: 7.783287764262074 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], {
        gamma: (_, k) => 1 / k,
      })
    ).toStrictEqual([
      [{ mu: 41.92287483597286, sigma: 7.433750251887136 }],
      [{ mu: 33.46143741798643, sigma: 7.433750251887136 }],
      [{ mu: 25, sigma: 7.433750251887136 }],
      [{ mu: 16.53856258201357, sigma: 7.433750251887136 }],
      [{ mu: 8.077125164027137, sigma: 7.433750251887136 }],
    ])
  })

  it('works with ties in ranks', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], {
        rank: [1, 2, 2, 4, 5],
      })
    ).toStrictEqual([
      [{ mu: 41.92287483597286, sigma: 4.958964145006544 }],
      [{ mu: 29.230718708993216, sigma: 4.270448833386869 }],
      [{ mu: 29.230718708993216, sigma: 4.270448833386869 }],
      [{ mu: 16.53856258201357, sigma: 4.958964145006544 }],
      [{ mu: 8.077125164027137, sigma: 4.958964145006544 }],
    ])
  })
})
