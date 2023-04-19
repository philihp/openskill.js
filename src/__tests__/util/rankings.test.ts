import rating from '../../rating'
import { rankings } from '../../util'

const a = [rating({ mu: 1 })]
const b = [rating({ mu: 2 })]
const c = [rating({ mu: 3 })]
const d = [rating({ mu: 4 })]
const e = [rating({ mu: 5 })]

describe('util#rankings', () => {
  it('ranks a 0 element array without reordering', () => {
    expect.assertions(1)
    expect(rankings([], undefined)).toStrictEqual([])
  })
  it('ranks a 0 element array with reordering', () => {
    expect.assertions(1)
    expect(rankings([], [])).toStrictEqual([])
  })
  it('ranks a 1 element array without reordering', () => {
    expect.assertions(1)
    expect(rankings([a], undefined)).toStrictEqual([0])
  })
  it('ranks a 1 element array with reordering', () => {
    expect.assertions(1)
    expect(rankings([a], [1])).toStrictEqual([0])
  })
  it('ranks given undefined', () => {
    expect.assertions(1)
    expect(rankings([a, b, c, d], undefined)).toStrictEqual([0, 1, 2, 3])
  })
  it('ranks given incremental', () => {
    expect.assertions(1)
    expect(rankings([a, b, c, d], [1, 2, 3, 4])).toStrictEqual([0, 1, 2, 3])
  })
  it('ranks with ties in start', () => {
    expect.assertions(1)
    expect(rankings([a, b, c, d], [1, 1, 3, 4])).toStrictEqual([0, 0, 2, 3])
  })
  it('ranks with ties at end', () => {
    expect.assertions(1)
    expect(rankings([a, b, c, d], [1, 2, 3, 3])).toStrictEqual([0, 1, 2, 2])
  })
  it('ranks with ties in the middle', () => {
    expect.assertions(1)
    expect(rankings([a, b, c, d], [1, 2, 2, 4])).toStrictEqual([0, 1, 1, 3])
  })
  it('ranks sparse scores', () => {
    expect.assertions(1)
    expect(rankings([a, b, c, d, e], [14, 32, 47, 47, 48])).toStrictEqual([0, 1, 2, 2, 4])
  })
})
