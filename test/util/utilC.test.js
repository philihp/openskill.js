import test from 'ava'
import { teamRating, utilC } from '../../src/util'
import { rating } from '../../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]

test('utilC computes as expected', (t) => {
  const teamRatings = teamRating([team2, team1])
  const c = utilC(teamRatings)
  t.is(c, 15.590239111558091)
})
