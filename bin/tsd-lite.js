#!/usr/bin/env node

import fastGlob from "fast-glob"
import { program } from "commander"

import tapReporter from "../lib/tap-reporter.js"
import { getNodeVersion, getPackageInfo } from "../lib/utils/node.js"
import { green, red } from "../lib/utils/terminal-text.js"
import { runSuite } from "../lib/run-many.js"

/**
 * Node.js version guard
 */

const required = 16
const [major] = getNodeVersion()

if (major < required) {
  process.stderr.write(
    `You are running Node ${red.fg(
      `v${major}`
    )}, tsd-lite requires Node ${green.fg(`v${required}`)} or higher.`
  )

  process.exit(1)
}

/**
 * CLI specific logic via "commander"
 */

const { description, version } = await getPackageInfo()
const processStartAt = process.hrtime()
const isCI = process.env["CI"] === "true"

program
  .name("tsd-lite")
  .description(description)
  .version(version, "-v, --version", "Print version number")
  .helpOption("-h, --help", "Print this help guide")
  .showSuggestionAfterError()
  .option(
    "-c, --color",
    "Output colored TAP for better human consumption. Disabled in CI environments if not explicitly set.",
    !isCI
  )
  .option(
    "--no-color",
    "Disable colored TAP, usefull when piping to other tools"
  )
  .argument("<patterns...>", "Glob patterns for matching test files")
  .action(async (patterns, { color: hasColor }) => {
    const files = fastGlob.sync(patterns, { absolute: true })

    process.stdout.write(
      `${tapReporter.formatPlan({
        count: files.length,
        patterns,
        hasColor,
      })}\n`
    )

    runSuite(files, {
      onTestFinish: (result, index) => {
        process.stdout.write(
          `${tapReporter.formatTest({
            index,
            result,
            hasColor,
          })}\n`
        )
      },
      onSuiteFinish: results => {
        // eslint-disable-next-line unicorn/no-array-reduce
        const { passCount, failCount } = results.reduce(
          (acc, testResult) => {
            if (testResult.errors.length === 0) {
              acc.passCount += 1
            } else {
              acc.failCount += 1
            }

            return acc
          },
          { passCount: 0, failCount: 0 }
        )

        process.stdout.write(
          `\n${tapReporter.formatSummary({
            passCount,
            failCount,
            duration: process.hrtime(processStartAt),
            hasColor,
          })}\n`
        )

        if (failCount > 0) {
          process.exit(1)
        }

        process.exit(0)
      },
    })
  })

program.parse(process.argv)
