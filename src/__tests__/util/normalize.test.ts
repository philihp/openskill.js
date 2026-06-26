import { describe, it, expect } from '#test-helpers'
import { normalize } from '../../util'

describe('util#normalize', () => {
  it('maps the vector min and max onto the target bounds', () => {
    expect.assertions(1)
    expect(normalize([0.9, 1.0], 1, 2)).toStrictEqual([1, 2])
  })

  it('preserves order, scaling the largest value to the upper bound', () => {
    expect.assertions(1)
    expect(normalize([1.0, 0.6], 1, 2)).toStrictEqual([2, 1])
  })

  it('rescales an arbitrary vector across an arbitrary range', () => {
    expect.assertions(1)
    expect(normalize([0, 5, 10], 0, 100)).toStrictEqual([0, 50, 100])
  })

  it('returns the upper bound for a single-element vector', () => {
    expect.assertions(1)
    expect(normalize([0.3], 1, 2)).toStrictEqual([2])
  })

  it('collapses an all-equal vector to the lower bound', () => {
    expect.assertions(1)
    expect(normalize([5, 5, 5], 1, 2)).toStrictEqual([1, 1, 1])
  })
})
