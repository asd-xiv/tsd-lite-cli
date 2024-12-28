<!-- markdownlint-disable first-line-h1 -->

> [!CAUTION]
>
> `tsd-lite-cli` is deprecated due to `tsd-lite` being [deprecated](https://github.com/mrazauskas/tsd-lite/issues/364).  
> Migrate to [TSTyche](https://github.com/tstyche/tstyche), it has all the bells and whistles.

Here is a TL;DR of how to use it:

```sh
npm install --save-dev tstyche
```

```ts
// src/pipe-p.tst.ts
import { describe, expect, test } from "tstyche"
import { pipeP } from "./pipe-p.js"

const inc = (x: number) => x + 1
const asyncToString = async (x: unknown) => String(x)

describe("pipeP :: left-right composition with promise support", () => {
  test("given [inc, asyncToString of 1] should [return '2']", async () => {
    const result = await pipeP(inc, asyncToString)(1)

    expect<typeof result>().type.toBe<string>()
  })
})
```

```sh
npx tstyche 'src/**/*.tst.ts'
```

---

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/asd-xiv/tsd-lite-cli/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/asd-xiv/tsd-lite-cli/tree/main)
![npm](https://img.shields.io/npm/v/tsd-lite-cli)
[![Coverage Status](https://coveralls.io/repos/github/asd-xiv/tsd-lite-cli/badge.svg?branch=main)](https://coveralls.io/github/asd-xiv/tsd-lite-cli?branch=main)

# tsd-lite-cli

:bug: :link: :runner: Test runner for TypeScript typings. CLI over
[`tsd-lite`][intro_tsd-lite], a per-file version of [`tsd`][intro_tsd].

- :mag: [Glob][intro_fast-glob] pattern matching
- :white_check_mark: [TAP][intro_tap] compatible output

![tsd-lite-cli default colored tap output](docs/output-default.png
"tsd-lite-cli default colored tap output")

[intro_tsd]: https://github.com/SamVerschueren/tsd
[intro_tsd-lite]: https://github.com/mrazauskas/tsd-lite
[intro_fast-glob]: https://github.com/mrmlnc/fast-glob
[intro_tap]: https://testanything.org

## Table of Contents

<!-- vim-markdown-toc GFM -->

* [Install](#install)
  * [`tsd-lite`](#tsd-lite)
  * [`@tsd/typescript`](#tsdtypescript)
* [Usage](#usage)
  * [CLI interface](#cli-interface)
    * [`--color` and `--no-color`](#--color-and---no-color)
* [Similar projects](#similar-projects)
* [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Install

```bash
npm install --save-dev @tsd/typescript tsd-lite tsd-lite-cli
```

Besides `tsd-lite-cli`, `tsd-lite` and `@tsd/typescript` are peer dependencies
and must be installed as well.

### `tsd-lite`

Contains the actual assertion functions. For more information, see
[`tsd-lite`][install_tsd-lite].

```typescript
// src/concat.test-d.ts
import { expectType, expectError } from "tsd-lite"
import concat from "./concat.js"

expectType<Promise<string>>(concat("foo", "bar"))
expectType<string>(await concat("foo", "bar"))
expectError(await concat(true, false))
```

[install_tsd-lite]: https://github.com/mrazauskas/tsd-lite

### `@tsd/typescript`

Compiles the TypeScript test files. It's version should be synced with the
`typescript` version in your project. For more information, see
[`@tsd/typescript`][install_tsd-typescript].

[install_tsd-typescript]: https://github.com/SamVerschueren/tsd-typescript

## Usage

Run `tsd-lite` with a glob pattern for matching test files - uses
[`fast-glob`][usage_fast-glob] internally:

```bash
npx tsd-lite 'src/**/*.test-d.ts'
```

[usage_fast-glob]: https://github.com/mrmlnc/fast-glob

### CLI interface

```console
$ npx tsd-lite --help

Usage: tsd-lite [options] <patterns...>

Test runner for testing TypeScript typings (CLI over tsd-lite, a "per file"
version of tsd)

Arguments:
  patterns       Glob patterns for matching test files

Options:
  -v, --version  Print version number
  -c, --color    Output colored TAP for better human consumption. Disabled in
                 CI environments if not explicitly set (default: true)
  --no-color     Disable colored TAP, usefull when piping to other tools
  -h, --help     Print this help guide
```

#### `--color` and `--no-color`

By default, `tsd-lite-cli` outputs a colored version of [Test Anything
Protocol][cli_tap] for better readability. Can be disabled by setting
`--no-color` when piping to other tools, e.g. [`tap-spec`][cli_tap-spec].

```bash
npx tsd-lite 'src/**/*.test-d.ts' --no-color
```

![tsd-lite-cli --no-color output](docs/output-no-color.png "tsd-lite-cli
--no-color output")

```bash
npx tsd-lite 'src/**/*.test-d.ts' --no-color | npx tap-spec
```

![tsd-lite-cli --no-color output piped to
tap-spec](docs/output-no-color_tap-spec.png "tsd-lite-cli --no-color output
piped to tap-spec")

[cli_tap]: https://testanything.org
[cli_tap-spec]: https://github.com/scottcorgan/tap-spec

## Similar projects

- [`jest-runner-tsd`][similar_jest-runner-tsd] - Jest runner to test TypeScript
  typings

[similar_jest-runner-tsd]: https://github.com/jest-community/jest-runner-tsd

## Changelog

See the [releases section](https://github.com/asd-xiv/tsd-lite-cli/releases)
for details.
