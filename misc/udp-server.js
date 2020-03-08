const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message',(message) => {
  const messageString = message.toString();
  console.log(messageString);
});

server.bind(5000);
