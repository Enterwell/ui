# @enterwell/ui

Official Enterwell UI library.

## What's inside?

This library includes the following packages/apps:

### Apps and Packages

- `docs`: Documentatino app (built with [nextra](https://nextra.site/))
- `ui`: a React component library documented in `docs` and published on npm
- `hooks`: a React hooks library documented in `docs` and published on npm
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
