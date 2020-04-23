import test from 'ava'
import { vt } from '../../src/statistics'

test('vt(1,2)', (t) => {
  t.is(vt(1, 2), -0.2827861132540126)
})

test('vt(0,2)', (t) => {
  t.is(vt(0, 2), 0)
})

test('vt(0,-1)', (t) => {
  t.is(vt(0, -1), -1)
})
