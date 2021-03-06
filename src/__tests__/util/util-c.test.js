import util from '../../util'
import { rating } from '../..'

describe('util#utilC', () => {
  const { utilC, teamRating } = util({})
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('utilC computes as expected', () => {
    expect.assertions(1)
    const teamRatings = teamRating([team2, team1])
    const c = utilC(teamRatings)
    expect(c).toBeCloseTo(15.590239)
  })

  it('utilSumQ computes 5v5', () => {
    expect.assertions(1)
    const teamRatings = teamRating([
      [r, r, r, r, r],
      [r, r, r, r, r],
    ])
    const c = utilC(teamRatings)
    expect(c).toBeCloseTo(27.003)
  })
})
