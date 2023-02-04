import fs from "node:fs"

/**
 * @param {string} input
 * @returns {Promise<boolean>}
 */
export const checkCanReadFile = async input => {
  try {
    await fs.promises.access(input, fs.constants.R_OK)

    return true
  } catch {
    return false
  }
}
