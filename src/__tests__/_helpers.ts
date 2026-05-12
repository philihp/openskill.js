import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'

export { describe, it }

type Matchers = {
  toBe(expected: unknown): void
  toEqual(expected: unknown): void
  toStrictEqual(expected: unknown): void
  toBeCloseTo(expected: number, numDigits?: number): void
  toBeGreaterThan(expected: number): void
  toBeLessThan(expected: number): void
  toBeLessThanOrEqual(expected: number): void
  toBeNaN(): void
  toBeFalsy(): void
  toHaveLength(length: number): void
  toMatchObject(expected: object): void
  toThrow(expected?: unknown): void
  not: {
    toThrow(expected?: unknown): void
  }
}

function assertSubset(actual: unknown, expected: unknown): void {
  if (expected === null || typeof expected !== 'object') {
    assert.deepStrictEqual(actual, expected)
    return
  }
  assert.ok(actual !== null && typeof actual === 'object', `Expected an object, got ${String(actual)}`)
  for (const key of Object.keys(expected as Record<string, unknown>)) {
    const exp = (expected as Record<string, unknown>)[key]
    const act = (actual as Record<string, unknown>)[key]
    if (exp !== null && typeof exp === 'object') {
      assertSubset(act, exp)
    } else {
      assert.strictEqual(act, exp)
    }
  }
}

function callThrows(fn: () => unknown): unknown | undefined {
  try {
    fn()
  } catch (err) {
    return err ?? new Error('threw a falsy value')
  }
  return undefined
}

function matchesThrown(err: unknown, expected: unknown): boolean {
  if (expected === undefined) return true
  if (typeof expected === 'string') {
    return err instanceof Error && err.message.includes(expected)
  }
  if (expected instanceof RegExp) {
    const msg = err instanceof Error ? err.message : String(err)
    return expected.test(msg)
  }
  if (typeof expected === 'function') {
    return err instanceof (expected as new (...a: unknown[]) => unknown)
  }
  return false
}

function buildMatchers(actual: unknown): Matchers {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected)
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected)
    },
    toStrictEqual(expected) {
      assert.deepStrictEqual(actual, expected)
    },
    toBeCloseTo(expected, numDigits = 2) {
      const tolerance = Math.pow(10, -numDigits) / 2
      const diff = Math.abs((actual as number) - expected)
      assert.ok(
        diff < tolerance,
        `Expected ${String(actual)} to be close to ${String(expected)} within ${tolerance} (precision ${numDigits}); diff was ${diff}`
      )
    },
    toBeGreaterThan(expected) {
      assert.ok((actual as number) > expected, `Expected ${String(actual)} > ${String(expected)}`)
    },
    toBeLessThan(expected) {
      assert.ok((actual as number) < expected, `Expected ${String(actual)} < ${String(expected)}`)
    },
    toBeLessThanOrEqual(expected) {
      assert.ok((actual as number) <= expected, `Expected ${String(actual)} <= ${String(expected)}`)
    },
    toBeNaN() {
      assert.ok(Number.isNaN(actual), `Expected ${String(actual)} to be NaN`)
    },
    toBeFalsy() {
      assert.ok(!actual, `Expected ${String(actual)} to be falsy`)
    },
    toHaveLength(length) {
      assert.strictEqual((actual as { length: number }).length, length)
    },
    toMatchObject(expected) {
      assertSubset(actual, expected)
    },
    toThrow(expected) {
      const err = callThrows(actual as () => unknown)
      assert.ok(err !== undefined, `Expected function to throw`)
      assert.ok(
        matchesThrown(err, expected),
        `Thrown error did not match expectation: ${err instanceof Error ? err.message : String(err)}`
      )
    },
    not: {
      toThrow(expected) {
        const err = callThrows(actual as () => unknown)
        if (err === undefined) return
        if (expected !== undefined && !matchesThrown(err, expected)) return
        assert.fail(`Expected function not to throw, but it threw: ${err instanceof Error ? err.message : String(err)}`)
      },
    },
  }
}

export function expect(actual: unknown): Matchers {
  return buildMatchers(actual)
}

// Jest API compatibility no-op; node:test does not need an explicit assertion count.
expect.assertions = (_count: number): void => {}
