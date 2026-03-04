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
      [{ mu: 27.10261680121866, sigma: 8.249024727693394 }],
      [{ mu: 22.89738319878134, sigma: 8.249024727693394 }],
    ])
  })

  it('3p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10261680121866, sigma: 8.249024727693394 }],
      [{ mu: 25, sigma: 8.163845507587077 }],
      [{ mu: 22.89738319878134, sigma: 8.249024727693394 }],
    ])
  })

  it('4p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10261680121866, sigma: 8.249024727693394 }],
      [{ mu: 25, sigma: 8.163845507587077 }],
      [{ mu: 25, sigma: 8.163845507587077 }],
      [{ mu: 22.89738319878134, sigma: 8.249024727693394 }],
    ])
  })

  it('5p FFA', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1])).toStrictEqual([
      [{ mu: 27.10261680121866, sigma: 8.249024727693394 }],
      [{ mu: 25, sigma: 8.163845507587077 }],
      [{ mu: 25, sigma: 8.163845507587077 }],
      [{ mu: 25, sigma: 8.163845507587077 }],
      [{ mu: 22.89738319878134, sigma: 8.249024727693394 }],
    ])
  })

  it('3 teams different sized players', () => {
    expect.assertions(1)
    expect(rate([team3, team1, team2])).toStrictEqual([
      [
        { mu: 25.312878118346458, sigma: 8.309613085350666 },
        { mu: 25.312878118346458, sigma: 8.309613085350666 },
        { mu: 25.312878118346458, sigma: 8.309613085350666 },
      ],
      [{ mu: 27.735657070878023, sigma: 8.257580571375808 }],
      [
        { mu: 21.95146481077552, sigma: 8.245567442404347 },
        { mu: 21.95146481077552, sigma: 8.245567442404347 },
      ],
    ])
  })

  it('can use a custom gamma with k=2', () => {
    expect.assertions(1)
    expect(rate([team1, team1], { gamma: (_, k) => 1 / k })).toStrictEqual([
      [{ mu: 27.10261680121866, sigma: 8.19963147044701 }],
      [{ mu: 22.89738319878134, sigma: 8.19963147044701 }],
    ])
  })

  it('can use a custom gamma with k=5', () => {
    expect.assertions(1)
    expect(rate([team1, team1, team1, team1, team1], { gamma: (_, k) => 1 / k })).toStrictEqual([
      [{ mu: 27.10261680121866, sigma: 8.280111663928492 }],
      [{ mu: 25, sigma: 8.226545683931066 }],
      [{ mu: 25, sigma: 8.226545683931066 }],
      [{ mu: 25, sigma: 8.226545683931066 }],
      [{ mu: 22.89738319878134, sigma: 8.280111663928492 }],
    ])
  })
})
