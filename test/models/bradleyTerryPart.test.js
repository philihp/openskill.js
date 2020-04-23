import test from 'ava'
import { rate as rateStub, rating } from '../../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]
const team3 = [r, r, r]

const rate = (game) => rateStub(game, { model: 'bradleyTerryPart' })

test('solo game does not change rating', (t) => {
  t.deepEqual(rate([team1]), [team1])
})

test('2p FFA', (t) => {
  t.deepEqual(rate([team1, team1]), [
    [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
    [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
  ])
})

test('3p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1]), [
    [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
  ])
})

test('4p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1, team1]), [
    [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
  ])
})

test('5p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1, team1, team1]), [
    [{ mu: 27.63523138347365, sigma: 8.065506316323548 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 22.36476861652635, sigma: 8.065506316323548 }],
  ])
})

test('3 teams different sized players', (t) => {
  t.deepEqual(rate([team3, team1, team2]), [
    [
      { mu: 25.219231461891965, sigma: 8.293401112661954 },
      { mu: 25.219231461891965, sigma: 8.293401112661954 },
      { mu: 25.219231461891965, sigma: 8.293401112661954 },
    ],
    [{ mu: 28.48909130001799, sigma: 8.220848339985736 }],
    [
      { mu: 21.291677238090045, sigma: 8.206896387427937 },
      { mu: 21.291677238090045, sigma: 8.206896387427937 },
    ],
  ])
})
