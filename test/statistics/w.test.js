import test from 'ava'
import { w } from '../../src/statistics'

test('w(1,2)', (t) => {
  t.is(w(1, 2), 0.8009021873172315)
})

test('w(0,2)', (t) => {
  t.is(w(0, 2), 0.8857214892150859)
})

test('w(0,-1)', (t) => {
  t.is(w(0, -1), 0.3703137182425503)
})
