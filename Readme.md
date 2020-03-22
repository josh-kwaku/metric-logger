# Metric Logging and Reporting Service

This is a simple api service that that sums metrics by time window for the most recent hour.

## Installation

This project requires [Node.js](https://nodejs.org/) v8+ to run.

Clone the project, Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/Jake-parkers/metric-logger.git
cd metrics_logger
npm install
npm run build && npm start
```

For Production Environments

```sh
git clone https://github.com/Jake-parkers/metric-logger.git
cd metrics_logger
npm install
NODE_ENV=production
npm run build && npm start
```

## Testing

Tests were written with mocha, chai and supertest

```sh
npm test
```

License

----

ISC
