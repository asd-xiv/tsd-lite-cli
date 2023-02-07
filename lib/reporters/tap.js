/** @typedef {import("./_signature").Reporter} Reporter */

import { formatHrTime } from "../utils/node.js"

/**
 * Format intro to TAP format
 *
 * @type {Reporter['formatIntro']}
 *
 * @example
 * formatIntro({ count: 2, description: "Matching XX glob patterns"})
 * // => "TAP version 14"
 * // => "1..2 # Matching XX glob patterns"
 */
const formatIntro = ({ count, description }) => {
  const reason = description ? `# ${description}` : ""

  return ["TAP version 14", `1..${count} ${reason}`].join("\n")
}

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
 * // => "ok 1 - src/__tests__/index.test.js 0.8s"
 *
 * @example
 * formatTestResult({
 *   name: "src/__tests__/index.test.js",
 *   errors: [
 *     { row: 1, column: 1, message: "Unexpected token" },
 *   ],
 * })
 * // => "not ok 1 - src/__tests__/index.test.js 1.2s"
 * // => "  ---"
 * // => "  message: 'Unexpected token'
 * // => "  severity: fail"
 * // => "  data:"
 * // => "    row: 1"
 * // => "    column: 1"
 * // => "  ..."
 */
const formatTest = ({ index, result: { name, duration, errors } }) => {
  const humanReadableDuration = formatHrTime(duration)

  if (errors.length === 0) {
    return `ok ${index + 1} - ${name} ${humanReadableDuration}`
  }

  const output = [`not ok - ${index} ${name} ${humanReadableDuration}`]

  for (const error of errors) {
    output.push(
      `  ---`,
      `  message: '${error.message}'`,
      `  severity: fail`,
      `  data:`,
      `    row: ${error.row}`,
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
 * // => "1..2"
 * // => "# tests 2"
 * // => "# pass 1"
 * // => "# fail 1"
 * // => "Duration: 5.42s"
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
