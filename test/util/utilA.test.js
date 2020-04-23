import test from 'ava'
import { teamRating, utilA } from '../../src/util'
import { rating } from '../../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]

test('utilA computes as expected', (t) => {
  const teamRatings = teamRating([team1, team2])
  const a = utilA(teamRatings)
  t.deepEqual(a, {
    1: 1,
    2: 1,
  })
})
