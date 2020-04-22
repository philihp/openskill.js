import test from 'ava'
import { rate, rating } from '../src'

const r = rating()
const team1 = [r]

test('2p FFA', (t) => {
  const [t1, t2] = rate([team1, team1])
  t.deepEqual(t1, [{ mu: 27.63523138347365, sigma: 8.065506316323548 }])
  t.deepEqual(t2, [{ mu: 22.36476861652635, sigma: 8.065506316323548 }])
})
