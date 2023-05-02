/** @typedef {import("./run-one.js").TestError} TestError */

import path from "node:path"

import { formatHrTime } from "./utils/node.js"
import * as ttext from "./utils/terminal-text.js"

/**
 * Format into TAP plan
 *
 * @param {object}   props
 * @param {number}   props.count
 * @param {string[]} props.patterns
 * @param {boolean}  [props.hasColor]
 *
 * @example
 * formatPlan({
 *   count: 2,
 *   patterns: ["src/*.test-d.ts"]
 * })
 * // => "TAP version 14"
 * // => "1..2"
 * // => '# Matching patterns "src/*.test-d.ts"'
 */
const formatPlan = ({ count, patterns, hasColor = true }) => {
  let description = `# Matching patterns ${patterns
    .map(item => `"${item}"`)
    .join(",")}`

  if (hasColor) {
    description = ttext.blue.fg(description)
  }

  return [`TAP version 14`, `1..${count}`, description].join("\n")
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

  return `${ttext.gray.fgSecondary(folderName)}/${ttext.white.fgSecondary(
    ttext.bold(fileName)
  )}`
}

/**
 * Format test file result to TAP format
 *
 * @param {object}           props
 * @param {number}           props.index
 * @param {object}           props.result
 * @param {string}           props.result.name
 * @param {[number, number]} props.result.duration
 * @param {TestError[]}      props.result.errors
 * @param {boolean}          [props.hasColor]
 *
 * @example
 * formatTest({
 *   name: "src/__tests__/index.test.js",
 *   errors: [],
 * })
 * // => "ok 1 - src/__tests__/index.test.js 0.8s"
 *
 * @example
 * formatTest({
 *   name: "src/__tests__/index.test.js",
 *   errors: [
 *     { row: 1, column: 1, message: "Unexpected token" },
 *   ],
 * })
 * // => "not ok 1 - src/__tests__/index.test.js 1.2s"
 * // => "  ---"
 * // => "  message: Unexpected token
 * // => "  severity: fail"
 * // => "  data:"
 * // => "    line: 1"
 * // => "    column: 1"
 * // => "  ..."
 */
const formatTest = ({
  index,
  result: { name, duration, errors },
  hasColor = true,
}) => {
  let testPointStatus = `${errors.length === 0 ? "ok" : "not ok"} ${index + 1}`
  let humanReadableDuration = formatHrTime(duration)
  let fileName = name

  if (hasColor) {
    testPointStatus =
      errors.length === 0
        ? ttext.black.fg(ttext.green.bgSecondary(testPointStatus))
        : ttext.black.fg(ttext.red.bgSecondary(testPointStatus))
    fileName = highlightFileName(name)
    humanReadableDuration = ttext.gray.fgSecondary(humanReadableDuration)
  }

  const testPoint = `${testPointStatus} - ${fileName} ${humanReadableDuration}`
  const output = [testPoint]

  for (const error of errors) {
    const message = hasColor ? ttext.cyan.fg(error.message) : error.message

    output.push(
      `  ---`,
      `  message: ${message}`,
      `  severity: fail`,
      `  data:`,
      `    line: ${error.row}`,
      `    column: ${error.column}`,
      `  ...`
    )
  }

  return output.join("\n")
}

/**
 * Format the summary of multiple tests to TAP format
 *
 * @param {object}           props
 * @param {number}           props.passCount
 * @param {number}           props.failCount
 * @param {[number, number]} props.duration
 * @param {boolean}          [props.hasColor]
 *
 * @example
 * formatSummary({
 *   passCount: 1,
 *   failCount: 1,
 *   duration: [5, 420000000]
 * })
 * // => "# tests    2"
 * // => "# pass     1"
 * // => "# fail     1"
 * // => "# duration 5.42s"
 */
const formatSummary = ({ passCount, failCount, duration, hasColor = true }) => {
  const hasFailures = failCount > 0
  const totalCount = passCount + failCount
  let [testsLine, passLine, failLine, durationLine] = [
    `# tests    ${totalCount}`,
    `# pass     ${passCount}`,
    `# fail     ${failCount}`,
    `# duration ${formatHrTime(duration)}`,
  ]

  if (hasColor) {
    testsLine = hasFailures
      ? ttext.red.fgSecondary(testsLine)
      : ttext.green.fgSecondary(testsLine)
    passLine = ttext.green.fgSecondary(passLine)
    failLine = hasFailures
      ? ttext.red.fgSecondary(failLine)
      : ttext.gray.fgSecondary(failLine)
    durationLine = ttext.gray.fgSecondary(durationLine)
  }

  return [testsLine, passLine, failLine, durationLine].join("\n")
}

export default {
  formatPlan,
  formatTest,
  formatSummary,
}
