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

This repository includes the following:

### Packages

- `@enterwell/react-ui` - React component library
- `@enterwell/react-hooks` - React hooks library

#### Other (not published)

- `docs` - Documentation app (built with [nextra](https://nextra.site/)) available at [enterwell.github.io/ui](https://enterwell.github.io/ui/)
- `eslint-config-custom` - `eslint` configurations (includes `eslint-config-next`)
- `tsconfig` - `tsconfig.json`s used throughout the monorepo

## Development

### Requirements

- [nvm for Windows](https://github.com/coreybutler/nvm-windows)
  - Run `nvm install lst && nvm use lts`
  - Optionally install Node 18 (LTS) manually from [Node.js Download page](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/installation)
- [Visual Studio Code](https://code.visualstudio.com/) (optional)

Open workspace file `ui.code-workspace` with VS Code or your favorite editor.

### Build

To build all apps and packages, run the following command:

```bash
pnpm i
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```bash
pnpm i
pnpm dev
```

#### Code generator

Run following command (from root) and select appropriate generator and modify generated files.

```bash
pnpm turbo gen
```

Available generators:

| Generator | Description | Command |
|-----------|-------------|---------|
| component | Creates react component in `react-ui` package along with basic documentation. | `pnpm turbo gen component` |
| react-hook | Creates react hook in `react-hooks` package alogn with basic documentation. | `pnpm turbo gen react-hook` |
| react-mui-hook | Creates react hook in `react-mui-hooks` package alogn with basic documentation. | `pnpm turbo gen react-mui-hook` |
