import test from 'ava'
import { teamRating, utilC, utilA, utilSumQ, score } from '../src/util'
import { rating } from '../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]

test('teamRating aggregates all players in a team', (t) => {
  const result = teamRating([team1, team2])
  t.deepEqual(result, [
    [25, 69.44444444444446, team1, 1],
    [50, 138.8888888888889, team2, 2],
  ])
})

test('utilC computes as expected', (t) => {
  const teamRatings = teamRating([team2, team1])
  const c = utilC(teamRatings)
  t.is(c, 15.590239111558091)
})

test('utilSumQ computes as expected', (t) => {
  const teamRatings = teamRating([team1, team2])
  const c = utilC(teamRatings)
  const sumQ = utilSumQ(teamRatings, c)
  t.deepEqual(sumQ, {
    1: 29.67892702634643,
    2: 24.70819334370875,
  })
})

test('utilA computes as expected', (t) => {
  const teamRatings = teamRating([team1, team2])
  const a = utilA(teamRatings)
  t.deepEqual(a, {
    1: 1,
    2: 1,
  })
})

test('score returns 1.0 on wins', (t) => {
  t.is(score(2, 1), 1.0)
})

test('score returns 0.0 on losses', (t) => {
  t.is(score(1, 2), 0.0)
})

test('score returns 0.5 on ties', (t) => {
  t.is(score(1, 1), 0.5)
})
