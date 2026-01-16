
# gcajs

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

[![Build Status][github-build-url]][github-url]
[![codecov][codecov-image]][codecov-url]

> Generate GitHub contribution art from images
> Draw pixel art on your GitHub contribution graph using commits.

`gcajs` is a CLI tool that converts a PNG image into a GitHub contribution graph by generating commits on specific dates.
It supports deterministic generation, dry-run preview, replay from state, and safe overwrite protections.

---

> **Experimental**
>
> This library is under active development and **not yet stable**.
> Breaking changes may occur at any time.

---

## Features

* Convert PNG images into GitHub contribution art
* Precise date mapping (7 × 52 GitHub grid)
* Deterministic output with seed
* Smart auto base computation from existing contributions
* Replayable via `.gca.json`
* Dry-run preview (no commits)
* Safe working directory handling
* Fully scriptable CLI

---

## Installation

Global install:

```bash
npm install -g gcajs

gca <repo> [options]
```

Or install locally:

```bash
npm install gcajs
```

---

## Usage

### Basic usage

```bash
npx gca https://github.com/username/repo -i image.png
```

This will:

1. Clone the repository
2. Convert `image.png` into a 7×52 contribution matrix
3. Generate commits mapped to dates
4. Push commits to GitHub

---

## CLI Options

```text
Usage: gca <repo> [options]

Arguments:
  <repo>                      GitHub repository URL

Options:
  -i, --image <path>          PNG image path

  -f, --force                 Allow non-empty git repo
  -e, --end-date <date>       End date (YYYY-MM-DD)
  -b, --base <number>         Commit base
  -s, --seed <number>         Random seed

  --dry-run                   Preview only, do not commit
  --from-gca                  Replay from gca.json
  --no-save-gca               Do not write gca.json
  --clean-workdir             Remove working directory if not empty

  --verbose                   Verbose logging
  --quiet                     Silent mode
```

---

## Image Requirements

* Format: **PNG**
* Automatically converted to:

  * Grayscale
  * 5 contribution levels (GitHub-style)
  * 7 rows × 52 columns

> The image will be resized/cropped internally to match GitHub’s contribution grid.

---

## Commit Base (Important)

GitHub contribution levels are **relative**, not absolute.

`gca` supports:

* Manual base via `--base`
* Auto-computed base (default)
* Deterministic replay via `.gca.json`

### Auto base logic (default)

* Fetches your GitHub contribution history
* Computes a dominant commit baseline
* Scales commits so the generated art is visually dominant

---

## `.gca.json` State File

After a successful run, `gca` writes a `.gca.json` file into the repository.

This file stores:

* Meta information (seed, base, end date, version)
* Generated commit plan

### Replay from state

```bash
npx gca https://github.com/username/repo --from-gca
```

Useful for:

* Reproducing the same art
* Avoiding recomputation
* Updating commits safely

> Do not manually edit or delete `.gca.json` unless you know what you’re doing.

---

## Dry Run / Preview

Preview the contribution art without creating commits:

```bash
npx gca https://github.com/username/repo -i image.png --dry-run
```

This will:

* Print an ASCII preview
* Show commit distribution
* Make **no changes** to git history

---

## Safety & Overwrite Protection

By default, `gca` is conservative:

* Refuses non-empty repositories
* Refuses dirty working directories

Override explicitly:

```bash
--force           # allow non-empty repo
--clean-workdir   # delete working directory
```

---

## Logging Control

```bash
--verbose   # detailed debug logs
--quiet     # suppress all output
```

---

## Disclaimer

This tool **rewrites Git history intentionally**.

* Use on **dedicated repositories**
* Do **not** use on important production repos
* Understand GitHub’s terms and contribution graph behavior

You are responsible for how you use this tool.

---

## License

MIT © [Yuki Akai](https://github.com/yukiakai212)

---

[npm-downloads-image]: https://badgen.net/npm/dm/gcajs
[npm-downloads-url]: https://www.npmjs.com/package/gcajs
[npm-url]: https://www.npmjs.com/package/gcajs
[npm-version-image]: https://badgen.net/npm/v/gcajs
[github-build-url]: https://github.com/yukiakai212/gca/actions/workflows/build.yml/badge.svg
[github-url]: https://github.com/yukiakai212/gca/
[codecov-image]: https://codecov.io/gh/yukiakai212/gca/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/yukiakai212/gca
[changelog-url]: https://github.com/yukiakai212/gca/blob/main/CHANGELOG.md
[api-docs-url]: https://yukiakai212.github.io/gca/
