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

const { name, description, version } = await getPackageInfo()

program
  .name(name)
  .description(description)
  .version(version, "-v, --version", "Display version number")
  .helpOption("-h, --help", "Display this help guide")
  .showSuggestionAfterError()
  .addOption(
    new Option("-r, --reporter <name>", "Print results using reporter")
      .default("tap")
      .choices(["tap", "fancy"])
  )
  .argument("globPatterns...", "Typing test files glob patterns")
  .action(async (globPatterns, { reporter: reporterName }) => {
    const reporter = reporterName === "tap" ? tapReporter : fancyReporter
    const files = fastGlob.sync(globPatterns, { absolute: true })

    process.stdout.write(
      `${reporter.formatIntro({
        count: files.length,
        description: program.description(),
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
        const stats = results.reduce(
          (acc, testResult) => {
            if (testResult.errors.length === 0) {
              acc.passCount += 1
            } else {
              acc.failCount += 1
            }

            acc.duration = [
              acc.duration[0] + testResult.duration[0],
              acc.duration[1] + testResult.duration[1],
            ]

            return acc
          },
          {
            passCount: 0,
            failCount: 0,
            duration: /** @type {[number, number]} */ ([0, 0]),
          }
        )

        process.stdout.write(`\n${reporter.formatSuite(stats)}\n`)

        if (stats.failCount > 0) {
          process.exit(1)
        }

        process.exit(0)
      },
    })
  })

program.parse(process.argv)
