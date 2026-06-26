# Changelog

## Unreleased

- Adds partial-play support via the `weight` option. Weights are shaped like
  `teams` (one number per player) and scale how much each player's rating moves,
  matching openskill.py bit-for-bit. By default each team's weights are
  normalized into `[1, 2]` (configurable via the new `weightBounds` option); pass
  `weightBounds: null` to apply raw weights without normalization. Previously the
  `weight` option was accepted but ignored.

## v5.0.1

- Shrinks the published package from ~683KB to ~194KB by emitting external
  sourcemaps and excluding them from the npm tarball, rather than embedding
  inline base64 sourcemaps in every module. No runtime changes.

## v5.0.0

- Outputs should now match bit-for-bit with the [python](https://github.com/vivekjoshy/openskill.py)
  port. Relative to 4.x, outputs drift by an infinitesimal ~1e-8 per call and compound slowly. Users who relied on default-derivation from mu, or who use Thurstone-Mosteller draws, will see larger
  differences. If you rederive your present day ratings using 5.x from historical matches, your users
  may notice a small but justifiable change in their rating.
- `sigma` now defaults to `25/3`, rather than being calculated from `mu` or `z`. Explicitly pass a
  `sigma` to keep old behavior.
- `beta` now defaults to `25/6`, rather than being calculated from `mu` or `z`. Explicitly pass a
  `beta` to keep
  old behavior.
- `tau` is now applied unconditionally. Pass `tau: 0` to disable. Its default also changed from
  `mu/300` to `25/300` so if you specified a different `mu`, derive a `tau` to keep old behavior.
- `epsilon`, used in the Thurstone-Mosteller draw margin defaults to `0.1`. Previously
  it was `0.0001` and double-served as both the draw margin and the per-step
  sigma floor. The floor is now keyed off `kappa` (default `0.0001`).
- Thurstone-Mosteller model no longer uses [gaussian](https://github.com/errcw/gaussian/) because
  it contains a call to Math.exp whose implementation is only approximately defined by
  [ECMAScript](https://tc39.es/ecma262/multipage/overview.html#implementation-approximated). Instead,
  it now uses CDF/PDF norm functions from [stdlib](https://stdlib.io/) which are deterministic across
  platforms and match Python's `statistics.NormalDist` (available since Python 3.8).
- Removes the long-deprecated `preventSigmaIncrease` option (renamed to `limitSigma` in v4.0.0).

## v4.1.1

- Change import path for other models, fixing an example that did not work out of the box.
- Simpler calculation in `ordinal` function.

## v4.1.0

- Export types such as `Model`.
- Fix `predictDraw` to give the same result as the Python implementation.
- Add missing export for models.
- Various library updates.

## v4.0.3

- Fix importing `sort-unwind` by using a named export, which was failing with TypeScript and CommonJS.

## v4.0.2

- Dual-export CJS and ESM modules.

## v4.0.1

- Switch to using `esbuild`.

## v4.0.0

- **Breaking:** Fixes a bug with `predictWin` and `predictDraw`. These now return different
  predictions.
- Deprecates `preventSigmaIncrease`, renamed to `limitSigma`. The former syntax will go away in the
  next major version.
- Removes building for Node 14 through 17, and Node 19. Might still work, but no guarantees.
- Adds explicit build/testing for Node 22.

## v3.1.0

- Explicit support for Node 19 and Node 20.

## v3.0.1

- Add default `tau` of `0.0833333`.

## v3.0.0

- **Breaking:** Change the way alternate models are used. Rather than sending in a string/name of the
  model, you now import the model function itself and pass that in. This enables people to extend
  the library and experiment with models that support partial play.
- **Breaking:** Removes support for Node 11-13. This version supports Node 14/ES2020.
- Adds TypeScript types.
- Emit TypeScript declarations.
- Fix `predictDraw` self-vs-self test.

## v2.1.0

New options:

- `tau` (defaults to `0`): Additive dynamics factor, which keeps a player's rating from getting
  stuck at a level. Normally, a player's _sigma_ will only decrease as we gain more information
  about their performance. This option will put some pressure on this back up. This default will
  change to `sigma/100` in v3, to be more congruent with TrueSkill.
- `preventSigmaIncrease` (defaults to `false`): for a `tau > 0`, it is possible that a player could
  play someone with a low enough rating that even if they win, their ordinal rating will still go
  down slightly. If your players have no agency in matchmaking, it is not desirable to have a
  situation where a player goes down on the leaderboard even though they win.

## v2.0.0

- **Breaking:** Remove support for Node 10.
- Use native `Array.flat()`.
- Remove deprecated `thurstonMosteller` (typo of `thurstone`).
- Add support for Node 17.

## v1.6.0

- Add `predictDraw`.
- Add `predictWin`.
- Fix typo: `thurston` → `thurstone`.

## v1.5.0

- Add explicit support for Node 16.
- Hint to bundlers that this has no side effects.
- Refactor: use `sort-unwind` instead of reorder.
- Add win probability function for 1v1.

## v1.4.1

- Fix a bug that occurred when using the Thurstone-Mosteller model with tied ranks, due to the wrong
  epsilon used in the gaussian approximation functions.
- Fix for Plackett-Luce to respect a custom gamma function.

## v1.4.0

- Customizable gamma function.

## v1.3.0

- Refactors for 100% test coverage.
- Configurable constants.

## v1.2.0

- Add support for Node 15.
- Add support for tied rankings.

## v1.1.1

- Allow `mu`/`sigma` to initialize to zero.

## v1.1.0

- Added `rate(_, { rank: [1, 2, 3, ..., n] })` option.

## v0.4.0

- Support Thurstone-Mosteller partial pairing model.
- Support Thurstone-Mosteller full pairing model.

## v0.3.0

- Add support for Bradley-Terry partial pair model.
- Add support for Bradley-Terry full pairing model.

## v0.2.0

- Adds default support for ratings using a Plackett-Luce model.

## v0.1.0

- # Initial release.
  platforms and match Python's statistics.NormalDist (available since Python 3.8).
  > > > > > > > Stashed changes
