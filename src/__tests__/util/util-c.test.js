import { teamRating, UTIL_C } from '../../util'
import { rating } from '../..'

describe('util#utilC', () => {
  const utilC = UTIL_C({})
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('utilC computes as expected', () => {
    expect.assertions(1)
    const teamRatings = teamRating([team2, team1])
    const c = utilC(teamRatings)
    expect(c).toBeCloseTo(15.590239)
  })
})
