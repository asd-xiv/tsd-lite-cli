/** @typedef {import("./types.js").Diagnosis} Diagnosis */
/** @typedef {import("./types.js").DiagnosisStats} DiagnosisStats */

import path from "node:path"
import { red, green, black, gray, white, bold } from "./lib.colors.js"

const PASS_TAG = green.bgSecondary(black.fg(" PASS "))
const FAIL_TAG = red.bgSecondary(black.fg(" FAIL "))

/**
 * Emphasize the file name by contrasting it with the rest of the path
 *
 * @param {string} filePath
 * @returns {string}
 */
const highlightFileName = filePath => {
  const fileName = path.basename(filePath)
  const folderName = path.dirname(filePath)

  return `${gray.fgSecondary(folderName)}/${white.fgSecondary(bold(fileName))}`
}

/**
 * Format each test file result similar to Jest's default reporter
 *
 * @param {Diagnosis} input
 * @returns {string}
 */
export const formatDiagnosis = ({ name, pass, errors = [] }) => {
  const title = `${pass ? PASS_TAG : FAIL_TAG} ${highlightFileName(name)}`
  const output = [title]

  if (!pass) {
    const messages = errors.map(error =>
      error.row
        ? `  ${gray.fg(`(${error.row}:${error.column})`)} ${error.message}`
        : `  ${error.message}`
    )

    output.push(...messages, "")
  }

  return output.join("\n")
}

/**
 * @param {DiagnosisStats} input
 */
export const formatStats = ({ passCount, failCount }) => {
  const title = `${bold(white.fgSecondary("Summary"))}`
  const filesFail = red.fgSecondary(`${failCount} failed`)
  const filesPass = green.fgSecondary(`${passCount} passed`)
  const filesTotal = `${failCount + passCount} total`

  return `${title}: ${filesFail}, ${filesPass}, ${filesTotal}`
}
