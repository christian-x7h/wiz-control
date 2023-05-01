const discoverBtn = document.getElementById('discover-btn');
const devicesDiv = document.getElementById('devices');
const ipAddressInput = document.getElementById('ip-address');
const getDetailsBtn = document.getElementById('get-details-btn');
const toggleBtn = document.getElementById('toggle-btn');
const colorInput = document.getElementById('color-input');
const setColorBtn = document.getElementById('set-color-btn');
const lightControlDiv = document.getElementById('light-control');

// Scenes Enum
const SCENES = {
  NIGHT_LIGHT: '14',
}

// send_udp API commands
const COMMANDS = {
  GET_DETAILS: 'get_details',
  SET_COLOR: 'set_color',
  SET_SCENE: 'set_scene',
  TOGGLE: 'toggle',
}

async function sendUdpMessage(ip, command, data) {
  const response = await fetch('/send_udp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ip, command, data })
  });

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
  try {
    const result = await sendUdpMessage(ip, COMMANDS.GET_DETAILS);
    console.log(result);
  }
  catch (error) {
    console.error('Error getting light details:', error);
  }
}

async function setLightColor(ip, r, g, b) {
  try {
    const result = await sendUdpMessage(ip, COMMANDS.SET_COLOR, { r, g, b });
    console.log(result);
  }
  catch (error) {
    console.error('Error setting light color:', error);
  }
}

async function setNightLight(ip) {
  try {
    const result = await sendUdpMessage(ip, COMMANDS.SET_SCENE, { sceneId: SCENES.NIGHT_LIGHT });
    console.log(result);
  }
  catch (error) {
    console.error('Error setting night light:', error);
  }
}

async function toggleLight(ip, state) {
  try {
    const result = await sendUdpMessage(ip, COMMANDS.TOGGLE, { state });
    console.log(result);
  }
  catch (error) {
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
      deviceDiv.classList.add('deviceEntryDiv');
      const deviceText = document.createElement('p');
      deviceText.innerText = ip;
      const onButton = document.createElement('button');
      onButton.innerText = 'ON';
      onButton.addEventListener('click', () => toggleLight(ip, true));
      const offButton = document.createElement('button');
      offButton.innerText = 'OFF';
      offButton.addEventListener('click', () => toggleLight(ip, false));
      const nightLightButton = document.createElement('button');
      nightLightButton.innerText = 'Night Light';
      nightLightButton.addEventListener('click', () => setNightLight(ip));
      deviceDiv.appendChild(deviceText);
      deviceDiv.appendChild(onButton);
      deviceDiv.appendChild(offButton);
      deviceDiv.appendChild(nightLightButton);
      devicesDiv.appendChild(deviceDiv);
    });
  }
  catch (error) {
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
