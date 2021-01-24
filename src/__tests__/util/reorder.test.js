import { reorder } from '../../util'

describe('util#reorder', () => {
  const a = 'a'
  const b = 'b'
  const c = 'c'
  const d = 'd'
  const source = [a, b, c, d]

  it('accepts zero items', () => {
    expect.assertions(1)
    expect(reorder([])([])).toStrictEqual([])
  })

  it('accepts 1 item', () => {
    expect.assertions(1)
    expect(reorder([1])([a])).toStrictEqual([a])
  })

  it('accepts 2 items', () => {
    expect.assertions(1)
    expect(reorder([2, 1])([a, b])).toStrictEqual([b, a])
  })

  it('accepts 3 items', () => {
    expect.assertions(1)
    expect(reorder([2, 3, 1])([a, b, c])).toStrictEqual([c, a, b])
  })

  it('accepts 4 items', () => {
    expect.assertions(1)
    expect(reorder([2, 4, 3, 1])(source)).toStrictEqual([d, a, c, b])
  })

  it('works with numbers of float, sparse rankings', () => {
    expect.assertions(1)
    expect(reorder([2.45, 0, 7.12])([a, b, c])).toStrictEqual([b, a, c])
  })

  it('does not reorder if rank is missing', () => {
    expect.assertions(1)
    expect(reorder(undefined)(source)).toBe(source)
  })

  it('can be curried', () => {
    expect.assertions(1)
    const curriedReorder = reorder([4, 3, 2, 1])
    expect(curriedReorder(source)).toStrictEqual([d, c, b, a])
  })
})
