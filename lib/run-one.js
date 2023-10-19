import path from "node:path"

import tsdLite from "tsd-lite"

// @ts-ignore
const tsd = /** @type {typeof tsdLite} */ (tsdLite.default)

/**
 * @typedef TestError
 * @property {string} message
 * @property {string} [file]
 * @property {number} [row]
 * @property {number} [column]
 */

/**
 * @typedef TestResult
 * @property {string}           name
 * @property {number}           assertionCount
 * @property {[number, number]} duration
 * @property {TestError[]}      errors
 */

/**
 * Run a test file and return a more friendly result format
 *
 * @param {string} absolutePath
 * @returns {TestResult}
 *
 * @example
 * runTest("/home/lorem/src/fn.test-d.ts")
 * // {
 * //   name: "src/fn.test-d.ts",
 * //   assertionCount: 1,
 * //   duration: [1, 123456789],
 * //   errors: []
 * // }
 *
 * @example
 * runTest("/home/lorem/src/fn-with-error.test-d.ts")
 * // {
 * //   name: "src/fn.test-d.ts",
 * //   assertionCount: 1,
 * //   duration: [1, 123456789],
 * //   errors: [{
 * //     message: "Argument of type 'string' is not assignable ...",
 * //     file: "/home/lorem/src/fn-with-error.test-d.ts",
 * //     row: 1,
 * //     column: 1,
 * //   }]
 * // }
 */
export const runTest = absolutePath => {
  const startAt = process.hrtime()
  const relativeToCwd = path.relative(process.cwd(), absolutePath)
  const result = tsd(absolutePath)

  return {
    name: relativeToCwd,
    assertionCount: result.assertionsCount,
    duration: process.hrtime(startAt),
    errors: result.tsdResults.map(error => {
      if (!error.file) {
        return {
          message: error.messageText.toString(),
        }
      }

      const position = error.file.getLineAndCharacterOfPosition(
        error.start ?? 0
      )

      return {
        message: error.messageText.toString(),
        file: error.file.fileName,
        row: position.line + 1,
        column: position.character + 1,
      }
    }),
  }
}
