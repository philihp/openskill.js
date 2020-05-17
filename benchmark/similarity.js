const { reverse, sum, map, findIndex } = require('ramda')

const delta = (prd, res) =>
  sum(
    map((p) => {
      const ndx1 = findIndex((r) => r === p, res)
      const ndx2 = findIndex((r) => r === p, prd)
      return Math.abs(ndx1 - ndx2)
    }, prd)
  )

const sim = (a, b) => {
  const dlt = delta(a, b)
  const max = delta(a, reverse(a))
  if (max === 0) return 0
  return 1 - dlt / max
}

const simi = require('compute-cosine-similarity')

// const am = [
//   29.230522869423353,
//   24.774327039864236,
//   25.356860154819287,
//   23.182057474536368,
// ]
// const bm = [
//   23.182057474536368,
//   24.774327039864236,
//   25.356860154819287,
//   29.230522869423353,
// ]

const am = [1, 2, 3, 4]
const bm = [1, 2, 4, 3]

// lower is farther, higher is closer
// console.log({ am, bm }, sim(am, bm))
// console.log({ am, bm }, simi(am, bm))

const cm = [1, 2, 3, 4, 5]
const dm = [5, 4, 3, 2, 1]

// lower is farther, higher is closer
// console.log({ cm, dm }, sim(cm, dm))
// console.log({ cm, dm }, simi(cm, dm))

module.exports = {
  default: sim,
}
