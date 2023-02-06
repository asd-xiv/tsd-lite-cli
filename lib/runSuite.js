import { runTest } from "./runTest.js"

/**
 * @callback OnTestFinish
 * @param {ReturnType<runTest>} result
 * @param {number}              index
 * @returns {void}
 */

/**
 * @callback OnSuiteFinish
 * @param {ReturnType<runTest>[]} results
 * @returns {void}
 */

/**
 * Run a suite of test files and return a more friendly result format
 *
 * @param {string[]}      absolutePaths
 * @param {Object}        props
 * @param {OnTestFinish}  props.onTestFinish
 * @param {OnSuiteFinish} props.onSuiteFinish
 * @returns {void}
 *
 * @example
 * runSuite(["/home/lorem/src/fn.test-d.ts"], {
 *   onTestFinish: (result, index) => {},
 *   onSuiteDone: (results) => {},
 * })
 */
export const runSuite = (absolutePaths, { onTestFinish, onSuiteFinish }) => {
  const results = absolutePaths.map((item, index) => {
    // TODO: async via worker threads maybe?
    const result = runTest(item)

    onTestFinish(result, index)

    return result
  })

  onSuiteFinish(results)
}
