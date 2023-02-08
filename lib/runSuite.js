/** @typedef {import("./runTest.js").TestResult} TestResult */

import { runTest } from "./runTest.js"

/**
 * @callback OnTestFinish
 * @param {TestResult} result
 * @param {number}     index
 * @returns {void}
 */

/**
 * @callback OnSuiteFinish
 * @param {TestResult[]} results
 * @returns {void}
 */

/**
 * Run a suite of test files and return a more friendly result format.
 * Sequential version.
 *
 * @param {string[]}      paths
 * @param {Object}        props
 * @param {OnTestFinish}  props.onTestFinish
 * @param {OnSuiteFinish} props.onSuiteFinish
 * @returns {void}
 *
 * @example
 * runSuite(["/home/lorem/src/fn.test-d.ts"], {
 *   onTestFinish: (result, index) => {
 *     // print nicely formatted test result
 *   },
 *   onSuiteFinish: (results) => {
 *     // print nicely formatted summary
 *   },
 * })
 */
export const runSuite = (paths, { onTestFinish, onSuiteFinish }) => {
  const results = paths.map((item, index) => {
    // TODO: async via worker threads maybe?
    const result = runTest(item)

    onTestFinish(result, index)

    return result
  })

  onSuiteFinish(results)
}
