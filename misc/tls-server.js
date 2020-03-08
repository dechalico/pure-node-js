const tls = require('tls');
const fs = require('fs');
const path = require('path');

const option = {
  key: fs.readFileSync(path.join(__dirname,'../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'../https/cert.pem'))
}

const server= tls.createServer(option,connection => {
  const outboundMessage = "pong";

  connection.write(outboundMessage);

  connection.on('data',(inboundMessage) => {

    const messageString = inboundMessage.toString();
    console.log('I wrote data ' + outboundMessage + ' and they said ' + messageString);
  });
});

server.listen(5000);