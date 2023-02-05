/**
 * Format Node.js `process.hrtime()` output to a human readable string.
 *
 * @param {[number, number]} input
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
