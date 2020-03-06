const helper = require('../lib/helper');
const assert = require('assert');
const logs = require('../lib/logs');
const examleDegger = require('../lib/exampleDebuggingProblem');

const unit = {};

unit['helpers.getNumberValue should return 1'] = (done) => {
  const val = helper.getNumberValue();
  assert.equal(1,val)
  done();
};

unit['helper.getNumberValue should retuen number type'] = (done) => {
  const val = helper.getNumberValue();
  assert.equal(typeof(val),'number');
  done();
};

unit['helpers.getNumberValue should return 2'] = (done) => {
  const val = helper.getNumberValue();
  assert.equal(2,val)
  done();
};

unit['log.list() shout callback an array and error of false'] = (done) => {
  logs.list(true,(err,list) => {
    assert.equal(err,false);
    assert.ok(list instanceof Array);
    assert.ok(list.length > 0);
    done();
  });
};

unit['logs.truncate() should not throws error if the logid does not exist'] = (done) => {
  assert.doesNotThrow(() => {
    logs.truncate('log id does not exist',(err) => {
      assert.ok(err);
      done();
    });
  },TypeError);
};

unit['example.init() should not throw an error, (error created initentionally)'] = (done) => {
  assert.doesNotThrow(() => {
    examleDegger.init();
  },TypeError);
};

module.exports = unit;