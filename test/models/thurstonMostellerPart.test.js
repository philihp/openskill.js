import test from 'ava'
import { rate as rateStub, rating } from '../../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]
const team3 = [r, r, r]

const rate = (game) => rateStub(game, { model: 'thurstonMostellerPart' })

test('solo game does not change rating', (t) => {
  t.deepEqual(rate([team1]), [team1])
})

test('2p FFA', (t) => {
  t.deepEqual(rate([team1, team1]), [
    [{ mu: 29.20524620886059, sigma: 7.632833464033909 }],
    [{ mu: 20.79475379113941, sigma: 7.632833464033909 }],
  ])
})

test('3p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1]), [
    [{ mu: 29.20524620886059, sigma: 7.632833464033909 }],
    [{ mu: 25, sigma: 6.861184222487201 }],
    [{ mu: 20.79475379113941, sigma: 7.632833464033909 }],
  ])
})

test('4p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1, team1]), [
    [{ mu: 29.20524620886059, sigma: 7.632833464033909 }],
    [{ mu: 25, sigma: 6.861184222487201 }],
    [{ mu: 25, sigma: 6.861184222487201 }],
    [{ mu: 20.79475379113941, sigma: 7.632833464033909 }],
  ])
})

test('5p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1, team1, team1]), [
    [{ mu: 29.20524620886059, sigma: 7.632833464033909 }],
    [{ mu: 25, sigma: 6.861184222487201 }],
    [{ mu: 25, sigma: 6.861184222487201 }],
    [{ mu: 25, sigma: 6.861184222487201 }],
    [{ mu: 20.79475379113941, sigma: 7.632833464033909 }],
  ])
})

test('3 teams different sized players', (t) => {
  t.deepEqual(rate([team3, team1, team2]), [
    [
      { mu: 25.028771900446664, sigma: 8.317616549882494 },
      { mu: 25.028771900446664, sigma: 8.317616549882494 },
      { mu: 25.028771900446664, sigma: 8.317616549882494 },
    ],
    [{ mu: 34.0010841338675, sigma: 7.7579369709569805 }],
    [
      { mu: 15.970143965685834, sigma: 7.520912043634571 },
      { mu: 15.970143965685834, sigma: 7.520912043634571 },
    ],
  ])
})
