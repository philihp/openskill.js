import { rating } from '../..'
import rate from '../thurstone-mosteller-part'

describe('thurstoneMostellerPart', () => {
  const r = rating()
  const team1 = [r]
  const team2 = [r, r]
  const team3 = [r, r, r]

  it('solo game does not change rating', () => {
    expect.assertions(1)
    expect(rate([team1])).toStrictEqual([team1])
  })

  it('2p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1])).toStrictEqual([
      [{ mu: 27.102616738180256, sigma: 8.24902473277454 }],
      [{ mu: 22.897383261819744, sigma: 8.24902473277454 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 27.102616738180256, sigma: 8.24902473277454 }],
      [{ mu: 25, sigma: 8.163845517855398 }],
      [{ mu: 22.897383261819744, sigma: 8.24902473277454 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.102616738180256, sigma: 8.24902473277454 }],
      [{ mu: 25, sigma: 8.163845517855398 }],
      [{ mu: 25, sigma: 8.163845517855398 }],
      [{ mu: 22.897383261819744, sigma: 8.24902473277454 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.102616738180256, sigma: 8.24902473277454 }],
      [{ mu: 25, sigma: 8.163845517855398 }],
      [{ mu: 25, sigma: 8.163845517855398 }],
      [{ mu: 25, sigma: 8.163845517855398 }],
      [{ mu: 22.897383261819744, sigma: 8.24902473277454 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.31287811922766, sigma: 8.309613085276991 },
        { mu: 25.31287811922766, sigma: 8.309613085276991 },
        { mu: 25.31287811922766, sigma: 8.309613085276991 },
      ],
      [{ mu: 27.735657148831812, sigma: 8.257580565832717 }],
      [
        { mu: 21.95146473194053, sigma: 8.245567434614435 },
        { mu: 21.95146473194053, sigma: 8.245567434614435 },
      ],
    ])
  })

  it('can use a custom gamma with k=2', () => {
    expect.assertions(1)
    expect(rate([team1, team1], { gamma: (_, k) => 1 / k })).toStrictEqual([
      [{ mu: 27.102616738180256, sigma: 8.199631478529401 }],
      [{ mu: 22.897383261819744, sigma: 8.199631478529401 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    expect(
      rate([team1, team1, team1, team1, team1], { gamma: (_, k) => 1 / k })
    ).toStrictEqual([
      [{ mu: 27.102616738180256, sigma: 8.280111667130026 }],
      [{ mu: 25, sigma: 8.226545690375827 }],
      [{ mu: 25, sigma: 8.226545690375827 }],
      [{ mu: 25, sigma: 8.226545690375827 }],
      [{ mu: 22.897383261819744, sigma: 8.280111667130026 }],
    ])
  })
})
