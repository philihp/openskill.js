# openskill.py parity fixtures

These JSON files are vendored **verbatim** from openskill.py's own test suite at
tag [`v6.2.0`](https://github.com/vivekjoshy/openskill.py/tree/v6.2.0/tests/models/data):

| file                          | upstream source                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `plackettluce.json`           | `tests/models/data/plackettluce.json`                                                                        |
| `bradleyterryfull.json`       | `tests/models/data/bradleyterryfull.json`                                                                    |
| `bradleyterrypart.json`       | `tests/models/data/bradleyterrypart.json`                                                                    |
| `thurstonemostellerfull.json` | `tests/models/data/thurstonemostellerfull.json`                                                              |
| `thurstonemostellerpart.json` | `tests/models/data/thurstonemostellerpart.json`                                                              |

Each file holds the `model` hyperparameters plus the expected outputs for the
scenarios exercised by openskill.py's `test_rate` (`normal`, `ranks`, `scores`,
`margins`, `limit_sigma`, `ties`, `weights`, `balance`). openskill.py asserts
against them via its `check_expected()` helper; `parity-weng-lin.test.ts` runs
the identical inputs through openskill.js and asserts the identical constants, so
the two libraries are checked against the same ground truth.

To refresh, re-download the files at the desired upstream tag without editing
them — keeping them byte-for-byte identical is the point.
