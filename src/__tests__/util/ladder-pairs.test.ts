import { ladderPairs } from '../../util'

describe('util#ladderPairs', () => {
  it('ladderpairs with 0 elements', () => {
    expect.assertions(1)
    expect(ladderPairs([])).toStrictEqual([[]])
  })

  it('ladderpairs with 1 elements', () => {
    expect.assertions(1)
    expect(ladderPairs([1])).toStrictEqual([[]])
  })

  it('ladderpairs with 2 elements', () => {
    expect.assertions(1)
    expect(ladderPairs([1, 2])).toStrictEqual([[2], [1]])
  })

  it('ladderpairs with 3 elements', () => {
    expect.assertions(1)
    expect(ladderPairs([1, 2, 3])).toStrictEqual([[2], [1, 3], [2]])
  })

  it('ladderpairs with 4 elements', () => {
    expect.assertions(1)
    expect(ladderPairs([1, 2, 3, 4])).toStrictEqual([[2], [1, 3], [2, 4], [3]])
  })
})
