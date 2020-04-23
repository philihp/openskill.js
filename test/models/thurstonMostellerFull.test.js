import test from 'ava'
import { rate as rateStub, rating } from '../../src'

const r = rating()
const team1 = [r]
const team2 = [r, r]
const team3 = [r, r, r]

const rate = (game) => rateStub(game, { model: 'bradleyTerryFull' })

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
    [{ mu: 30.2704627669473, sigma: 7.788474807872566 }],
    [{ mu: 25.0, sigma: 7.788474807872566 }],
    [{ mu: 19.7295372330527, sigma: 7.788474807872566 }],
  ])
})

test('4p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1, team1]), [
    [{ mu: 32.90569415042095, sigma: 7.5012190693964005 }],
    [{ mu: 27.63523138347365, sigma: 7.5012190693964005 }],
    [{ mu: 22.36476861652635, sigma: 7.5012190693964005 }],
    [{ mu: 17.09430584957905, sigma: 7.5012190693964005 }],
  ])
})

test('5p FFA', (t) => {
  t.deepEqual(rate([team1, team1, team1, team1, team1]), [
    [{ mu: 35.5409255338946, sigma: 7.202515895247076 }],
    [{ mu: 30.2704627669473, sigma: 7.202515895247076 }],
    [{ mu: 25.0, sigma: 7.202515895247076 }],
    [{ mu: 19.729537233052703, sigma: 7.202515895247076 }],
    [{ mu: 14.4590744661054, sigma: 7.202515895247076 }],
  ])
})

test('3 teams different sized players', (t) => {
  t.deepEqual(rate([team3, team1, team2]), [
    [
      { mu: 25.992743915179297, sigma: 8.19709997489984 },
      { mu: 25.992743915179297, sigma: 8.19709997489984 },
      { mu: 25.992743915179297, sigma: 8.19709997489984 },
    ],
    [{ mu: 28.48909130001799, sigma: 8.220848339985736 }],
    [
      { mu: 20.518164784802714, sigma: 8.127515465304823 },
      { mu: 20.518164784802714, sigma: 8.127515465304823 },
    ],
  ])
})
