#!/usr/bin/env node

import fastGlob from "fast-glob"
import { formatSuiteResult, formatTestResult } from "../lib/formatter.fancy.js"
import { runTest } from "../lib/fn.runTest.js"

const globPatterns = process.argv.slice(2)
const stats = fastGlob
  .sync(globPatterns, { absolute: true })
  .map(absolutePath => {
    const diagnosis = runTest(absolutePath)
    const output = formatTestResult(diagnosis)

    if (diagnosis.errors.length === 0) {
      process.stdout.write(`${output}\n`)
    } else {
      process.stderr.write(`${output}\n`)
    }

    return diagnosis
  })
  // eslint-disable-next-line unicorn/no-array-reduce
  .reduce(
    (acc, diagnosis) => {
      if (diagnosis.errors.length === 0) {
        acc.passCount += 1
      } else {
        acc.failCount += 1
      }
      acc.duration = [
        acc.duration[0] + diagnosis.duration[0],
        acc.duration[1] + diagnosis.duration[1],
      ]

      return acc
    },
    {
      passCount: 0,
      failCount: 0,
      duration: /** @type {[number, number]} */ ([0, 0]),
    }
  )

process.stdout.write(`\n${formatSuiteResult(stats)}\n`)

if (stats.failCount > 0) {
  process.exit(1)
}

process.exit(0)
