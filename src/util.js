import {
  pipe,
  nth,
  transpose,
  juxt,
  sum,
  cond,
  lt,
  gt,
  add,
  T,
  always,
  map,
  identity,
  isNil,
  filter,
  addIndex,
  slice,
  reduce,
  fromPairs,
  toPairs,
  invert,
} from 'ramda'
import { BETASQ } from './constants'

const toRankedMap = addIndex(reduce)(
  (accum, value, index) => ({
    ...accum,
    [index + 1]: value,
  }),
  {}
)

export const score = (i) =>
  cond([
    [lt(i), always(0.0)],
    [gt(i), always(1.0)],
    [T, always(0.5)],
  ])

export const teamRating = addIndex(map)((team, i) => [
  sum(map(({ mu }) => mu, team)),
  sum(map(({ sigma }) => sigma * sigma, team)),
  team,
  i + 1,
])

const left = (ranks) => [null, ...slice(0, -1, ranks)]
const right = (ranks) => [...slice(1, Infinity, ranks), null]
const coalesceLeftRight = cond([
  [([l, r]) => !isNil(l) && !isNil(r), identity],
  [([l, r]) => !isNil(l) && isNil(r), ([l, _r]) => [l]],
  [([l, r]) => isNil(l) && !isNil(r), ([_l, r]) => [r]],
  [T, always([])],
])

export const ladderPairs = (ranks) =>
  map(coalesceLeftRight, transpose(juxt([left, right])(ranks)))

export const utilC = pipe(map(pipe(nth(1), add(BETASQ))), sum, Math.sqrt)

const higherRank = (qRank) => ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
  iRank >= qRank

export const utilSumQ = (teamRatings, c) =>
  toRankedMap(
    // TODO: could this be point-free with xprod or lift?
    map(
      ([_qMu, _qSigmaSq, _qTeam, qRank]) =>
        pipe(
          filter(higherRank(qRank)),
          map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c)),
          sum
        )(teamRatings),
      teamRatings
    )
  )

export const utilA = pipe(
  map(nth(3)),
  invert,
  toPairs,
  map(([k, v]) => [k, v.length]),
  fromPairs
)
