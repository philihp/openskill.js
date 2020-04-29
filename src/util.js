import {
  transpose,
  juxt,
  sum,
  cond,
  lt,
  gt,
  T,
  always,
  map,
  compose,
  identity,
  isNil,
  filter,
  length,
  addIndex,
  slice,
} from 'ramda'
import { BETASQ } from './constants'

const intoRankHash = (accum, value, index) => {
  return {
    ...accum,
    [index + 1]: value,
  }
}

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

export const utilC = compose(
  Math.sqrt,
  sum,
  map(([_teamMu, teamSigmaSq, _team, _rank]) => teamSigmaSq + BETASQ)
)

const higherRank = (qRank) => ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
  iRank >= qRank

export const utilSumQ = (teamRatings, c) =>
  map(
    ([_qMu, _qSigmaSq, _qTeam, qRank]) =>
      compose(
        sum,
        map(([iMu, _iSigmaSq, _iTeam, _iRank]) => Math.exp(iMu / c)),
        filter(higherRank(qRank))
      )(teamRatings),
    teamRatings
  ).reduce(intoRankHash, {})

export const utilA = (teamRatings) =>
  map(
    ([_iMu, _iSigmaSq, _iTeam, iRank]) =>
      compose(
        length,
        filter(([_qMu, _qSigmaSq, _qTeam, qRank]) => iRank === qRank)
      )(teamRatings),
    teamRatings
  ).reduce(intoRankHash, {})
