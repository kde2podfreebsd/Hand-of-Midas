# backend-template

This is a starting boilerplate for RUSCAMP module (backend).

## Starting

This template uses yarn as a package manager. To install all dependencies make sure you have yarn installed on your machine:
```
ipm i -g yarn@latest
```

Then go to project's root folder and type:
```
yarn
```

## Environment

In development mode you should have local environment variables. 

If you are starting project using `yarn start` - create `dev.env` file in root of the project.

If you are running e2e-tests locally using `yarn test:e2e` - create `e2e.env` file in root of the project.

Files with `*.env` extension will be ignored by git. You can find example in `.env.example` file.

## Configuration

Project uses [convict](https://www.npmjs.com/package/convict) for all global parameters. Configuration schema is located in `src/infrastructure/config.ts` file.

## Changelog

You should document every notable change in `CHANGELOG.md` file. Inside of this file you will find a link to format description.

[See example](CHANGELOG.md)

## Folder structure

```shell
src
├── common # common utils, helpers
├── controllers # client API
├── features # domain commands divided into slices (write operations)
├── infrastructure # common project setup
├── integration # external protocol clients, adapters 
├── integration-api # api for external integrations
└── queries # client query handlers (read operations)
```

## Code style

RUSCAMP team forces you to use code style rules.
[See the code style](CODESTYLE.md)