const server = require('./lib/server');
const worker = require('./lib/worker');
const cli = require('./lib/cli');
const os = require('os');
const cluster = require('cluster');

const app = {};

app.init = (callback) => {
  
  if(cluster.isMaster){
    worker.init();

    setTimeout(() => {
      cli.init();
      callback();
    },50);

    for(i = 0; i < os.cpus().length; i++){
      cluster.fork();
    }

  } else {
    server.init();
  }
};

if(require.main == module){
  app.init(() => {});
}

module.exports = app;