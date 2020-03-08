const net = require('net');

const server= net.createServer(connection => {
  const outboundMessage = "pong";

  connection.write(outboundMessage);

  connection.on('data',(inboundMessage) => {

    const messageString = inboundMessage.toString();
    console.log('I wrote data ' + outboundMessage + ' and they said ' + messageString);
  });
});

server.listen(5000);