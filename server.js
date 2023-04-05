const http = require('http');
const dgram = require('dgram');
const url = require('url');
const udpClient = dgram.createSocket('udp4');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { query } = url.parse(req.url, true);
  const { ip, message } = query;

  if (!ip || !message) {
    res.statusCode = 400;
    res.end('IP address and message parameters are required');
    return;
  }

  udpClient.send(message, 0, message.length, 38899, ip, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end('Error sending UDP message');
      return;
    }

    res.statusCode = 200;
    res.end('UDP message sent');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
