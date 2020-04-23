import test from 'ava'
import { teamRating, utilC, utilSumQ } from '../../src/util'
import { rating } from '../../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]

test('utilSumQ computes as expected', (t) => {
  const teamRatings = teamRating([team1, team2])
  const c = utilC(teamRatings)
  const sumQ = utilSumQ(teamRatings, c)
  t.deepEqual(sumQ, {
    1: 29.67892702634643,
    2: 24.70819334370875,
  })
})
