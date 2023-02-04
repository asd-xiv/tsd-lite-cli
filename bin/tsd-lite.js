#!/usr/bin/env node

/** @typedef {import("../src/types.js").Diagnosis} Diagnosis */

import fs from "node:fs"
import path from "node:path"

import { formatStats, formatDiagnosis } from "../src/formatter.fancy.js"
import { runTestFile } from "../src/index.js"

process.stdin.on("data", data => {
  const files = data.toString().trim().split("\n")
  const stats = files
    .map(file => {
      const absolutePath = path.resolve(process.cwd(), file.trim())

      // Check if the file is readable.
      fs.access(absolutePath, fs.constants.R_OK, error => {
        console.log(`${file} ${error ? "is not readable" : "is readable"}`)
      })

      if (!fs.access(absolutePath)) {
        process.stderr.write(`File not found: ${absolutePath}\n`)
        process.exit(1)
      }

      const diagnosis = runTestFile(file)
      const output = formatDiagnosis(diagnosis)

      if (diagnosis.pass) {
        process.stdout.write(`${output}\n`)
      } else {
        process.stderr.write(`${output}\n`)
      }

      return diagnosis
    })
    .reduce(
      (acc, diagnosis) => ({
        passCount: acc.passCount + (diagnosis.pass ? 1 : 0),
        failCount: acc.failCount + (diagnosis.pass ? 0 : 1),
      }),
      { passCount: 0, failCount: 0 }
    )

  process.stdout.write(`\n${formatStats(stats)}\n`)

  process.exit(stats.failCount === 0 ? 0 : 1)
})
