import type { TestResult } from "../runTest.js"

type IntroFormatter = (props: { count: number; patterns: string[] }) => string

type TestFormatter = (props: { index: number; result: TestResult }) => string

type SuiteFormatter = (props: {
  passCount: number
  failCount: number
  duration: [number, number]
}) => string

export type Reporter = {
  formatIntro: IntroFormatter
  formatTest: TestFormatter
  formatSuite: SuiteFormatter
}
