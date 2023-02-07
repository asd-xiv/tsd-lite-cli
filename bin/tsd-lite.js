#!/usr/bin/env node

import fastGlob from "fast-glob"
import { Option, program } from "commander"

import tapReporter from "../lib/reporters/tap.js"
import fancyReporter from "../lib/reporters/fancy.js"

import { getNodeVersion, getPackageInfo } from "../lib/utils/node.js"
import { green, red } from "../lib/utils/colors.js"
import { runSuite } from "../lib/runSuite.js"

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

program
  .name("tsd-lite")
  .description(description)
  .version(version, "-v, --version", "Print version number")
  .helpOption("-h, --help", "Print this help guide")
  .showSuggestionAfterError()
  .addOption(
    new Option("-r, --reporter <name>", "Print test results using reporter")
      .default("tap")
      .choices(["tap", "fancy"])
  )
  .argument("globPatterns...", "Glob patterns for matching test files")
  .action(async (globPatterns, { reporter: reporterName }) => {
    const reporter = reporterName === "tap" ? tapReporter : fancyReporter
    const files = fastGlob.sync(globPatterns, { absolute: true })

    process.stdout.write(
      `${reporter.formatIntro({
        count: files.length,
      })}\n`
    )

    runSuite(files, {
      onTestFinish: (result, index) => {
        process.stdout.write(
          `${reporter.formatTest({
            index,
            result,
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
          `\n${reporter.formatSuite({
            passCount,
            failCount,
            duration: process.hrtime(processStartAt),
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
