import type { TestResult } from "../runTest.js"

export type IntroFormatter = (props: {
  count: number
  description?: string
}) => string

export type TestFormatter = (props: {
  index?: number
  result: TestResult
}) => string

export type SuiteFormatter = (props: {
  passCount: number
  failCount: number
  duration: [number, number]
}) => string

export type Reporter = {
  formatIntro: IntroFormatter
  formatTest: TestFormatter
  formatSuite: SuiteFormatter
}
