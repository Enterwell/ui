<h1 align="center">
  <a style="display: inline-block;" href="https://enterwell.net" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-negative-256.x71089.svg">
      <img width="128" height="128" alt="logo" src="https://enterwell.net/wp-content/uploads/2023/05/ew-logomark-monochrome-positive-256.x71089.svg">
    </picture>
  </a>
  <p>Enterwell UI</p>
</h1>

<p align="center">
    Collection of UI packages used for Enterwell projects.
</p>

## What's inside?

This library includes the following packages/apps:

### Apps and Packages

- `ui`: a React component library documented in `docs` and published on npm
- `hooks`: a React hooks library documented in `docs` and published on npm

#### Other (not published)

- `docs`: Documentation app (built with [nextra](https://nextra.site/)) - [enterwell.github.io/ui](https://enterwell.github.io/ui/)
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

## Development

### Build

To build all apps and packages, run the following command:

```bash
cd ui
pnpm i
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```bash
cd ui
pnpm i
pnpm dev
```

#### Create new component

Run following command and select appropriate generator and modify generated files.

```bash
pnpm turbo gen
```

Available generators:

- component
- hook
