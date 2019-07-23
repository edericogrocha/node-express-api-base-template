# Node.js Express API Base Template

> Modular Base for API / Backend with Node and Express, Typescript-style

## Description
This is supposed to be my take on a base template for a modular backend/api application using nodejs and express. The goal is to have a strong core and create modules and components that are bound to be read upon the loading of the configuration. Still a work in progress.

### Project Introduction
TBD

## Installation
Assuming you have [node](https://nodejs.org/) and [npm](https://npmjs.com) installed:

```bash
npm install
```

## Running the Server
### Development
To start the application in development mode, run:

```bash
npm install -g nodemon
npm install -g ts-node
npm install -g typescript
npm install
```


## Start the application in dev env:
```
nodemon
```

## Compile and run application:
javascript build application will be on new folder build
```
npm run server
```

## Compile application:
```
npm run build
```

## Start build application:
```
npm start
```


## Start the application in production env:

Install ts pm2 and typescript compiler:
```
npm install -g pm2
pm2 install typescript
```

example start with scale on 2 core:
```
pm2 start ./src/index.ts -i 1 \
    && sleep 1 \
    && pm2 scale index 2 --no-daemon
```

Express server, by default, listens on http://localhost:3000/, in development mode
The developer mode will watch your changes then will transpile the TypeScript code and re-run the node application automatically.
