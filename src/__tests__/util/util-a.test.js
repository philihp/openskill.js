import util, { utilA } from '../../util'
import { rating } from '../..'

describe('util#utilA', () => {
  const { teamRating } = util({})
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]
  const team3 = [r, r]
  const team4 = [r]

  it('utilA computes as expected', () => {
    expect.assertions(1)
    const teamRatings = teamRating([team1, team2])
    const a = utilA(teamRatings)
    expect(a).toStrictEqual([1, 1])
  })

  it('counts 1 team per rank', () => {
    expect.assertions(1)
    const teamRatings = teamRating([team1, team2, team3, team4])
    const a = utilA(teamRatings)
    expect(a).toStrictEqual([1, 1, 1, 1])
  })

  it('counts how many teams share that rank', () => {
    expect.assertions(1)
    const options = { rank: [1, 1, 1, 4] }
    const { teamRating: rankedTeamRating } = util(options)
    const teamRatings = rankedTeamRating([team1, team2, team3, team4])
    const a = utilA(teamRatings)
    expect(a).toStrictEqual([3, 3, 3, 1])
  })
})
