/** @typedef {import("./_signature").Reporter} Reporter */

import { formatHrTime } from "../utils/node.js"

/**
 * Format intro to TAP format
 *
 * @type {Reporter['formatIntro']}
 *
 * @example
 * formatIntro({
 *   count: 2,
 *   patterns: ["src/*.test-d.ts"]
 * })
 * // => "TAP version 14"
 * // => "1..2"
 * // => "# Matching patterns src/*.test-d.ts"
 */
const formatIntro = ({ count, patterns }) =>
  [
    "TAP version 14",
    `1..${count}`,
    `# Matching patterns ${patterns.join(",")}`,
  ].join("\n")

/**
 * Format test file result to TAP format
 *
 * @type {Reporter['formatTest']}
 *
 * @example
 * formatTestResult({
 *   name: "src/__tests__/index.test.js",
 *   errors: [],
 * })
 * // => "ok 1 - 0.8s | src/__tests__/index.test.js"
 *
 * @example
 * formatTestResult({
 *   name: "src/__tests__/index.test.js",
 *   errors: [
 *     { row: 1, column: 1, message: "Unexpected token" },
 *   ],
 * })
 * // => "not ok 1 - 1.2s | src/__tests__/index.test.js"
 * // => "  ---"
 * // => "  message: 'Unexpected token'
 * // => "  severity: fail"
 * // => "  data:"
 * // => "    row: 1"
 * // => "    column: 1"
 * // => "  ..."
 */
const formatTest = ({ index, result: { name, duration, errors } }) => {
  const testPointStatus = errors.length === 0 ? "ok" : "not ok"
  const testPointId = index + 1
  const humanReadableDuration = formatHrTime(duration)
  const output = [
    `${testPointStatus} ${testPointId} - ${humanReadableDuration} ${name}`,
  ]

  for (const error of errors) {
    output.push(
      `  ---`,
      `  message: '${error.message}'`,
      `  severity: fail`,
      `  at:`,
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
 * @type {Reporter['formatSuite']}
 *
 * @example
 * formatSuiteResult({
 *   passCount: 1,
 *   failCount: 1,
 *   duration: [5, 420000000]
 * })
 * // => "# tests 2"
 * // => "# pass  1"
 * // => "# fail  1"
 * // => "# time  5.42s"
 */
const formatSuite = ({ passCount, failCount, duration }) => {
  const totalCount = passCount + failCount

  return [
    `# tests ${totalCount}`,
    `# pass  ${passCount}`,
    `# fail  ${failCount}`,
    `# time  ${formatHrTime(duration)}`,
  ].join("\n")
}

/** @type {Reporter} */
export default {
  formatIntro,
  formatTest,
  formatSuite,
}
