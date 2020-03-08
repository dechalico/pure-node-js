const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const mesage = 'This is a message';
const messageBuffer = Buffer.from(mesage);

client.send(messageBuffer,5000,'localhost',(err) => {
  client.close();
});