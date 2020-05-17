const { sortBy, reduce, split, transpose, map, head } = require('ramda')
const csv = require('csv-parser')
const benchmark = require('benchmark')
const fs = require('fs')
const microtime = require('microtime')
const Trueskill = require('ts-trueskill')
const Openskill = require('../dist')
const similarity = require('./similarity').default

// Configure library here --------------------
const model = 'plackettLuce'
const WHICHSKILL = false
function newRating() {
  if (WHICHSKILL) {
    return new Trueskill.Rating()
  }
  return Openskill.rating()
}
function runRate(data) {
  if (WHICHSKILL) {
    return Trueskill.rate(data)
  }
  return Openskill.rate(data, { model })
}
console.log(`RUNNING WITH model: ${model}, trueskill: ${WHICHSKILL}`)
// --------------------------------------------

const dataset = []
let ratings = {}

let prediction = {
  correctFirst: 0,
  total: 0,
  sumSimilar: 0,
}

const delta = (a, b) => {
  const am = map(([n]) => n.mu, a)
  const bm = map(([n]) => n.mu, b)
  const sim = similarity(am, bm)
  return sim
}

const openskill = () => {
  dataset.map(({ results }) => {
    const oldRatings = map((n) => [ratings[n] || newRating()], results)
    const predictedOrder = sortBy(([r]) => r.mu, oldRatings)
    const dlt = delta(oldRatings, predictedOrder)

    const correctFirst =
      prediction.correctFirst +
      (predictedOrder[0][0] == oldRatings[0][0] ? 1 : 0)
    const total = prediction.total + 1
    const sumSimilar = prediction.sumSimilar + dlt

    prediction = {
      correctFirst,
      total,
      sumSimilar,
    }

    const newRatings = runRate(oldRatings)

    const nr = reduce(
      (accum, [name, [r]]) => ({
        ...accum,
        [name]: r,
      }),
      {},
      transpose([results, newRatings])
    )

    ratings = {
      ...ratings,
      ...nr,
    }
    return ratings
  })
}

const loadStart = microtime.now()
fs.createReadStream(`${__dirname}/rr18xx.csv`)
  .pipe(csv())
  .on('data', (data) => {
    dataset.push({
      id: data.game_id,
      title: data.title,
      results: map((s) => head(split('~', s)), split('|', data.results)),
    })
  })
  .on('end', () => {
    const start = microtime.now()
    console.log(
      `${dataset.length} records loaded in ${(start - loadStart) / 1000} ms`
    )
    // openskill()
    new benchmark.Suite()
      .add('openskill', openskill)
      .on('complete', (e) => {
        console.log(e.stats)
      })
      .on('cycle', (e) => {
        console.log(e.target.toString())
      })
      .run()
    const avgsim = prediction.sumSimilar / prediction.total
    console.log({ prediction, avgsim })

    const end = microtime.now()
    console.log(`${(end - start) / 1000} ms elapsed`)
  })
