const {
  sortBy,
  average,
  reduce,
  any,
  all,
  split,
  median,
  sum,
  transpose,
  map,
  head,
  flatten,
} = require('ramda')
const ndjson = require('ndjson')
const benchmark = require('benchmark')
const fs = require('fs')
const microtime = require('microtime')

const dataset = []

const isNewTeam = (players, team) => all((p) => players[p] === undefined, team)

const collectStats = reduce(
  (accum, game) => {
    const players = flatten(game.results)
    const unknownTeam = any((t) => isNewTeam(accum.players, t), game.results)
    for (t in players) {
      const player = players[t]
      if (accum.players[player] === undefined) {
        accum.players[player] = {
          games: 1,
        }
      } else {
        accum.players[player] = {
          games: accum.players[player].games + 1,
        }
      }
    }
    return {
      ...accum,
      playedAgainstUnknown: accum.playedAgainstUnknown + (unknownTeam ? 1 : 0),
      playedAgainstKnown: accum.playedAgainstKnown + (!unknownTeam ? 1 : 0),
    }
  },
  { players: {}, playedAgainstUnknown: 0, playedAgainstKnown: 0 }
)

const loadStart = microtime.now()
const runStats = fs
  .createReadStream(`${__dirname}/v2_jsonl_teams.jsonl`)
  // fs.createReadStream(`${__dirname}/tiny.jsonl`)
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
    const stats = collectStats(dataset)
    console.log(stats.playedAgainstUnknown)
    console.log(stats.playedAgainstKnown)

    let playerStats = []
    for (p in stats.players) {
      const games = stats.players[p].games
      playerStats.push(games)
    }
    console.log(playerStats)
    console.log(median(notOne))
    console.log(sum(playerStats) / playerStats.length)

    const end = microtime.now()
    console.log(`${(end - start) / 1000} ms elapsed`)
  })
