import { teamRating, utilC } from '../../util'
import { rating } from '../..'

describe('util#utilC', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('utilC computes as expected', () => {
    const teamRatings = teamRating([team2, team1])
    const c = utilC(teamRatings)
    expect(c).toBeCloseTo(15.590239)
  })
})
