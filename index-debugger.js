const server = require('./lib/server');
const worker = require('./lib/worker');
const cli = require('./lib/cli');
const exampleError = require('./lib/exampleDebuggingProblem');

const app = {};

app.init = () => {
  
  debugger;
  server.init();
  console.log('starting server');
  debugger;


  worker.init();
  console.log('starting workers');
  debugger;


  cli.init();
  console.log('starting cli');
  debugger;
  // setInterval(() => {
  //   cli.init();
  // },50);

  let foo = 2;
  debugger;

  foo = foo * foo;
  debugger;

  foo = foo.toString();
  debugger;

  exampleError.init();
  console.log('initialize error');
  debugger;
};

app.init();

module.exports = app;