const discoverBtn = document.getElementById('discover-btn');
const devicesDiv = document.getElementById('devices');
const ipAddressInput = document.getElementById('ip-address');
const getDetailsBtn = document.getElementById('get-details-btn');
const toggleBtn = document.getElementById('toggle-btn');
const colorInput = document.getElementById('color-input');
const setColorBtn = document.getElementById('set-color-btn');
const lightControlDiv = document.getElementById('light-control');

async function sendUdpMessage(ip, message) {
  const response = await fetch(`http://localhost:3000/send_udp?ip=${ip}&message=${encodeURIComponent(message)}`);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return response.text();
}

// Functions

// Due to browser security restrictions, direct UDP communication with the devices is not possible.
// Therefore, we need to implement a local server to act as a proxy between the browser and the devices.
// For now, we'll leave these functions empty and complete them once we have the local server set up.

async function getLightDetails(ip) {
  const message = '{"method":"getPilot","params":{}}';
  try {
    const result = await sendUdpMessage(ip, message);
    console.log(result);
  } catch (error) {
    console.error('Error getting light details:', error);
  }
}

async function setLightColor(ip, r, g, b) {
  const message = `{"id":1,"method":"setPilot","params":{"r":${r},"g":${g},"b":${b},"dimming":100}}`;
  try {
    const result = await sendUdpMessage(ip, message);
    console.log(result);
  } catch (error) {
    console.error('Error setting light color:', error);
  }
}

async function toggleLight(ip, state) {
  const message = `{"id":1,"method":"setState","params":{"state":${state}}}`;
  try {
    const result = await sendUdpMessage(ip, message);
    console.log(result);
  } catch (error) {
    console.error('Error toggling light:', error);
  }
}

async function discoverLights() {
  try {
    const response = await fetch('/discover');
    const wiz_ips = await response.json();
    console.log(wiz_ips);

    // update the devices table
    const devicesDiv = document.getElementById('devices');
    devicesDiv.innerHTML = ''; // clear previous content

    // create and append new elements for each IP address
    wiz_ips.forEach(ip => {
      const deviceDiv = document.createElement('div');
      const deviceText = document.createTextNode(ip);
      const onButton = document.createElement('button');
      onButton.innerText = 'ON';
      onButton.addEventListener('click', () => toggleLight(ip, true));
      const offButton = document.createElement('button');
      offButton.innerText = 'OFF';
      offButton.addEventListener('click', () => toggleLight(ip, false));
      deviceDiv.appendChild(deviceText);
      deviceDiv.appendChild(onButton);
      deviceDiv.appendChild(offButton);
      devicesDiv.appendChild(deviceDiv);
    });
  } catch (error) {
    console.error(`Error discovering WiZ devices: ${error}`);
  }
}

// Event listeners
discoverBtn.addEventListener('click', () => {
  discoverLights();
});

getDetailsBtn.addEventListener('click', () => {
  const ip = ipAddressInput.value;
  getLightDetails(ip);
});

toggleBtn.addEventListener('click', () => {
  const ip = ipAddressInput.value;
  toggleLight(ip);
});

setColorBtn.addEventListener('click', () => {
  const ip = ipAddressInput.value;
  const [r, g, b] = colorInput.value.split(',').map(Number);
  setLightColor(ip, r, g, b);
});
