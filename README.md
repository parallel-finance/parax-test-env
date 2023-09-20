## ParaX Test Environment

### Install dependencies

```sh
pnpm install
```

### Start server

Support start server with different environment

```sh
pnpm start
```

If you don't want enable eslint check when developing, use following command

```sh
DISABLE_ESLINT_PLUGIN=true pnpm start:dev
```

### Test && Lint

Before you push the changes, please run the following command to make sure you don't break anything.

```
pnpm test
pnpm lint
```

Then open [http://localhost:8000/](http://localhost:8000/) to see the app. Please note that for the front end to load properly, you will need to run a local blockchain.
