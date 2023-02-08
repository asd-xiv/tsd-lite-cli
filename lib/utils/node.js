import path from "node:path"
import { readFile } from "node:fs/promises"
import { cyan } from "./colors.js"

/**
 * Format Node.js `process.hrtime()` output to a human readable string.
 *
 * @param {[number, number]} input Node.js `process.hrtime()` output
 * @returns {string}
 *
 * @example
 * formatHrTime([1, 1_000_000])
 * // => "1.23s"
 */
export const formatHrTime = ([seconds, nanoseconds]) => {
  const milliseconds = nanoseconds / 1_000_000
  const totalMilliseconds = seconds * 1000 + milliseconds

  return `${Math.round((totalMilliseconds / 1000) * 100) / 100}s`
}

/**
 * Get Node.js full version as an array of numbers.
 *
 * @returns {[number, number, number]}
 *
 * @example
 * getNodeVersion()
 * // => [14, 15, 1]
 */
export const getNodeVersion = () => {
  const { node } = process.versions

  return /** @type {[number, number, number]} */ (
    node.split(".").map(Number.parseInt)
  )
}

/**
 * Read a file and parse it as JSON.
 *
 * @param {string} input File path
 *
 * @returns {Promise<Record<string, unknown>>}
 * @example
 * readFileAsJSON("/home/user/tsd-lite-cli/package.json")
 * // => { name: "tsd-lite-cli", version: "1.0.0", ... }
 */
export const readFileAsJSON = input =>
  readFile(input, "utf8")
    .then(buffer => JSON.parse(buffer.toString()))
    .catch(error => {
      console.error(
        "readFileAsJSON",
        "ERROR",
        `Failed to parse JSON file: ${cyan.fg(input)}`
      )

      throw error
    })

/**
 * @typedef {Object} PackageJSON
 *
 * @property {string} name
 * @property {string} description
 * @property {string} version
 */

/**
 * Get "tsd-lite-cli" package info from package.json file.
 *
 * @returns {Promise<PackageJSON>}
 * @example
 * getPackageInfo()
 * // => { name: "tsd-lite-cli", version: "1.0.0", ... }
 */
export const getPackageInfo = () => {
  const __dirname = new URL(import.meta.url).pathname
  const filePath = path.join(__dirname, "..", "..", "..", "package.json")

  return /** @type {Promise<PackageJSON>} */ (
    readFileAsJSON(path.resolve(filePath))
  )
}
