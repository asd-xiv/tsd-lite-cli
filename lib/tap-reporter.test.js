import test from "tape"

import tapReporter from "./tap-reporter.js"
import { removeANSICodes } from "./utils/terminal-text.js"

test("tap-reporter - formatPlan", t => {
  t.plan(2)

  const resultColored = tapReporter.formatPlan({
    count: 2,
    patterns: ["test"],
  })

  const resultPlain = tapReporter.formatPlan({
    count: 2,
    patterns: ["test"],
    hasColor: false,
  })

  const expected = [
    "TAP version 14",
    "1..2",
    '# Matching patterns "test"',
  ].join("\n")

  t.equal(
    // TODO: snapshots?
    removeANSICodes(resultColored),
    expected,
    "given [count, patterns and default hasColor eq true] should return [a TAP header, plan and colored description]"
  )

  t.equal(
    resultPlain,
    expected,
    "given [count, patterns and hasColor eq false] should return [a TAP header, plan and description]"
  )
})

test("tap-reporter - formatTest", t => {
  t.plan(4)

  {
    const resultColored = tapReporter.formatTest({
      index: 1,
      result: {
        name: "some/path/test-d.ts",
        duration: [1, 10_000_000],
        errors: [],
      },
    })

    const resultPlain = tapReporter.formatTest({
      index: 1,
      result: {
        name: "some/path/test-d.ts",
        duration: [1, 10_000_000],
        errors: [],
      },
      hasColor: false,
    })

    const expected = "ok 2 - some/path/test-d.ts 1.01s"

    t.equal(
      // TODO: snapshots?
      removeANSICodes(resultColored),
      expected,
      "given [success test result with default hasColor eq true] should return [a colored string with TAP test point - id, file name and duration]"
    )

    t.equal(
      resultPlain,
      expected,
      "given [success test result with hasColor eq false] should return [a plain string with TAP test point - id, file name and duration]"
    )
  }

  {
    const resultColored = tapReporter.formatTest({
      index: 1,
      result: {
        name: "some/path/test-d.ts",
        duration: [1, 10_000_000],
        errors: [
          {
            message: "Some bad thing happened",
            row: 1,
            column: 2,
          },
        ],
      },
    })

    const resultPlain = tapReporter.formatTest({
      index: 1,
      result: {
        name: "some/path/test-d.ts",
        duration: [1, 10_000_000],
        errors: [
          {
            message: "Some bad thing happened",
            row: 1,
            column: 2,
          },
        ],
      },
      hasColor: false,
    })

    const expected = [
      "not ok 2 - some/path/test-d.ts 1.01s",
      "  ---",
      "  message: Some bad thing happened",
      "  severity: fail",
      "  data:",
      "    line: 1",
      "    column: 2",
      "  ...",
    ].join("\n")

    t.equal(
      // TODO: snapshots?
      removeANSICodes(resultColored),
      expected,
      "given [error test result with default hasColor eq true] should return [a colored string with TAP test point - id, file name, duration and error YAMLBlock]"
    )

    t.equal(
      resultPlain,
      expected,
      "given [error test result with hasColor eq false] should return [a plain string with TAP test point - id, file name, duration and error YAMLBlock]"
    )
  }
})

test("tap-reporter - formatSummary", t => {
  t.plan(2)

  const resultColored = tapReporter.formatSummary({
    passCount: 2,
    failCount: 1,
    duration: [1, 10_000_000],
  })

  const resultPlain = tapReporter.formatSummary({
    passCount: 2,
    failCount: 1,
    duration: [1, 10_000_000],
    hasColor: false,
  })

  const expected = [
    "# tests    3",
    "# pass     2",
    "# fail     1",
    "# duration 1.01s",
  ].join("\n")

  t.equal(
    // TODO: snapshots?
    removeANSICodes(resultColored),
    expected,
    "given [] should return []"
  )

  t.equal(resultPlain, expected, "given [] should return []")
})
