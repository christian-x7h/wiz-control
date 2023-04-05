const discoverBtn = document.getElementById('discover-btn');
const devicesDiv = document.getElementById('devices');
const ipAddressInput = document.getElementById('ip-address');
const getDetailsBtn = document.getElementById('get-details-btn');
const toggleBtn = document.getElementById('toggle-btn');
const colorInput = document.getElementById('color-input');
const setColorBtn = document.getElementById('set-color-btn');
const lightControlDiv = document.getElementById('light-control');

// Functions

// Due to browser security restrictions, direct UDP communication with the devices is not possible.
// Therefore, we need to implement a local server to act as a proxy between the browser and the devices.
// For now, we'll leave these functions empty and complete them once we have the local server set up.

function getLightDetails(ip) {
  // To be implemented
}

function setLightColor(ip, r, g, b) {
  // To be implemented
}

function toggleLight(ip, state) {
  // To be implemented
}

function discoverLights() {
  // To be implemented
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
