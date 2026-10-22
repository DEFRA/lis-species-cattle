# lis-species-cattle

Part of the Livestock Information Service (LIS), which lets livestock keepers, owners, agents and
delegates record and manage their animals.

`@defra/lis-species-cattle` is a shared npm package that holds the cattle species definition used by
the cattle microsites: the species identity and the list of cattle breeds and breed codes.

It is a species package. The taxonomy packages (`lis-taxonomy-*`, for example home, move and
register) describe what a journey does. This package says which species it is for. A cattle
microsite combines the two, for example to build its path from `taxonomy.id` and `species.id`. The
package does not import any taxonomy package. The sibling [lis-species-sheep](https://github.com/DEFRA/lis-species-sheep)
package follows the same pattern for sheep.

Used by:

- spokes: [lis-apps-cattle-home](https://github.com/DEFRA/lis-apps-cattle-home), [lis-apps-cattle-register](https://github.com/DEFRA/lis-apps-cattle-register), [lis-apps-cattle-move](https://github.com/DEFRA/lis-apps-cattle-move), [lis-apps-cattle-death](https://github.com/DEFRA/lis-apps-cattle-death)
- fake services: [lis-fake-service](https://github.com/DEFRA/lis-fake-service) (breed-code validation and breed names)

## Installation

```bash
npm install @defra/lis-species-cattle
```

The package has no peer dependencies.

## Usage

The package has one entry point, `@defra/lis-species-cattle`. It exports four things.

### `species`

The species identity: `{ id: 'cattle', label: 'Cattle', summary: '...' }`. Use `species.id` to
build microsite paths.

```js
import { species } from '@defra/lis-species-cattle'

export const ROOT_PATH = buildMicrositePath(taxonomy.id, species.id)
```

### `breeds`

The canonical list of cattle breeds, as an object keyed by upper-case breed code. For example
`breeds.AA` is `'Aberdeen Angus'`. Crossbreeds have their own codes, for example `AAX` is
`'Aberdeen Angus Cross'`.

```js
import { breeds } from '@defra/lis-species-cattle'

const items = Object.entries(breeds).map(([value, text]) => ({ value, text }))
```

### `getBreedName(code)`

Returns the breed name for a breed code. The code is case-insensitive. Returns `undefined` for an
unknown code.

```js
import { getBreedName } from '@defra/lis-species-cattle'

getBreedName('aa') // 'Aberdeen Angus'
getBreedName('nope') // undefined
```

### `getBreedCode(name)`

Returns the breed code for a breed name. The name is case-insensitive, and apostrophes (straight,
curly or missing) are ignored. Returns `undefined` for an unknown name.

```js
import { getBreedCode } from '@defra/lis-species-cattle'

getBreedCode('aberdeen angus') // 'AA'
getBreedCode("Blonde D'Aquitaine") // 'BA'
```

## Prerequisites

- Node.js 24 (see `.nvmrc`, use `nvm use`)
- To check changes against a consuming app: a local clone of [lis-dev](https://github.com/DEFRA/lis-dev) with its one-time setup done

## Setup

### Development

```bash
nvm use
npm install
```

### Test

There are no tools to install beyond `npm install`. Tests use [Vitest](https://vitest.dev/).

## Running in development

This is a library, so it has no server of its own. To try a change in a consuming app without
publishing, link the local copy into the lis-dev stack:

```bash
cd lis-dev
.bin/sideload link species/cattle       # every installed copy now points at this repo
.bin/sideload up cattle-home            # optional: run a consumer locally with hot reload
.bin/sideload unlink species/cattle     # when done
```

## Running tests

```bash
npm test                 # unit tests
npm run test:coverage    # with coverage
npm run lint             # ESLint
npm run format:check     # Prettier
```

Before releasing a change, also run the tests of each consuming repo against the linked package.

## Pipelines

Build, versioning and publishing run in GitHub Actions (`.github/workflows`) using Cake scripts (`*.cake`):

- **Pull request to `main`**: validate (format, lint, test), Sonar analysis, version check
- **Push to a `feature/` or `hotfix/` branch**: prerelease version and tag
- **Merge to `main`**: release tag, then publish to [npm](https://www.npmjs.com/package/@defra/lis-species-cattle)

Versions come from git tags (SemVer). After a merge, wait for the publish job to finish before bumping the package in consuming repos.

### Running the build locally

Cake is the build engine and orchestrates the Node package lifecycle. To run the default build
(install, audit, format, lint, test and pack) locally:

```bash
dotnet cake ./build.cake --target=Default --package_version=0.1.0
```

### Testing the GitHub Actions workflow locally

Install [`act`](https://github.com/nektos/act) (for example `brew install act`), then run:

```bash
act -W .github/workflows/prerelease.yml
```

## Branching policy

The repo uses mainline development. Branch from `main` and name the branch:

- `feature/LREG-<ticket>-<short-kebab-description>`
- `hotfix/LREG-<ticket>-<short-kebab-description>`

`LREG` must be uppercase, because the GitHub ruleset rejects other branch names. Rebase onto `main`
rather than merging `main` in.

## Contributing to this project

- Follow the [Defra software development standards](https://github.com/DEFRA/software-development-standards).
- `npm install` sets up a pre-commit hook (Husky) that runs the security audit, format check and lint.
- Open a pull request against `main` using the PR template. CI must pass and the Sonar quality gate must be green before merge.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
