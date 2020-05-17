```bash
❯ node benchmark.js
RUNNING WITH model: undefined, trueskill: true
2714 records loaded in 86.091 ms
openskill x 0.42 ops/sec ±2.06% (6 runs sampled)
undefined
{
  prediction: { correctFirst: 2670, total: 32568, sumSimilar: 5353.473611111234 },
  avgsim: 0.1643783349027031
}
28892.406 ms elapsed

~/work/openskill.js/benchmark 30s
❯ node benchmark.js
RUNNING WITH model: bradleyTerryFull, trueskill: false
2714 records loaded in 86.614 ms
openskill x 0.64 ops/sec ±1.48% (6 runs sampled)
undefined
{
  prediction: { correctFirst: 2710, total: 32568, sumSimilar: 5417.834722222358 },
  avgsim: 0.16635454194983906
}
18534.515 ms elapsed

~/work/openskill.js/benchmark 20s
❯ node benchmark.js
RUNNING WITH model: bradleyTerryPart, trueskill: false
2714 records loaded in 87.127 ms
openskill x 0.65 ops/sec ±1.68% (6 runs sampled)
undefined
{
  prediction: { correctFirst: 2845, total: 32568, sumSimilar: 5586.658134920771 },
  avgsim: 0.17153826255590673
}
18236.645 ms elapsed

~/work/openskill.js/benchmark 19s
❯ node benchmark.js
RUNNING WITH model: thurstonMostellerFull, trueskill: false
2714 records loaded in 85.968 ms
openskill x 0.64 ops/sec ±0.98% (6 runs sampled)
undefined
{
  prediction: { correctFirst: 3673, total: 32568, sumSimilar: 6606.384722222352 },
  avgsim: 0.2028489536422977
}
18434.698 ms elapsed

~/work/openskill.js/benchmark 20s
❯ node benchmark.js
RUNNING WITH model: thurstonMostellerPart, trueskill: false
2714 records loaded in 86.311 ms
openskill x 0.64 ops/sec ±1.55% (6 runs sampled)
undefined
{
  prediction: { correctFirst: 2898, total: 32568, sumSimilar: 5630.297023809643 },
  avgsim: 0.17287819404966973
}
18476.604 ms elapsed

~/work/openskill.js/benchmark 20s
❯ node benchmark.js
RUNNING WITH model: plackettLuce, trueskill: false
2714 records loaded in 85.983 ms
openskill x 0.61 ops/sec ±1.47% (6 runs sampled)
undefined
{
  prediction: { correctFirst: 2923, total: 32568, sumSimilar: 5399.3180555556855 },
  avgsim: 0.16578598795000263
}
19189.953 ms elapsed

~/work/openskill.js/benchmark 21s
```
