import util from '../../util'
import { rating } from '../..'

describe('util#teamRating', () => {
  const { teamRating } = util({})
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('teamRating aggregates all players in a team', () => {
    expect.assertions(1)
    const result = teamRating([team1, team2])
    expect(result).toStrictEqual([
      [25, 69.44444444444446, team1, 0],
      [50, 138.8888888888889, team2, 1],
    ])
  })

  it('teamRating aggregates 5 v 5 teams', () => {
    expect.assertions(4)
    const result = teamRating([
      [r, r, r, r, r],
      [r, r, r, r, r],
    ])
    expect(result[0][0]).toBeCloseTo(125)
    expect(result[1][0]).toBeCloseTo(125)
    expect(result[0][1]).toBeCloseTo(347.22)
    expect(result[1][1]).toBeCloseTo(347.22)
  })
})

describe('util#teamRating with balance', () => {
  const weak = rating({ mu: 25, sigma: 25 / 3 }) // ordinal: 0
  const strong = rating({ mu: 40, sigma: 5 }) // ordinal: 25

  it('balance=false behaves identically to default', () => {
    expect.assertions(2)
    const { teamRating: tr } = util({ balance: false })
    const result = tr([[weak, strong], [weak]])
    // plain sum: mu=65, sigma^2=69.44+25=94.44
    expect(result[0][0]).toBeCloseTo(65)
    expect(result[0][1]).toBeCloseTo(94.44)
  })

  it('balance=true amplifies weaker players contribution', () => {
    expect.assertions(2)
    const { teamRating: tr } = util({ balance: true })
    const result = tr([[weak, strong], [weak]])
    // weak player (ordinal=0) gets weight ~2, strong (ordinal=25) gets weight 1
    expect(result[0][0]).toBeCloseTo(90)
    expect(result[0][1]).toBeCloseTo(302.78)
  })

  it('balance=true with equal players is same as default', () => {
    expect.assertions(2)
    const { teamRating: tr } = util({ balance: true })
    const r = rating()
    const result = tr([[r, r], [r]])
    // all ordinals equal => all weights = 1 => same as no balance
    expect(result[0][0]).toBeCloseTo(50)
    expect(result[0][1]).toBeCloseTo(138.89)
  })
})
