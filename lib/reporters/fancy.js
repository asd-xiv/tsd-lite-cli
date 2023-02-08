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
 * formatIntro({
 *   count: 2,
 *   patterns: ["src/*.test-d.ts"]
 * })
 * // => "Matching pattenrs: src/*.test-d.ts"
 * // => "File count: 2"
 */
const formatIntro = ({ count, patterns }) =>
  [
    `${bold("Matching patterns:")} ${patterns.join(",")}`,
    `${bold("File count:")} ${count}`,
    "",
  ].join("\n")

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
 * // => " PASS 0.8s src/__tests__/index.test.js"
 *
 * @example
 * formatTest({
 *   name: "src/__tests__/index.test.js",
 *   errors: [
 *     { row: 1, column: 1, message: "Unexpected token" },
 *   ],
 * })
 * // => " FAIL 1.2s src/__tests__/index.test.js"
 * // => "  (1:1) Unexpected token
 */
const formatTest = ({ result: { name, duration, errors = [] } }) => {
  const status = errors.length === 0 ? PASS_TAG : FAIL_TAG
  const humanReadableDuration = formatHrTime(duration)
  const output = [
    `${status} ${gray.fgSecondary(humanReadableDuration)} ${highlightFileName(
      name
    )}`,
  ]

  for (const error of errors) {
    output.push(
      error.row
        ? `  ${gray.fg(`(${error.row}:${error.column})`)} ${error.message}`
        : `  ${error.message}`
    )
  }

  return output.join("\n")
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
