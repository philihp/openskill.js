import { teamRating } from '../../util'
import { rating } from '../..'

describe('util#teamRating', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]

  it('teamRating aggregates all players in a team', () => {
    expect.assertions(1)
    const result = teamRating([team1, team2])
    expect(result).toStrictEqual([
      [25, 69.44444444444446, team1, 1],
      [50, 138.8888888888889, team2, 2],
    ])
  })
})
