const dgram = require('dgram');
const url = require('url');
const express = require('express');
const { exec } = require('child_process');
const udpClient = dgram.createSocket('udp4');

const PORT = 3000;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/send_udp', (req, res) => {
  const { ip, message } = req.query;
  console.log(`Received send_udp request for ip address ${ip}`)

  if (!ip || !message) {
    res.status(400).send('IP address and message parameters are required');
    return;
  }

  udpClient.send(message, 0, message.length, 38899, ip, (err) => {
    if (err) {
      res.status(500).send('Error sending UDP message');
      return;
    }

    res.status(200).send('UDP message sent');
  });
});

app.get('/discover', (req, res) => {
  exec("arp-scan --localnet --interface=en0", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send(`Error running arp-scan: ${error}`);
      return;
    }

    const wiz_ips = stdout.match(/([0-9]{1,3}\.){3}[0-9]{1,3}(.*)(WiZ IoT Company Limited|WiZ Connected Lighting Company Limited)/g);
    const wiz_ips_cleaned = [...new Set(wiz_ips.map(entry => entry.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/g)[0]))];

    res.json(wiz_ips_cleaned);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
