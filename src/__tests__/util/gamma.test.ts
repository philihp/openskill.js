import { describe, it, expect } from '#test-helpers'
import { gamma } from '../../util'
import { rating } from '../..'

// Replicates openskill.py's test_gamma: the default gamma is sqrt(sigmaSq) / c.
// https://github.com/vivekjoshy/openskill.py/blob/v6.2.0/tests/models/weng_lin/test_plackett_luce.py#L270-L280
describe('util#gamma (default)', () => {
  const defaultGamma = gamma({})
  const team = [rating(), rating(), rating(), rating(), rating()]

  it('returns sqrt(sigmaSq) / c, matching openskill.py', () => {
    expect.assertions(3)
    expect(defaultGamma(2, 2, 3, 4, team, 0)).toBeCloseTo(1)
    expect(defaultGamma(2, 2, 3, 16, team, 0)).toBeCloseTo(2)
    expect(defaultGamma(2, 2, 3, 64, team, 1)).toBeCloseTo(4)
  })
})
