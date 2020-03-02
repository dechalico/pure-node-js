const server = require('./lib/server');
const worker = require('./lib/worker');
const cli = require('./lib/cli');

const app = {};

app.init = () => {
  
  server.init();

  worker.init();

  cli.init();

  // setInterval(() => {
  //   cli.init();
  // },50);
};

app.init();

module.exports = app;