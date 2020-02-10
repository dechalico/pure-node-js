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

    const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handler.notFound;
    chosenHandler(data,(statusCode,payloadObject) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payloadObject = typeof(payloadObject) == 'object' ? payloadObject : {};

      const payloadString = JSON.stringify(payloadObject);
      
      // Send the response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the response
      console.log('Returning this response: ',statusCode,payloadString);
    });
  });
};

server.router = {
  ping: handler.ping,
  users: handler.users,
  tokens: handler.tokens,
  checks: handler.checks
}

server.init = () => {
  // Starting HTTP server
  server.httpServer.listen(config.httpPort,() => {
    console.log("The server started at port: " + config.httpPort);
  });
  // Starting HTTPS server
  server.httpsServer.listen(config.httpsPort,() => {
    console.log("The server started at port: " + config.httpsPort);
  });
};

module.exports = server;