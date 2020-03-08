const net = require('net');

const outboundMessage = "ping";

const client = net.createConnection({port: 5000},() => {
  client.write(outboundMessage);
});

client.on('data',(data) => {
  const messageString = data.toString();
  console.log('I wrote data ' + outboundMessage + ' and they said ' + messageString);
  client.end();
});
