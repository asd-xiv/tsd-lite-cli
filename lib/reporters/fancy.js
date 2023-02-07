/** @typedef {import("./_signature").Reporter} Reporter */

import path from "node:path"

import { red, green, black, gray, white, bold } from "../utils/colors.js"
import { formatHrTime } from "../utils/node.js"

const PASS_TAG = green.bgSecondary(black.fg(" PASS "))
const FAIL_TAG = red.bgSecondary(black.fg(" FAIL "))

/**
 * Format the intro message similar to Jest's default reporter
 *
 * @type {Reporter['formatIntro']}
 *
 * @example
 * formatIntro({ count: 1 })
 * // => "Running 1 file through tsd-lite\n"
 *
 * @example
 * formatIntro({ count: 4 })
 * // => "Running 4 files through tsd-lite\n"
 */
const formatIntro = ({ count }) => {
  const files = count === 1 ? "file" : "files"

  return bold(`Running ${count} ${files} through tsd-lite\n`)
}

/**
 * Emphasize the file name by contrasting it with the rest of the path
 *
 * @param {string} filePath
 * @returns {string}
 *
 * @example
 * highlightFileName("src/__tests__/index.test.js")
 * // => "src/__tests__/index.test.js"
 * //    "^^^^^gray^^^^|^^^^white^^^^"
 */
const highlightFileName = filePath => {
  const fileName = path.basename(filePath)
  const folderName = path.dirname(filePath)

  return `${gray.fgSecondary(folderName)}/${white.fgSecondary(bold(fileName))}`
}

/**
 * Format test file result similar to Jest's default reporter
 *
 * @type {Reporter['formatTest']}
 *
 * @example
 * formatTest({
 *   name: "src/__tests__/index.test.js",
 *   errors: [],
 * })
 * // => " PASS  src/__tests__/index.test.js 0.8s"
 *
 * @example
 * formatTest({
 *   name: "src/__tests__/index.test.js",
 *   errors: [
 *     { row: 1, column: 1, message: "Unexpected token" },
 *   ],
 * })
 * // => " FAIL  src/__tests__/index.test.js 1.2s"
 * // => "  (1:1) Unexpected token
 * // => ""
 */
const formatTest = ({ result: { name, duration, errors = [] } }) => {
  const isPass = errors.length === 0
  const friendlyDuration = formatHrTime(duration)
  const title = `${isPass ? PASS_TAG : FAIL_TAG} ${highlightFileName(
    name
  )} ${gray.fgSecondary(friendlyDuration)}`

  if (isPass) {
    return title
  }

  const messages = errors.map(error =>
    error.row
      ? `  ${gray.fg(`(${error.row}:${error.column})`)} ${error.message}`
      : `  ${error.message}`
  )

  return [title, ...messages, ""].join("\n")
}

/**
 * Format the summary of multiple tests similar to Jest's default reporter
 *
 * @type {Reporter['formatSuite']}
 *
 * @example
 * formatSuite({
 *   passCount: 1,
 *   failCount: 1,
 *   duration: [5, 420000000]
 * })
 * // => "Summary:  1 failed, 1 passed, 2 total"
 * // => "Duration: 5.42s"
 */
const formatSuite = ({ passCount, failCount, duration }) => {
  const filesFail = red.fgSecondary(`${failCount} failed`)
  const filesPass = green.fgSecondary(`${passCount} passed`)
  const filesTotal = `${failCount + passCount} total`

  const [summaryLabel, durationLabel] = ["Summary: ", "Duration:"].map(item =>
    bold(white.fgSecondary(item))
  )

  return [
    `${summaryLabel} ${filesFail}, ${filesPass}, ${filesTotal}`,
    `${durationLabel} ${formatHrTime(duration)}`,
  ].join("\n")
}

/** @type {Reporter} */
export default {
  formatIntro,
  formatTest,
  formatSuite,
}
