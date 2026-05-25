# SPEC

## §G GOAL

Provide TypeScript/JavaScript OpenSkill rating lib: create ratings, update teams after ranked match, compute ordinals, predict win/draw chance, export selectable Weng-Lin models.

## §C CONSTRAINTS

- Node `>=18.0.0`; package type ESM.
- Build via `tsup`; publish CJS, ESM, `.d.ts` under `dist`.
- Public package name `openskill`; side effects false.
- Keep default constants: `mu=25`, `z=3`, `sigma=mu/z`, `beta=sigma/2`, `tau=mu/300`, `epsilon=0.0001`.
- Use `ramda`, `sort-unwind`, `@stdlib/stats-base-dists-normal-*`; no hidden service/runtime.
- Tests use Jest + esbuild-jest; exact numeric fixtures lock behavior.
- LFS tracks `*.jsonl`; benchmark data may be large.
- Margin support first targets `thurstoneMostellerFull`; other models require explicit follow-up scope.
- Margin semantics should mirror `openskill.py` Weng-Lin TMFull: score diff > `margin` and `margin > 0` → divide TM update input by `log1p(scoreDiff / margin)`.

## §I INTERFACES

- pkg: `openskill` exports `rating`, `rate`, `ordinal`, `predictWin`, `predictDraw`, `Rating`, `Team`, `Rank`, `Gamma`, `Model`, `Options`.
- pkg: `openskill/models` exports `plackettLuce`, `bradleyTerryFull`, `bradleyTerryPart`, `thurstoneMostellerFull`, `thurstoneMostellerPart`.
- api: `rating(init?, options?) → { mu, sigma }`.
- api: `rate(teams, options?) → Team[]`; accepts `rank`, `score`, `margin`, `model`, `tau`, `limitSigma`, `preventSigmaIncrease`, `weight`, `gamma`, `balance`, `kappa`.
- api: `ordinal(rating, options?) → number`; formula `target + alpha * (mu - z * sigma)`.
- api: `predictWin(teams, options?) → number[]`; output ordered like input teams.
- api: `predictDraw(teams, options?) → number`; `NaN` allowed for empty/degenerate inputs.
- cmd: `npm run build` → build package.
- cmd: `npm test` → run Jest suite.
- cmd: `npm run lint` → run ESLint.
- file: `benchmark/*.jsonl` → benchmark input, LFS-managed.

## §V INVARIANTS

V1: `rating()` ! return `{ mu: 25, sigma: 25/3 }`.
V2: `rating({ mu })` ! default `sigma=mu/z`; `mu=0` allowed → `sigma=0`.
V3: `rating({ sigma })` ! preserve sigma incl `0`; default `mu=25`.
V4: `rate()` default model ! `plackettLuce`; output shape/order ! match input teams after rank unwind.
V5: lower `rank` ! better result; `score` ! invert to rank where higher score better; equal rank/score ! tie.
V6: `rate(...,{ tau })` ! add dynamics before model; `limitSigma` or deprecated `preventSigmaIncrease` ! output sigma ≤ input sigma.
V7: teams may be asymmetric; multi-player teams update each member; `weight` option accepted without throw.
V8: `ordinal(r,{z,alpha,target})` ! equal `target + alpha * (r.mu - z*r.sigma)`.
V9: `predictWin()` ! ignore `rank`; probabilities ! sum to `1` within floating tolerance.
V10: equal-rating FFA `predictWin()` ! uniform probability for each team.
V11: `predictDraw()` ! mirror known Python/manual fixtures within tolerance; empty or single-team degenerate cases ! return current NaN/1 behavior.
V12: all exported models ! run through `rate()` and match locked fixtures for 3-way default ratings with `epsilon=0.1`.
V13: statistics helpers `phiMajor`, `phiMajorInverse`, `v`, `w`, `vt`, `wt` ! match existing numeric fixtures.
V14: build artifacts ! expose both root package and `/models` subpath types, CJS, and ESM.
V15: `Options.margin?: number` ! default `0`; no `score` or `margin<=0` → all model fixtures unchanged; zero/missing score or small margin → legacy rank-only behavior preserved.
V16: `rate()` ! pass score array sorted same as ranked teams to model; model index and `score[i]` stay aligned after unwind.
V17: `thurstoneMostellerFull` margin ! use `marginDivisor = log1p(abs(score[i]-score[q])/margin)` only when `scoreDiff > margin && margin > 0`; else `1`.
V18: `thurstoneMostellerFull` margin divisor ! apply to `v`, `w`, `vt`, `wt` input delta, not draw epsilon: `v((sign*deltaMu)/divisor, EPSILON/ciq)`, `vt(deltaMu/divisor, EPSILON/ciq)`.
V19: margin blowout test ! same ranks + larger score gap with positive margin changes update magnitude vs narrow win; zero margin equals legacy score-as-rank behavior.
V24: `bradleyTerryFull`/`bradleyTerryPart` margin ! divisor applied to `(qMu-iMu)/divisor` inside `piq` exponential.
V25: `thurstoneMostellerPart` margin ! divisor applied to `deltaMu` as in TMFull.
V26: `plackettLuce` margin ! adjust effective `mu` in `exp(mu/c)` via pairwise margin factors (Python `openskill.py` PL semantics); no margin → unadjusted mu, same as legacy.
V20: Python parity tests ! not require Python, network, or cloned `openskill.py` during normal `npm test`; fixtures checked into repo.
V21: parity fixture metadata ! record `openskill.py` repo URL, commit/ref, Python version, model, options, input teams, expected teams, tolerance.
V22: TMFull parity cases ! cover no score, zero margin, margin below threshold, margin above threshold, tie, reordered score, asymmetric teams.
V23: parity tolerance ! default `1e-9`; any looser tolerance needs case-local reason.

## §T TASKS

id|status|task|cites
T1|x|distill existing OpenSkill API/spec from repo|§G,§I
T2|x|install deps and run current Jest suite|V1,V4,V9,V12,V13
T3|x|run `npm run build` and verify `dist` exports|V14,§I
T4|.|run `npm run lint` and fix only behavior-neutral lint drift|§C
T5|.|add custom-model + `weight` behavior example/test or document no-op for default PL|V7
T6|.|document Git LFS Windows `git status` workaround if reproducible|§C,§I
T7|.|audit `predictDraw` degenerate naming/docs: one-team/empty-team tests say `1` but expect `NaN` in one case|V11
T8|x|Plan A: add `margin?: number` + sorted score plumbing; implement margin only in `thurstoneMostellerFull`|V15,V16,V17,V18
T9|x|Plan A tests: TMFull legacy unchanged, zero margin unchanged, narrow vs blowout differs, sorted score alignment covered|V15,V16,V19
T10|x|Plan A docs: README/API mention margin only affects score-based TMFull currently|§I,V17
T11|x|Plan B: after Plan A, add same margin semantics to `bradleyTerryFull` with fixtures|V15,V16,V19
T12|x|Plan C: port margin to all Weng-Lin models; decide PL listwise semantics before code|V12,V15,V16
T13|.|Plan D spec: design fixture-based Python parity suite; pin `openskill.py` source/ref and fixture schema|V20,V21,V22,V23
T14|.|Plan D generator: create optional script to produce TMFull fixtures from pinned `openskill.py`; output checked-in JSON|V20,V21,V22
T15|.|Plan D tests: Jest loads TMFull parity JSON and compares JS output within per-case tolerance|V17,V18,V20,V23
T16|.|Plan D docs: document how to refresh parity fixtures and why Python not required for normal tests|§I,V20,V21

## §B BUGS

id|date|cause|fix
