import { teamRating, utilA } from '../../util'
import { rating } from '../..'

describe('util#utilA', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('utilA computes as expected', () => {
    expect.assertions(1)
    const teamRatings = teamRating([team1, team2])
    const a = utilA(teamRatings)
    expect(a).toStrictEqual({
      1: 1,
      2: 1,
    })
  })
})
