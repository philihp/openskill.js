import test from 'ava'
import { ordinal } from '../src'

test('converts a rating into an ordinal', (t) => {
  const result = ordinal({
    mu: 5.0,
    sigma: 2.0,
  })
  t.is(result, -1.0)
})
