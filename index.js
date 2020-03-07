const server = require('./lib/server');
const worker = require('./lib/worker');
const cli = require('./lib/cli');

const app = {};

app.init = (callback) => {

  server.init();

  worker.init();

  setTimeout(() => {
    cli.init();
    callback();
  },50);
};

if(require.main == module){
  app.init(() => {});
}

module.exports = app;