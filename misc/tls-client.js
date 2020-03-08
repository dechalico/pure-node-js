const tls = require('tls');
const fs = require('fs');
const path = require('path');

const outboundMessage = "ping";

const option = {
  ca: fs.readFileSync(path.join(__dirname,'../https/cert.pem'))
}

const client = tls.connect(5000,option,() => {
  client.write(outboundMessage);
});

client.on('data',(data) => {
  const messageString = data.toString();
  console.log('I wrote data ' + outboundMessage + ' and they said ' + messageString);
  client.end();
});
