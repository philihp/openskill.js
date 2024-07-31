import { rating, predictWin } from '..'
import { sum } from 'ramda'

describe('predictWin', () => {
  const precision = 7

  const a1 = rating()
  const a2 = rating({ mu: 32.444, sigma: 5.123 })

  const b1 = rating({ mu: 73.381, sigma: 1.421 })
  const b2 = rating({ mu: 25.188, sigma: 6.211 })

  const team1 = [a1, a2]
  const team2 = [b1, b2]

  it('predicts win outcome for two teams', () => {
    expect.assertions(2)
    const [prob1, prob2] = predictWin([team1, team2])
    expect(prob1).toBeCloseTo(0.0008308945674377, precision)
    expect(prob2).toBeCloseTo(0.9991691054325622, precision)
  })

  it('ignores rankings', () => {
    expect.assertions(1)
    const p1 = predictWin([[a2], [b1], [b2]], { rank: [2, 1, 3] })
    const p2 = predictWin([[a2], [b1], [b2]], { rank: [3, 2, 1] })
    expect(p1).toStrictEqual(p2)
  })

  it('predicts win outcome for multiple asymmetric teams', () => {
    expect.assertions(4)
    const [prob1, prob2, prob3, prob4] = predictWin([team1, team2, [a2], [b2]])
    expect(prob1).toBeCloseTo(0.32579822053781543, precision)
    expect(prob2).toBeCloseTo(0.49965489287103865, precision)
    expect(prob3).toBeCloseTo(0.12829642754274315, precision)
    expect(prob4).toBeCloseTo(0.04625045904840272, precision)
  })

  it('3 player newbie FFA', () => {
    expect.assertions(3)
    const [prob1, prob2, prob3] = predictWin([[a1], [a1], [a1]])
    expect(prob1).toBeCloseTo(0.333333333333, precision)
    expect(prob2).toBeCloseTo(0.333333333333, precision)
    expect(prob3).toBeCloseTo(0.333333333333, precision)
  })

  it('4 player newbie FFA', () => {
    expect.assertions(4)
    const [p1, p2, p3, p4] = predictWin([[a1], [a1], [a1], [a1]])
    expect(p1).toBeCloseTo(0.25, precision)
    expect(p2).toBeCloseTo(0.25, precision)
    expect(p3).toBeCloseTo(0.25, precision)
    expect(p4).toBeCloseTo(0.25, precision)
  })

  it('4 players of varying skill', () => {
    expect.assertions(4)
    const r1 = rating({ mu: 1, sigma: 0.1 })
    const r2 = rating({ mu: 2, sigma: 0.1 })
    const r3 = rating({ mu: 3, sigma: 0.1 })
    const r4 = rating({ mu: 4, sigma: 0.1 })
    const [p1, p2, p3, p4] = predictWin([[r1], [r2], [r3], [r4]])
    expect(p1).toBeCloseTo(0.20281164759988402, precision)
    expect(p2).toBeCloseTo(0.2341964232088598, precision)
    expect(p3).toBeCloseTo(0.2658035767911402, precision)
    expect(p4).toBeCloseTo(0.297188352400116, precision)
  })

  it('5 player newbie FFA', () => {
    expect.assertions(5)
    const [p1, p2, p3, p4, p5] = predictWin([[a1], [a1], [a1], [a1], [a1]])
    expect(p1).toBeCloseTo(0.2, precision)
    expect(p2).toBeCloseTo(0.2, precision)
    expect(p3).toBeCloseTo(0.2, precision)
    expect(p4).toBeCloseTo(0.2, precision)
    expect(p5).toBeCloseTo(0.2, precision)
  })

  it('5 player FFA with an impostor', () => {
    expect.assertions(5)
    const [p1, p2, p3, p4, p5] = predictWin([[a1], [a1], [a1], [a2], [a1]])
    expect(p1).toBeCloseTo(0.1790804191839367, precision)
    expect(p2).toBeCloseTo(0.1790804191839367, precision)
    expect(p3).toBeCloseTo(0.1790804191839367, precision)
    expect(p4).toBeCloseTo(0.2836783412642534, precision)
    expect(p5).toBeCloseTo(0.1790804191839367, precision)
  })

  describe('test_predict_win in openskill.py', () => {
    const a1 = rating()
    const a2 = rating({ mu: 32.444, sigma: 5.123 })
    const b1 = rating({ mu: 73.381, sigma: 1.421 })
    const b2 = rating({ mu: 25.188, sigma: 6.211 })
    const team1 = [a1, a2]
    const team2 = [b1, b2]

    it('gives the same probabilities with 5 teams', () => {
      const probabilities = predictWin([team1, team2, [a2], [a1], [b1]])
      expect(sum(probabilities)).toBeCloseTo(1)
    })

    it('gives the same probabilities with 2 teams', () => {
      const probabilities = predictWin([team1, team2])
      expect(sum(probabilities)).toBeCloseTo(1)
    })
  })

  describe('after three pickup games', () => {
    // these ratings come after new players get the rankings:
    // [[a,b,c],[d,e]]
    // [[c,d,e],[a,b]]
    // [[c],[a],[e]]
    const a = rating({ mu: 25.704020819730385, sigma: 7.893074938449104 })
    const b = rating({ mu: 24.94415013523696, sigma: 8.156810439252277 })
    const c = rating({ mu: 29.292922890627658, sigma: 8.011452568371537 })
    const d = rating({ mu: 25.059411748211403, sigma: 8.155255551436932 })
    const e = rating({ mu: 21.598674363731682, sigma: 7.891245891696633 })

    it('predicts a 3 player game of [a,b], [c], [d,e]', () => {
      const [p1, p2, p3] = predictWin([[a, b], [c], [d, e]])
      expect(p1).toBeCloseTo(0.4947495579286258, 7)
      expect(p2).toBeCloseTo(0.08348570519328442, 7)
      expect(p3).toBeCloseTo(0.42176473687808974, 7)
    })

    it('rpredicts a 5p free for all', () => {
      const [p1, p2, p3, p4, p5] = predictWin([[a], [b], [c], [d], [e]])
      expect(p1).toBeCloseTo(0.20522540383388552, 7)
      expect(p2).toBeCloseTo(0.19504283187751015, 7)
      expect(p3).toBeCloseTo(0.25268360117768013, 7)
      expect(p4).toBeCloseTo(0.19657935197103676, 7)
      expect(p5).toBeCloseTo(0.15046881113988744, 7)
    })

    it('predicts a 2p doubles', () => {
      const [p1, p2] = predictWin([
        [a, b],
        [d, e],
      ])
      expect(p1).toBeCloseTo(0.5873106768219909, 7)
      expect(p2).toBeCloseTo(0.4126893231780091, 7)
    })

    it('predicts a 2p inverse', () => {
      const [p1, p2] = predictWin([
        [d, e],
        [a, b],
      ])
      expect(p1).toBeCloseTo(0.4126893231780091, 7)
      expect(p2).toBeCloseTo(0.5873106768219909, 7)
    })
  })
})
