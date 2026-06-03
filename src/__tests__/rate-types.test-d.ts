/* eslint-disable @typescript-eslint/no-unused-vars */
// Type-level checks for rate()'s shape-preserving signature.
// These are compile-time only assertions; `npm run build` (tsc) fails if any
// of them break. There is nothing to execute at runtime.
import { rate, rating, Rating } from '../index'

type Expect<T extends true> = T
// Mutual-assignability equality: distinguishes tuple lengths and tuple-vs-array,
// which is exactly what the rate() typing guarantees, without the brittleness of
// the stricter `(<T>() => ...)` identity check against deferred mapped types.
type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false

const a = rating()
const b = rating()
const c = rating()
const d = rating()
const e = rating()
const f = rating()
const g = rating()

// Three teams with 5, 4 and 7 ratings -> same three-team, 5/4/7 shape out.
const out = rate([
  [a, b, c, d, e],
  [a, b, c, d],
  [a, b, c, d, e, f, g],
])

type Out = typeof out
type _preservesShape = Expect<
  Equal<
    Out,
    [
      [Rating, Rating, Rating, Rating, Rating],
      [Rating, Rating, Rating, Rating],
      [Rating, Rating, Rating, Rating, Rating, Rating, Rating],
    ]
  >
>

// The result is a fixed-length tuple per team, not a Rating[] -- indexing past
// the known length is a compile error.
const [team0, team1, team2] = out
const [r0, r1, r2, r3, r4] = team0
// @ts-expect-error team0 only has 5 ratings, there is no 6th
const six = team0[5]
// @ts-expect-error there is no 4th team
const team3 = out[3]

// A plain Rating[][] (non-literal) still works and maps back to Rating[][].
const dynamic: Rating[][] = [
  [a, b],
  [c, d],
]
const dynamicOut = rate(dynamic)
type _dynamic = Expect<Equal<typeof dynamicOut, Rating[][]>>

// Options are still accepted and do not change the shape preservation.
const withOpts = rate([[a], [b]], { tau: 0.3, limitSigma: true })
type _withOpts = Expect<Equal<typeof withOpts, [[Rating], [Rating]]>>

// Asymmetric teams with options.
const mixed = rate(
  [
    [a, b, c],
    [d, e],
  ],
  { score: [2, 1], margin: 5 }
)
type _mixed = Expect<Equal<typeof mixed, [[Rating, Rating, Rating], [Rating, Rating]]>>
