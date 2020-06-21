import { teamRating, utilC, utilSumQ } from '../../util'
import { rating } from '../..'

describe('util#utilSumQ', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('utilSumQ computes as expected', () => {
    const teamRatings = teamRating([team1, team2])
    const c = utilC(teamRatings)
    const sumQ = utilSumQ(teamRatings, c)
    expect(sumQ).toEqual({
      1: 29.67892702634643,
      2: 24.70819334370875,
    })
  })
})
