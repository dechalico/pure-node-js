
const config = require('../lib/config');
const http = require('http');
const app = require('../index');
const assert = require('assert');

const api = {};

const helper = {};

helper.request = (path,callback) => {
  const requestDetils = {
    'protocol': "http:",
    'path': path,
    'hostname': "localhost",
    'method': "GET",
    'port': config.httpPort,
    'headers': {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(requestDetils,(res) => {
    callback(res);
  });

  req.end();
};

api['starting the app should not be thrown error'] = (done) => {
  assert.doesNotThrow(() => {
    app.init(() => {
      done();
    });
  },TypeError);
};

api['ping should response with 200 statuscode'] = (done) => {
  helper.request("/ping",(res) => {
    assert.equal(res.statusCode,200);
    done();
  });
};

api['/api/users should respond to GET with 404'] = (done) => {
  helper.request("/api/users",(res) => {
    assert.equal(res.statusCode,400);
    done();
  });
};

module.exports = api;