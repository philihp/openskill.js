import { describe, it, expect } from '#test-helpers'
import { rate as rateGame, rating } from '../..'
import rate from '../thurstone-mosteller-part'

describe('thurstoneMostellerPart#windowSize', () => {
  const team1 = [rating()]
  const ffa = (n: number) => Array.from({ length: n }, () => team1)

  it('2-team games are the same with or without a window', () => {
    expect(rate(ffa(2), { windowSize: 4 })).toStrictEqual(rate(ffa(2)))
  })

  it('window of 1 compares only adjacent teams', () => {
    const [first] = rate(ffa(5), { windowSize: 1 })
    expect(first).toStrictEqual(rate(ffa(2))[0])
  })

  it('averages the comparisons, where no window adds them', () => {
    // the middle of 3 teams has two neighbors: the average shrinks sigma less
    // than the sum
    expect(rate(ffa(3), { windowSize: 1 })[1][0].sigma).toBeGreaterThan(rate(ffa(3))[1][0].sigma)
  })

  it('window as wide as the game compares every pair', () => {
    expect(rate(ffa(5), { windowSize: 4 })).toStrictEqual(rate(ffa(5), { windowSize: Infinity }))
  })

  it('wider window reaches further teams', () => {
    // with a window of 4, team 1 of 7 sees one loss and four wins; with 6 it
    // sees one more win, so its average update is larger
    expect(rate(ffa(7), { windowSize: 4 })[1][0].mu).toBeLessThan(rate(ffa(7), { windowSize: 6 })[1][0].mu)
  })

  it('window of 0 leaves every rating unchanged', () => {
    expect(rate(ffa(3), { windowSize: 0 })).toStrictEqual(ffa(3))
  })

  it('gives tied teams the same update when the window covers the game', () => {
    const [, [b], [c]] = rate(ffa(3), { rank: [1, 2, 2], windowSize: 4 })
    expect(b).toStrictEqual(c)
  })

  it('does not depend on the order of tied teams when the window covers the game', () => {
    const a = rating()
    const b = rating({ mu: 30 })
    const c = rating({ mu: 20 })
    const [, [bFirst]] = rateGame([[a], [b], [c]], { model: rate, score: [9, 7, 7], windowSize: 4 })
    const [, , [bLast]] = rateGame([[a], [c], [b]], { model: rate, score: [9, 7, 7], windowSize: 4 })
    expect(bFirst).toStrictEqual(bLast)
  })
})
