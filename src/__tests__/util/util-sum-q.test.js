import { teamRating, utilC, utilSumQ } from '../../util'
import { rating } from '../..'

describe('util#utilSumQ', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('utilSumQ computes as expected', () => {
    expect.assertions(1)
    const teamRatings = teamRating([team1, team2])
    const c = utilC(teamRatings)
    const sumQ = utilSumQ(teamRatings, c)
    expect(sumQ).toStrictEqual({
      0: 29.67892702634643,
      1: 24.70819334370875,
    })
  })
})
