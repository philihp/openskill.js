import test from 'ava'
import { score } from '../../src/util'

test('score returns 1.0 on wins', (t) => {
  t.is(score(2)(1), 1.0)
})

test('score returns 0.0 on losses', (t) => {
  t.is(score(1)(2), 0.0)
})

test('score returns 0.5 on ties', (t) => {
  t.is(score(1)(1), 0.5)
})
