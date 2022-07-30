<h1 align="center">
  <img src=".preview/Logo.png" width="250"><br>
  Momentum Frontend
</h1>
<div align="center">
  

  [![GitHub license](https://img.shields.io/github/license/bp-momentum/frontend.svg)](https://github.com/bp-momentum/frontend/blob/main/LICENSE)
  [![Latest release](https://badgen.net/github/release/bp-momentum/frontend)](https://github.com/bp-momentum/frontend/releases)
  [![GitHub commits](https://badgen.net/github/commits/bp-momentum/frontend/main)](https://GitHub.com/bp-momentum/frontend/commit/)
  [![Github stars](https://img.shields.io/github/stars/bp-momentum/frontend.svg)](https://GitHub.com/bp-momentum/frontend/stargazers/)
  [![Dependabot](https://img.shields.io/badge/maintained%20with-renovate-brightgreen)](https://app.renovatebot.com/dashboard)
  [![Deploy](https://img.shields.io/github/workflow/status/bp-momentum/frontend/Deploy)](https://github.com/bp-momentum/frontend/actions/workflows/deploy.yml)

</div>

This is the repository for the Momentum Frontend.

## Getting Started

### Prerequisites

  * `PNPM` is required to install the dependencies.
  * The [backend](https://github.com/BP-WiSe21-22-Gruppe-52/BP-backend) is required to run on a server.

### Configuration

  * Configure the server in the [`config/index.ts`](src/config/index.ts) file.

### Automatic Workflow Deploy

  * Configure the workflow in the [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) file.

### Manual Installation

  * Run `pnpm i` to install the dependencies.
  * Build the static page using `pnpm build`.
  * Host it anywhere!

## Contributing

To contribute to this project, please open an issue or create a pull request.

## Available Scripts

In the project directory, you can run:

### `pnpm`

Installs all the necessary packages. Run this after every pull or checkout.

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `pnpm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!