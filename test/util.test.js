import test from 'ava'
import { teamRating } from '../src/util'
import { rating } from '../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]

test('teamRating aggregates all players in a team', (t) => {
  const [t1, t2] = teamRating([team1, team2])
  t.deepEqual(t1, [25, 69.44444444444446, team1, 1])
  t.deepEqual(t2, [50, 138.8888888888889, team2, 2])
})
