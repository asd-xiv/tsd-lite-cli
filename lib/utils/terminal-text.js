/* eslint-disable jsdoc/require-example */

// Thank you Copilot for the auto-completions

export const red = {
  /** @param {string} input */
  bg: input => `\u001B[41m${input}\u001B[0m`,

  /** @param {string} input */
  bgSecondary: input => `\u001B[101m${input}\u001B[0m`,

  /** @param {string} input */
  fg: input => `\u001B[31m${input}\u001B[0m`,

  /** @param {string} input */
  fgSecondary: input => `\u001B[91m${input}\u001B[0m`,
}

export const green = {
  /** @param {string} input */
  bg: input => `\u001B[42m${input}\u001B[0m`,

  /** @param {string} input */
  bgSecondary: input => `\u001B[102m${input}\u001B[0m`,

  /** @param {string} input */
  fg: input => `\u001B[32m${input}\u001B[0m`,

  /** @param {string} input */
  fgSecondary: input => `\u001B[92m${input}\u001B[0m`,
}

export const gray = {
  /** @param {string} input */
  fg: input => `\u001B[90m${input}\u001B[0m`,

  /** @param {string} input */
  fgSecondary: input => `\u001B[37m${input}\u001B[0m`,
}

export const white = {
  /** @param {string} input */
  fg: input => `\u001B[97m${input}\u001B[0m`,

  /** @param {string} input */
  fgSecondary: input => `\u001B[37m${input}\u001B[0m`,
}

export const blue = {
  /** @param {string} input */
  fg: input => `\u001B[34m${input}\u001B[0m`,
}

export const black = {
  /** @param {string} input */
  fg: input => `\u001B[30m${input}\u001B[0m`,
}

export const cyan = {
  /** @param {string} input */
  fg: input => `\u001B[36m${input}\u001B[0m`,
}

/** @param {string} input */
export const bold = input => `\u001B[1m${input}\u001B[0m`

/**
 * Clean a string from ANSI codes
 *
 * @param {string} input
 */
export const removeANSICodes = input =>
  // eslint-disable-next-line no-control-regex
  input.replaceAll(/\u001B\[\d{1,3}m/g, "")
