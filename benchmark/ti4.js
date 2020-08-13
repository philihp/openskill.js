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
  const ratings = dataset.reduce((ratings, match) => {
    const { results } = match
    const oldRatings = map((n) => [ratings[n] || newRating()], results)
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
  }, {})
  console.log(ratings)
}

const pushTeam = (results, race, exp) => {
  if (race === '') return
  if (exp === '') return
  if (exp === undefined) return
  results.push(`${race}:${exp}`)
}

const loadStart = microtime.now()
fs.createReadStream(`${__dirname}/ti4.csv`)
  .pipe(csv())
  .on('data', (data) => {
    let results = []
    pushTeam(results, data['Winning Race'], data['Winning Exp Level'])
    pushTeam(results, data['2nd Race'], data['2nd Exp Level'])
    pushTeam(results, data['3rd Race'], data['3rd Exp Level'])
    pushTeam(results, data['4th Race'], data['4th Exp Level'])
    pushTeam(results, data['5th Race'], data['5th Exp Level'])
    pushTeam(results, data['6th Race'], data['6th Exp Level'])
    dataset.push({ results })
  })
  .on('end', () => {
    const start = microtime.now()
    console.log(
      `${dataset.length} records loaded in ${(start - loadStart) / 1000} ms`
    )
    openskill()
    // new benchmark.Suite()
    //   .add('openskill', openskill)
    //   .on('complete', (e) => {
    //     console.log(e.stats)
    //   })
    //   .on('cycle', (e) => {
    //     console.log(e.target.toString())
    //   })
    //   .run()
    // const avgsim = prediction.sumSimilar / prediction.total
    // console.log({ prediction, avgsim })
    const end = microtime.now()
    console.log(`${(end - start) / 1000} ms elapsed`)
  })
