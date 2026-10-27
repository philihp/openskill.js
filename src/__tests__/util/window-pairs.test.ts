import { describe, it, expect } from '#test-helpers'
import { windowPairs } from '../../util'

describe('util#windowPairs', () => {
  it('has no windows for no items', () => {
    expect(windowPairs([], 4)).toStrictEqual([])
  })

  it('pairs a single item with nothing', () => {
    expect(windowPairs([1], 4)).toStrictEqual([[]])
  })

  describe('window of 1 pairs adjacent items', () => {
    it('with 2 items', () => {
      expect(windowPairs([1, 2], 1)).toStrictEqual([[2], [1]])
    })

    it('with 3 items', () => {
      expect(windowPairs([1, 2, 3], 1)).toStrictEqual([[2], [1, 3], [2]])
    })

    it('with 4 items', () => {
      expect(windowPairs([1, 2, 3, 4], 1)).toStrictEqual([[2], [1, 3], [2, 4], [3]])
    })
  })

  it('window of 2 reaches two places on each side', () => {
    expect(windowPairs([1, 2, 3, 4, 5, 6], 2)).toStrictEqual([
      [2, 3],
      [1, 3, 4],
      [1, 2, 4, 5],
      [2, 3, 5, 6],
      [3, 4, 6],
      [4, 5],
    ])
  })

  it('window as large as the list pairs every item with every other', () => {
    expect(windowPairs([1, 2, 3, 4], 3)).toStrictEqual([
      [2, 3, 4],
      [1, 3, 4],
      [1, 2, 4],
      [1, 2, 3],
    ])
    expect(windowPairs([1, 2, 3, 4], Infinity)).toStrictEqual(windowPairs([1, 2, 3, 4], 3))
  })

  it('keeps the items in their order, before then after', () => {
    expect(windowPairs(['a', 'b', 'c', 'd', 'e'], 4)[2]).toStrictEqual(['a', 'b', 'd', 'e'])
  })

  it('window of 0 pairs nothing', () => {
    expect(windowPairs([1, 2, 3], 0)).toStrictEqual([[], [], []])
  })

  it('negative window pairs nothing, as an empty range does in openskill.py', () => {
    expect(windowPairs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], -1)).toStrictEqual(Array.from({ length: 10 }, () => []))
    expect(windowPairs([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], -5)).toStrictEqual(Array.from({ length: 10 }, () => []))
  })
})
