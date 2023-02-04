/**
 * @typedef {Object} DiagnosisError
 * @property {string} message
 * @property {number} [row]
 * @property {number} [column]
 */

/**
 * @typedef Diagnosis
 * @property {string}           name
 * @property {boolean}          pass
 * @property {number}           assertionCount
 * @property {DiagnosisError[]} errors
 */

/**
 * @typedef {Object} DiagnosisStats
 * @property {number} passCount
 * @property {number} failCount
 */

export {}
