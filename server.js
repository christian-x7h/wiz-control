const dgram = require('dgram');
const url = require('url');
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const udpClient = dgram.createSocket('udp4');

const PORT = 2211;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log(`Received request for '/' from ${req.ip}`)
  res.sendFile(__dirname + '/index.html');
});

app.post('/send_udp', (req, res) => {
  const { ip, command, data } = req.body;
  console.log(`Received send_udp request for ip address ${ip} from ${req.ip}`)

  if (!ip || !command) {
    res.status(400).send('IP address and command parameters are required');
    return;
  }

  let message;
  switch (command) {
    case 'get_details':
      message = '{"method":"getPilot","params":{}}';
      break;
    case 'set_color':
      message = `{"id":1,"method":"setPilot","params":{"r":${data.r},"g":${data.g},"b":${data.b},"dimming":100}}`
      break;
    case 'set_scene':
      message = `{"id":1,"method":"setPilot","params":{"sceneId":${data.sceneId},"dimming":100}}`;
      break;
    case 'toggle':
      message = `{"id":1,"method":"setState","params":{"state":${data.state}}}`;
      break;
    default:
      res.status(400).send('Invalid command');
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
  console.log(`Received a discovery arp-scan request from ${req.ip}`)
  exec("arp-scan --localnet --interface=en0", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).send(`Error running arp-scan: ${error}`);
      return;
    }

    const wiz_ips = stdout.match(
      /([0-9]{1,3}\.){3}[0-9]{1,3}(.*)(WiZ IoT Company Limited|WiZ Connected Lighting Company Limited)/g);
    const wiz_ips_cleaned = [...new Set(wiz_ips.map(entry => entry.match(
      /([0-9]{1,3}\.){3}[0-9]{1,3}/g)[0]))];

    res.json(wiz_ips_cleaned);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
