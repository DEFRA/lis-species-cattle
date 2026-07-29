# Cattle species

Shared package for the cattle species.

Install dependencies for this package locally with `npm install` from this directory.

### Run Cake Files locally

Cake is the build engine and orchestrates the Node package lifecycle. To run the
default build locally:

```bash
dotnet cake ./build.cake --target=Default --package_version=0.1.0
```

### Test Github action

Install `act` to run the github action locally.

To Install act on Linux

```sh
brew install act
```

To run github action

```sh
act -W .github/workflows/build.yml
```
