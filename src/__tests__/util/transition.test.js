import { transition } from '../../util'

describe('rate#transition', () => {
  const a = 'a'
  const b = 'b'
  const c = 'c'
  const d = 'd'
  const natural = [a, c, d, b]
  const ordered = [a, b, c, d]
  it('inverts a normal array', () => {
    expect.assertions(1)
    const result = transition(natural, ordered)
    expect(result).toStrictEqual([0, 3, 1, 2])
  })
  it('reverses the array', () => {
    expect.assertions(1)
    const result = transition(ordered, natural)
    expect(result).toStrictEqual([0, 2, 3, 1])
  })
})
