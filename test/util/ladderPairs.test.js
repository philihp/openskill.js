import test from 'ava'
import { ladderPairs } from '../../src/util'

test('ladderpairs with 0 elements', (t) => {
  t.deepEqual(ladderPairs([]), [[]])
})

test('ladderpairs with 1 elements', (t) => {
  t.deepEqual(ladderPairs([1]), [[]])
})

test('ladderpairs with 2 elements', (t) => {
  t.deepEqual(ladderPairs([1, 2]), [[2], [1]])
})

test('ladderpairs with 3 elements', (t) => {
  t.deepEqual(ladderPairs([1, 2, 3]), [[2], [1, 3], [2]])
})

test('ladderpairs with 4 elements', (t) => {
  t.deepEqual(ladderPairs([1, 2, 3, 4]), [[2], [1, 3], [2, 4], [3]])
})
