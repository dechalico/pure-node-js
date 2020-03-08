const vm = require('vm');

const context = {
  'wew': 20
};

const script = new vm.Script(`
  wew = wew + 20;
  aler = wew -20;
  alor = aler
`);

script.runInContext(context);

console.log(context);
