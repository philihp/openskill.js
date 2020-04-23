import test from 'ava'
import { v } from '../../src/statistics'

test('v(1,2)', (t) => {
  t.is(v(1, 2), 1.5251352044082924)
})

test('v(0,2)', (t) => {
  t.is(v(0, 2), 2.3732157475120528)
})

test('v(0,-1)', (t) => {
  t.is(v(0, -1), 0.2875999734906994)
})
