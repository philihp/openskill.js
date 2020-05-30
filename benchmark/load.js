const {
  sortBy,
  reduce,
  split,
  sum,
  transpose,
  map,
  head,
  flatten,
} = require('ramda')
// const csv = require('csv-parser')
const ndjson = require('ndjson')
const benchmark = require('benchmark')
const fs = require('fs')
const microtime = require('microtime')
const Trueskill = require('ts-trueskill')
const Openskill = require('../dist')
const similarity = require('./similarity').default

// Configure library here --------------------
const args = process.argv.slice(2)
const model = args[0] // 'thurstonMostellerFull'
const WHICHSKILL = args[0] === 'trueskill'
function newRating() {
  if (WHICHSKILL) {
    return new Trueskill.Rating()
  }
  return Openskill.rating()
}
function runRate(data) {
  if (args[0] === 'random') {
    return data
  }
  if (WHICHSKILL) {
    return Trueskill.rate(data)
  }
  return Openskill.rate(data, { model })
}

console.log(`RUNNING WITH model: ${model}`)
// --------------------------------------------

const dataset = []

let prediction = {
  correct: 0,
  total: 0,
}

const delta = (a, b) => {
  const am = map(([n]) => n.mu, a)
  const bm = map(([n]) => n.mu, b)
  const sim = similarity(am, bm)
  return sim
}

const saveRatings = (ratings, results, newRatings) => {
  for (t in results) {
    for (p in results[t]) {
      ratings[results[t][p]] = newRatings[t][p]
    }
  }
  return ratings
}

const reduceTeamToScore = (team) => {
  const teamSum = sum(map((r) => r.mu, team))
  const noise = args[0] === 'random' ? Math.random() / 1000000 : 0
  return teamSum + noise
}

const predictFrom = (results, ratings) => {
  const redScore = reduceTeamToScore(ratings[0])
  const blueScore = reduceTeamToScore(ratings[1])
  console.log({ redScore, blueScore })
  if (redScore < blueScore) {
    return [results[1], results[0]]
  } else if (redScore > blueScore) {
    return [results[0], results[1]]
  }
  return undefined
}

function openskill() {
  ratings = reduce(
    (ratings, { results }) => {
      const getRating = (player) => ratings[player] || newRating()
      const oldRatings = map((team) => map(getRating, team), results)
      const predictedResults = predictFrom(results, oldRatings)

      if (predictedResults !== undefined) {
        if (results[0] == predictedResults[0]) {
          prediction.correct += 1
        }
        prediction.total += 1
      }

      const newRatings = runRate(oldRatings)
      return saveRatings(ratings, results, newRatings)
    },
    {},
    dataset
  )
}

const loadStart = microtime.now()

// fs.createReadStream(`${__dirname}/v2_jsonl_teams.jsonl`)
fs.createReadStream(`${__dirname}/tiny.jsonl`)
  .pipe(ndjson.parse())
  .on('data', (data) => {
    const winner = data.teams[data.result === 'WIN' ? 'blue' : 'red']
    const loser = data.teams[data.result === 'WIN' ? 'red' : 'blue']
    const results = [winner, loser]
    dataset.push({ results })
  })
  .on('end', () => {
    const start = microtime.now()
    console.log(
      `${dataset.length} records loaded in ${(start - loadStart) / 1000} ms`
    )
    openskill()
    new benchmark.Suite()
      .add('openskill', openskill)
      .on('complete', (e) => {
        console.log(e.stats)
      })
      .on('cycle', (e) => {
        console.log(e.target.toString())
      })
      .run()
    // console.log({
    //   percent: prediction.correct / prediction.total,
    //   ...prediction,
    // })
    // const end = microtime.now()
    // console.log(`${(end - start) / 1000} ms elapsed`)
  })
