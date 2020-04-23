import test from 'ava'
import { vt } from '../../src/statistics'

test('with small b, small x', (t) => {
  t.is(vt(-1000, -100), 1100)
})

test('with small b, big x', (t) => {
  t.is(vt(1000, -100), -1100)
})

test('with big b, small x', (t) => {
  t.is(vt(-1000, 1000), 0.7978845368663289)
})

test('with big b, big x', (t) => {
  t.truthy(vt(0, 1000) < 0.000000001)
})
