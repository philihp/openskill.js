This presents a Javascript implementation of a [Weng-Lin rating](https://www.csie.ntu.edu.tw/~cjlin/papers/online_ranking/online_journal.pdf) scheme, using various models described in the paper. The principle difference between this and the more popular Microsoft TrueSkill scheme is that this is not encumbered by patents and licensing. Additionally, this is an order of magnitude faster, and delivers competitively accurate match predictions.

## Dataset

For team games, a dataset of 61867 matches from [OverTrack.gg](https://overtrack.gg) was loaded into memory. Most matches represent a team of 5 vs. 5, with no possibility for ties. Since tracking matches is volutary, a not insignificant percentage of matches (7.82%) are played against a team of unrated/unknown players. The average number of matchs per unique player is about 2.338, however a decent number of players were tracked for over a hundred matches.

For multiplayer games, a dataset of 2727 games played on [rr18xx.com](http://www.rr18xx.com). Abandoned and partial games were not included. Most of these games are played with previously-rated players; of these games, 76 (2.79%) were played where all players were unrated/unknown, and 595 (21.82%) were played where any players were unrated/unknown. The average number of matches per unique player is about 10.90, and the match count of game sizes 2-6 are distributed as

| Players | Matches |
| ------: | ------: |
|       2 |      40 |
|       3 |     595 |
|       4 |    1300 |
|       5 |     619 |
|       6 |     173 |

## Faster

Due to the iterative nature of Trueskill needing more CPU time to converge, it can be expected that Openskill is faster. This is measured using the [Benchmark](https://www.npmjs.com/package/benchmark), which samples until a reasonable confidence of the variance is attained. Each operation here represents measuring the impact of one 5v5 Overwatch game.

| Model                           | Speed (higher is better) | Variance |         Samples |
| ------------------------------- | -----------------------: | -------: | --------------: |
| TrueSkill                       |            2,962 ops/sec |   ±3.23% | 82 runs sampled |
| Openskill/bradleyTerryFull      |           62,643 ops/sec |   ±1.09% | 91 runs sampled |
| Openskill/bradleyTerryPart      |           40,152 ops/sec |   ±0.73% | 91 runs sampled |
| Openskill/thurstonMostellerFull |           59,336 ops/sec |   ±0.74% | 93 runs sampled |
| Openskill/thurstonMostellerPart |           38,666 ops/sec |   ±1.21% | 92 runs sampled |
| Openskill/plackettLuce          |           23,492 ops/sec |   ±0.26% | 91 runs sampled |

When measuring the impact of a 5 player free-for-all 18xx game, we see similar improvement. The models `bradleyTerryPart` and `thurstonMostellerPart` are faster than their `bradleyTerryFull` and `thurstonMostellerFull` counterparts because the Full implementations scale O(n^2) with the number of independent teams. Part implementations only change ratings based on the next best and next worse team (a.l. a stepladder), which is also why the accuracy

| Model                           | Speed (higher is better) | Variance |         Samples |
| ------------------------------- | -----------------------: | -------: | --------------: |
| TrueSkill                       |            2,462 ops/sec |   ±3.08% | 84 runs sampled |
| Openskill/bradleyTerryFull      |           15,589 ops/sec |   ±0.54% | 92 runs sampled |
| Openskill/bradleyTerryPart      |           20,381 ops/sec |   ±0.77% | 86 runs sampled |
| Openskill/thurstonMostellerFull |           14,456 ops/sec |   ±0.36% | 93 runs sampled |
| Openskill/thurstonMostellerPart |           19,889 ops/sec |   ±0.74% | 95 runs sampled |
| Openskill/plackettLuce          |           12,296 ops/sec |   ±0.74% | 89 runs sampled |

These were run on a 2013 Mac Pro 8-core 3.5 GHz 6-Core Intel Xeon E5, with nodejs 13.11.0 from a command line. The source code for this can be found in the package's `benchmark` directory. The high variance of TrueSkill is likely a result of being an iterative algorithm.

## Accuracy

Measuring accuracy is subjective. In a 2 team game, this is simple since there are only two possible outcomes; either the red team or the blue team wins. When we exclude games where two unknown/unrated teams play (which was only 0.4% of games from OverTrack), we find the following

| Model                 | Correct (higher is better) |
| --------------------- | -------------------------: |
| bradleyTerryFull      |             **54.336254%** |
| bradleyTerryPart      |             **54.336254%** |
| thurstonMostellerFull |                 54.143135% |
| thurstonMostellerPart |                 54.143135% |
| plackettLuce          |             **54.336254%** |
| trueskill             |                 54.193443% |

It seems that any ranking algorithm should be able to predict more than 54% of the time, but in pairing a team against another team in Overwatch, the game's matchmaking system attempts to pair players of similar skill.

With 18xx data, we see a different story. Many matches are either organized among friends, or randomly queued without regard to skill. Predicting the outcome of a match with 3 or more players can be objectively difficult. What is important? Predicting only 1st place? Predicting 1st, 2nd, and 3rd place? The context of the game is also important, for example in a Poker tournament the top 20-25% of players may receive a payout.

### Picking Winner, Picking Top 3

First, we look at only the predicted winner of a match. In this case, we're either right or wrong. This is simplest, and often times the only relevant metric. This is probably the easiest to understand. For this, some marginal leniancy is given toward all algorithms where when multiple players compete with the same rating, if any of them win then the result is considered a success. This reduces noise from new players whose rating sigma might be considered infinite, without biasing any method. Higher here is better.

Second, we consider that the predicted winner is in the top 3 finishers. Again, higher is better, and it can be expected that this should be correct much more often.

| Model                           | Predicting winner | Predicted in top 3 |
| ------------------------------- | ----------------: | -----------------: |
| TrueSkill                       |        **45.14%** |         **87.82%** |
| Openskill/bradleyTerryFull      |            44.44% |             87.34% |
| Openskill/bradleyTerryPart      |        **45.14%** |             87.56% |
| Openskill/thurstonMostellerFull |            39.12% |             85.00% |
| Openskill/thurstonMostellerPart |            44.15% |             86.98% |
| Openskill/plackettLuce          |            44.92% |             87.16% |

### Picking entire outcome

Third, we create an artifical metric for comparing the predicted outcome vs. the actual outcome. This is the sum for all players of the distance they are from their predicted rank. For example, if the predicted outcome is `[1, 2, 3, 4]` and the actual outcome is `[1, 3, 2, 4]`, then two players are 1 away from their predicted rank, and the metric for this would be 2. For games with more players, the highest that this could be is higher, so we divide this by the maximum difference; which would be the reverse of the predicted outcome. The negative of this is then taken and added to 1, so that 0.0 means _totally wrong_, and 1.0 means _totally right_

| Model                           | Picking entire outcome |
| ------------------------------- | ---------------------: |
| TrueSkill                       |                  0.464 |
| Openskill/bradleyTerryFull      |                  0.455 |
| Openskill/bradleyTerryPart      |                  0.456 |
| Openskill/thurstonMostellerFull |                  0.423 |
| Openskill/thurstonMostellerPart |                  0.451 |
| Openskill/plackettLuce          |              **0.458** |

### Picking entire outcome with license

Fourth, we measure the difference from predicted to actual by computing the cosine similarity of the two vectors. This could be more meaningful, since we may have a game of four players, _Alice_ `mu: 40`, _Betty_ `mu: 39.999`, _Cindy_, `mu: 20`, _Daisy_, `mu: 0`. In this match-up, we would predict the most likely outcome of `Alice, Betty, Cindy, Daisy`, however almost as likely would be `Betty, Alice, Cindy, Daisy`. That outcome would be much more reasonable than an outcome of `Alice, Betty, Daisy, Cindy`, as the difference in Daisy and Cindy is much greater.

| Model                           | Cosine Similarity to Predicted |
| ------------------------------- | -----------------------------: |
| TrueSkill                       |             0.9871333882702259 |
| Openskill/bradleyTerryFull      |             0.9670280189093087 |
| Openskill/bradleyTerryPart      |              0.991254308108686 |
| Openskill/thurstonMostellerFull |             0.9292664200294969 |
| Openskill/thurstonMostellerPart |         **0.9940281068887633** |
| Openskill/plackettLuce          |             0.9691814764747895 |

Here this shows that partial paring during re-ranking appears to be significantly better. Further work could be done to incorporate the _sigma_ of each player's rating, but this should show that

## Summary

In addition to being unencumbered by patents, it has been shown by various methods that our library is faster, which would be important for large scale applications; and comparably accurate using the default parameters. It would be appropriate to tune these parameters depending on the application and the specific facets of our game data, for instance Openskill's &epsilon; parameter could be increased to reduce the impact of rating plateaus. Discusson of how these parameters affect prediction is left for future work.
