/** @typedef {import("../src/types.js").Diagnosis} Diagnosis */

import path from "node:path"
import tsdLite from "tsd-lite"

/**
 * @param {string} absolutePath
 * @returns {Diagnosis}
 */
export const runTestFile = absolutePath => {
  const relativeToCwd = path.relative(process.cwd(), absolutePath)

  const result = tsdLite(absolutePath)

  return {
    name: relativeToCwd,
    pass: result.tsdResults.length === 0,
    assertionCount: result.assertionsCount,
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
