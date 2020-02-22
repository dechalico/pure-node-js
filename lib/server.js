/*
* Server file
* 
*/

// Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const config = require('./config');
const handler = require("./handler");
const helper = require('./helper');
const util = require('util');

const debug = util.debuglog('server');

const server = {};

// Creating HTTP server
server.httpServer = http.createServer((req,res) => {
  server.unifiedServer(req,res);
});

// Creating HTTPS server
server.httpsServerOption = {
  key: fs.readFileSync(path.join(__dirname,'../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'../https/cert.pem'))
}
server.httpsServer = https.createServer(server.httpsServerOption,(req,res) => {
  server.unifiedServer(req,res);
});

server.unifiedServer = (req,res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url,true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,"");
  
  // Get the query string as an object
  const queryString = parsedUrl.query;

  // Get the http method
  const method = req.method.toLocaleLowerCase();

  // Get the http headers
  const header = req.headers;

  // Get the payloads, if any
  const decoder = new stringDecoder("utf-8");
  let buffer = ""

  req.on('data',(data) => {
    buffer+= decoder.write(data);
  });

  req.on('end',() => {
    buffer+= decoder.end();

    const data = {
      trimmedPath: trimmedPath,
      queryString: queryString,
      method: method,
      header: header,
      payload: helper.parseJSONToObject(buffer)
    };

    let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handler.notFound;

    chosenHandler = trimmedPath.indexOf('public/') > -1 ? handler.public : chosenHandler;

    chosenHandler(data,(statusCode,payloadObject,contentType) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      contentType = typeof(contentType) == 'string' ? contentType : "json";

      let payloadString;
      // if json content
      if(contentType == 'json'){
        res.setHeader('Content-Type','application/json');
        payloadObject = typeof(payloadObject) == 'object' ? payloadObject : {};
        payloadString = JSON.stringify(payloadObject);
      } else if (contentType == 'html'){
        // if html content
        res.setHeader('Content-Type','text/html');
        payloadString = typeof(payloadObject) == 'string' ? payloadObject : "";
      }  else if (contentType == 'css'){
        // if css content
        res.setHeader('Content-Type','text/css');
        payloadString = typeof(payloadObject) !== 'undefined' ? payloadObject : "";
      }  else if (contentType == 'js'){
        // if js content
        res.setHeader('Content-Type','text/javascript');
        payloadString = typeof(payloadObject) !== 'undefined' ? payloadObject : "";
      }  else if (contentType == 'png'){
        // if png content
        res.setHeader('Content-Type','image/png');
        payloadString = typeof(payloadObject) !== 'undefined' ? payloadObject : "";
      }  else if (contentType == 'jpg'){
        // if html content
        res.setHeader('Content-Type','image/jpg');
        payloadString = typeof(payloadObject) !== 'undefined' ? payloadObject : "";
      }  else if (contentType == 'favicon'){
        // if html content
        res.setHeader('Content-Type','image/x-icon');
        payloadString = typeof(payloadObject) !== 'undefined' ? payloadObject : "";
      }
      
       // Send the response
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the response
      if(statusCode == 200) {
        debug('\x1b[32m%s\x1b[0m','Returning this response: ',statusCode,payloadString);
      } else {
        debug('\x1b[31m%s\x1b[0m','Returning this response: ',statusCode,payloadString);
      }
      
    });
  });
};

server.router = {
  '': handler.index,
  'account/create': handler.accountCreate,
  'account/edit': handler.accountEdit,
  'acccount/deleted': handler.accountDeleted,
  'session/create': handler.sessionCreate,
  'session/deleted': handler.sessionDeleted,
  'checks/all': handler.checkList,
  'checks/create': handler.checksCreate,
  'checks/edit': handler.checksEdit,
  'ping': handler.ping,
  'api/users': handler.users,
  'api/tokens': handler.tokens,
  'api/checks': handler.checks,
  'public': handler.public,
  'favicon.ico': handler.favicon
}

server.init = () => {
  // Starting HTTP server
  server.httpServer.listen(config.httpPort,() => {
    console.log('\x1b[36m%s\x1b[0m',"The server started at port: " + config.httpPort);
  });
  // Starting HTTPS server
  server.httpsServer.listen(config.httpsPort,() => {
    console.log('\x1b[35m%s\x1b[0m',"The server started at port: " + config.httpsPort);
  });
};

module.exports = server;