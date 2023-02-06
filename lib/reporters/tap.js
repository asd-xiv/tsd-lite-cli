/** @typedef {import("./types").IntroFormatter} IntroFormatter */
/** @typedef {import("./types").TestFormatter} TestFormatter */
/** @typedef {import("./types").SuiteFormatter} SuiteFormatter */
/** @typedef {import("./types").Reporter} Reporter */

import { formatHrTime } from "../utils/node.js"

/**
 * Format intro to TAP format
 *
 * @type {IntroFormatter}
 *
 * @example
 * formatIntro({ count: 2 })
 * // => "TAP version 13"
 * // => "1..2"
 */
const formatIntro = ({ count, description }) =>
  ["TAP version 14", `1..${count}`, description ? `# ${description}` : ""].join(
    "\n"
  )

/**
 * Format test file result to TAP format
 *
 * @type {TestFormatter}
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
    return `ok ${index} - ${name} ${humanReadableDuration}`
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
 * @type {SuiteFormatter}
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
