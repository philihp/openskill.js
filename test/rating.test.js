import test from 'ava'
import { rating } from '../src'

test('defaults mu to 25.0', (t) => {
  const { mu } = rating()
  t.is(mu, 25.0)
})

test('defaults sigma to 8.333', (t) => {
  const { sigma } = rating()
  t.is(sigma, 8.333333333333334)
})
