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
