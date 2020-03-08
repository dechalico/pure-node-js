const fs = require('fs');
const asyncHook = require('async_hooks');

const whatTimeIsIt = (callback) => {
  setInterval(() => {
    fs.writeSync(1,"When the setinterval run the execution context is: " + asyncHook.executionAsyncId() + " \n");
    callback(Date.now());
  },1000);
};

whatTimeIsIt((time) => {
  fs.writeSync(1,"The time is: " + time + "\n");
});


const hook = {
  init(asyncId,type,triggerAssyncId,resource) {
    fs.writeSync(1,"Hook init: " + asyncId + "\n");
  },
  before(asyncId) {
    fs.writeSync(1,"Hook before: " + asyncId + "\n");
  },
  after(asyncId) {
    fs.writeSync(1,"Hook after: " + asyncId + "\n");
  },
  destroy(asyncId) {
    fs.writeSync(1,"Hook destroy: " + asyncId + "\n");
  },
  promiseResolve(asyncId) {
    fs.writeSync(1,"Hook promise resolve: " + asyncId + "\n");
  }
};

const asHook = asyncHook.createHook(hook);
asHook.enable();