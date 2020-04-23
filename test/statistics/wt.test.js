import test from 'ava'
import { wt } from '../../src/statistics'

test('wt(1,2)', (t) => {
  t.is(wt(1, 2), 0.38385826878672835)
})

test('wt(0,2)', (t) => {
  t.is(wt(0, 2), 0.22625869547437663)
})

test('wt(0,-1)', (t) => {
  t.is(wt(0, -1), 1)
})

test('wt(0,0)', (t) => {
  t.is(wt(0, 0), 1.0)
})

test('wt(0,10)', (t) => {
  t.truthy(wt(0, 10) < 0.000000000001)
})
