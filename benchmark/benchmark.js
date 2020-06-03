const { reduce, map } = require('ramda')
const ndjson = require('ndjson')
const benchmark = require('benchmark')
const fs = require('fs')
const microtime = require('microtime')
const Trueskill = require('ts-trueskill')
const Openskill = require('../dist')

const dataset = []

const saveRatings = (ratings, results, newRatings) => {
  for (t in results) {
    for (p in results[t]) {
      ratings[results[t][p]] = newRatings[t][p]
    }
  }
  return ratings
}

const trueskill = () => {
  reduce(
    (ratings, { results }) => {
      const getRating = (player) => ratings[player] || new Trueskill.Rating()
      const oldRatings = map((team) => map(getRating, team), results)
      const newRatings = Trueskill.rate(oldRatings)
      return saveRatings(ratings, results, newRatings)
    },
    {},
    dataset
  )
}

const openskill = (model) => () => {
  reduce(
    (ratings, { results }) => {
      const getRating = (player) => ratings[player] || Openskill.rating()
      const oldRatings = map((team) => map(getRating, team), results)
      const newRatings = Openskill.rate(oldRatings, { model })
      return saveRatings(ratings, results, newRatings)
    },
    {},
    dataset
  )
}

const loadStart = microtime.now()

// fs.createReadStream(`${__dirname}/v2_jsonl_teams.jsonl`)
fs.createReadStream(`${__dirname}/one.jsonl`)
  .pipe(ndjson.parse())
  .on('data', (data) => {
    const winner = data.teams[data.result === 'WIN' ? 'blue' : 'red']
    const loser = data.teams[data.result === 'WIN' ? 'red' : 'blue']
    const results = [winner, loser]
    dataset.push({ results: [['a'], ['b'], ['c'], ['d'], ['e']] })
  })
  .on('end', () => {
    const start = microtime.now()
    console.log(
      `${dataset.length} records loaded in ${(start - loadStart) / 1000} ms`
    )
    new benchmark.Suite()
      .add('trueskill', trueskill)
      .add('bradleyTerryFull', openskill('bradleyTerryFull'))
      .add('bradleyTerryPart', openskill('bradleyTerryPart'))
      .add('thurstonMostellerFull', openskill('thurstonMostellerFull'))
      .add('thurstonMostellerPart', openskill('thurstonMostellerPart'))
      .add('plackettLuce', openskill('plackettLuce'))
      .on('complete', (e) => {
        console.log(e.stats)
      })
      .on('cycle', (e) => {
        console.log(e.target.toString())
      })
      .run()
    const end = microtime.now()
    console.log(`${(end - start) / 1000} ms elapsed`)
  })
