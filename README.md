# @enterwell/ui

This is an official Enterwell UI library.

## What's inside?

This library includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library documented in `docs` and published on npm
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

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

Run following command and select appropriate generator:

```bash
pnpm turbo gen
```
