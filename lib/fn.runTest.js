import path from "node:path"
import tsdLite from "tsd-lite"

// @ts-ignore
const tsd = /** @type {typeof tsdLite} */ (tsdLite.default)

/**
 * @typedef DiagnosisError
 *
 * @property {string} message
 * @property {number} [row]
 * @property {number} [column]
 */

/**
 * @typedef Diagnosis
 *
 * @property {string}           name
 * @property {number}           assertionCount
 * @property {[number, number]} duration
 * @property {DiagnosisError[]} errors
 */

/**
 * @param {string} absolutePath
 * @returns {Diagnosis}
 *
 * @example
 * runTest("/home/lorem/src/fn.test-d.ts")
 * // {
 * //   name: "src/fn.test-d.ts",
 * //   pass: true,
 * //   assertionCount: 1,
 * //   errors: []
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
        row: position.line + 1,
        column: position.character + 1,
      }
    }),
  }
}
