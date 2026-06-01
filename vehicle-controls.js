/**
 * Enhanced Vehicle Controls System
 * Full functionality for all vehicle control buttons
 * Lock, Lights, Trunk, Climate, Seats, Camera, Settings
 */

const vehicleControlsState = {
  // Lock System
  lock: {
    status: 'locked',
    autoLockEnabled: true,
    childLockEnabled: false,
    batteryVoltage: 12.8,
  },

  // Lighting System
  lights: {
    main: false,
    dipped: false,
    highBeam: false,
    fogFront: false,
    fogRear: false,
    brake: false,
    reversing: false,
    autoLights: true,
    brightness: 100,
  },

  // Trunk/Boot Control
  trunk: {
    status: 'closed', // open, closed, ajar
    autoClose: false,
    smartOpen: true,
    position: 0, // 0-100%
  },

  // Climate Control
  climate: {
    enabled: true,
    mode: 'auto', // auto, cool, heat, dry, circulation
    temperature: 22, // celsius
    fanSpeed: 5, // 1-10
    airDistribution: 'front', // front, rear, all
    humidity: 45,
    acCompressor: true,
    rearClimate: false,
    seatHeaterLeft: false,
    seatHeaterRight: false,
    steeringWarmth: false,
  },

  // Seat Adjustment
  seats: {
    frontLeft: {
      position: 'forward', // forward, middle, back
    },
    frontRight: {
      position: 'forward',
    },
    lumbarSupport: 5, // 1-10
    headrestHeight: 5, // 1-10
    cushionHeight: 5, // 1-10
    seatVentilation: false,
    massage: false,
    memory: 1, // 1-3
  },

  // Camera System
  camera: {
    active: false,
    mode: 'off', // off, parking, panoramic, recording
    night: false,
    quality: 'high',
    recordings: [],
    parkingGuard: false,
  },

  // Settings
  settings: {
    panel: null,
    menuOpen: false,
    brightness: 80,
    language: 'English',
    units: 'metric',
    theme: 'dark',
    notifications: true,
    soundVolume: 70,
  },
};

/**
 * LOCK SYSTEM FUNCTIONS
 */
function toggleLockSystem() {
  const newStatus = vehicleControlsState.lock.status === 'locked' ? 'unlocked' : 'locked';
  vehicleControlsState.lock.status = newStatus;
  showNotification(
    `🔐 Vehicle ${newStatus}`,
    newStatus === 'locked' ? 'All doors locked' : 'All doors unlocked'
  );
  updateControlsDisplay();
}

function enableAutoLock() {
  vehicleControlsState.lock.autoLockEnabled = !vehicleControlsState.lock.autoLockEnabled;
  showNotification(
    '🔄 Auto Lock',
    `Auto lock ${vehicleControlsState.lock.autoLockEnabled ? 'enabled' : 'disabled'}`
  );
}

function enableChildLock() {
  vehicleControlsState.lock.childLockEnabled = !vehicleControlsState.lock.childLockEnabled;
  showNotification(
    '👶 Child Lock',
    `Child lock ${vehicleControlsState.lock.childLockEnabled ? 'enabled' : 'disabled'}`
  );
}

/**
 * LIGHTING SYSTEM FUNCTIONS
 */
function toggleLights() {
  vehicleControlsState.lights.main = !vehicleControlsState.lights.main;
  if (vehicleControlsState.lights.main) {
    vehicleControlsState.lights.dipped = true;
  }
  showNotification(
    `💡 Lights ${vehicleControlsState.lights.main ? 'On' : 'Off'}`,
    vehicleControlsState.lights.main
      ? 'Headlights enabled'
      : 'Headlights disabled'
  );
  updateControlsDisplay();
}

function toggleHighBeam() {
  vehicleControlsState.lights.highBeam = !vehicleControlsState.lights.highBeam;
  if (vehicleControlsState.lights.highBeam) {
    vehicleControlsState.lights.main = true;
    vehicleControlsState.lights.dipped = false;
  }
  showNotification(
    '🔆 High Beam',
    vehicleControlsState.lights.highBeam ? 'High beam on' : 'High beam off'
  );
}

function toggleFogLights() {
  vehicleControlsState.lights.fogFront = !vehicleControlsState.lights.fogFront;
  showNotification(
    '🌫️ Fog Lights',
    vehicleControlsState.lights.fogFront ? 'Fog lights on' : 'Fog lights off'
  );
}

function setAutoLights() {
  vehicleControlsState.lights.autoLights = !vehicleControlsState.lights.autoLights;
  showNotification(
    '🤖 Auto Lights',
    `Auto lights ${vehicleControlsState.lights.autoLights ? 'enabled' : 'disabled'}`
  );
}

function adjustBrightness(level) {
  vehicleControlsState.lights.brightness = Math.max(0, Math.min(100, level));
  showNotification('🔅 Brightness', `${vehicleControlsState.lights.brightness}%`);
}

/**
 * TRUNK CONTROL FUNCTIONS
 */
function toggleTrunk() {
  vehicleControlsState.trunk.status =
    vehicleControlsState.trunk.status === 'closed' ? 'open' : 'closed';
  showNotification(
    `🚗 Trunk ${vehicleControlsState.trunk.status === 'open' ? 'Opening' : 'Closing'}`,
    `Trunk is now ${vehicleControlsState.trunk.status}`
  );
  animateTrunkDoor();
  updateControlsDisplay();
}

function animateTrunkDoor() {
  const trunkBtn = document.getElementById('trunkBtn');
  if (!trunkBtn) return;
  
  trunkBtn.style.transition = 'transform 0.5s ease';
  if (vehicleControlsState.trunk.status === 'open') {
    trunkBtn.style.transform = 'rotateX(-120deg)';
  } else {
    trunkBtn.style.transform = 'rotateX(0deg)';
  }
}

function setAutoClose() {
  vehicleControlsState.trunk.autoClose = !vehicleControlsState.trunk.autoClose;
  showNotification(
    '⚙️ Auto Close',
    `Trunk auto-close ${vehicleControlsState.trunk.autoClose ? 'enabled' : 'disabled'}`
  );
}

/**
 * CLIMATE CONTROL FUNCTIONS
 */
function toggleClimateControl() {
  vehicleControlsState.climate.enabled = !vehicleControlsState.climate.enabled;
  showNotification(
    `❄️ Climate ${vehicleControlsState.climate.enabled ? 'On' : 'Off'}`,
    vehicleControlsState.climate.enabled
      ? `Temperature set to ${vehicleControlsState.climate.temperature}°C`
      : 'Climate control disabled'
  );
  updateControlsDisplay();
}

function setClimateMode(mode) {
  vehicleControlsState.climate.mode = mode;
  const modeLabels = {
    auto: 'Automatic',
    cool: 'Cooling',
    heat: 'Heating',
    dry: 'Dry Mode',
    circulation: 'Air Circulation',
  };
  showNotification('🌡️ Climate Mode', modeLabels[mode]);
}

function setTemperature(temp) {
  vehicleControlsState.climate.temperature = Math.max(16, Math.min(32, temp));
  showNotification('🌡️ Temperature', `${vehicleControlsState.climate.temperature}°C`);
}

function setFanSpeed(speed) {
  vehicleControlsState.climate.fanSpeed = Math.max(1, Math.min(10, speed));
  showNotification('🌪️ Fan Speed', `Level ${vehicleControlsState.climate.fanSpeed}/10`);
}

function toggleAC() {
  vehicleControlsState.climate.acCompressor = !vehicleControlsState.climate.acCompressor;
  showNotification(
    '❄️ Air Conditioning',
    vehicleControlsState.climate.acCompressor ? 'A/C on' : 'A/C off'
  );
}

function toggleSeatHeater(side) {
  if (side === 'left') {
    vehicleControlsState.climate.seatHeaterLeft = !vehicleControlsState.climate.seatHeaterLeft;
    showNotification(
      '🔥 Seat Heater Left',
      vehicleControlsState.climate.seatHeaterLeft ? 'Heating' : 'Off'
    );
  } else if (side === 'right') {
    vehicleControlsState.climate.seatHeaterRight = !vehicleControlsState.climate.seatHeaterRight;
    showNotification(
      '🔥 Seat Heater Right',
      vehicleControlsState.climate.seatHeaterRight ? 'Heating' : 'Off'
    );
  }
}

function toggleSteeringWarmth() {
  vehicleControlsState.climate.steeringWarmth = !vehicleControlsState.climate.steeringWarmth;
  showNotification(
    '🔥 Steering Warmth',
    vehicleControlsState.climate.steeringWarmth ? 'Heating' : 'Off'
  );
}

/**
 * SEAT ADJUSTMENT FUNCTIONS
 */
function toggleSeatSettings() {
  showNotification(
    '🛋️ Seat Adjustments',
    'Lumbar: ' + vehicleControlsState.seats.lumbarSupport + '/10'
  );
}

function adjustLumbarSupport(level) {
  vehicleControlsState.seats.lumbarSupport = Math.max(1, Math.min(10, level));
  showNotification('🛋️ Lumbar Support', `Level ${vehicleControlsState.seats.lumbarSupport}/10`);
}

function adjustHeadrestHeight(level) {
  vehicleControlsState.seats.headrestHeight = Math.max(1, Math.min(10, level));
  showNotification('↕️ Headrest Height', `Level ${vehicleControlsState.seats.headrestHeight}/10`);
}

function toggleSeatVentilation() {
  vehicleControlsState.seats.seatVentilation = !vehicleControlsState.seats.seatVentilation;
  showNotification(
    '💨 Seat Ventilation',
    vehicleControlsState.seats.seatVentilation ? 'On' : 'Off'
  );
}

function toggleSeatMassage() {
  vehicleControlsState.seats.massage = !vehicleControlsState.seats.massage;
  showNotification(
    '💆 Seat Massage',
    vehicleControlsState.seats.massage ? 'Enabled' : 'Disabled'
  );
}

function saveSeatPosition(position) {
  vehicleControlsState.seats.memory = position;
  showNotification(
    '💾 Seat Memory',
    `Position ${position} saved`
  );
}

/**
 * CAMERA SYSTEM FUNCTIONS
 */
function toggleCamera() {
  vehicleControlsState.camera.active = !vehicleControlsState.camera.active;
  vehicleControlsState.camera.mode = vehicleControlsState.camera.active ? 'recording' : 'off';
  showNotification(
    `📷 Camera ${vehicleControlsState.camera.active ? 'On' : 'Off'}`,
    vehicleControlsState.camera.active ? '🔴 Recording' : 'Camera off'
  );
  updateControlsDisplay();
}

function toggleParkingGuard() {
  vehicleControlsState.camera.parkingGuard = !vehicleControlsState.camera.parkingGuard;
  showNotification(
    '🚨 Parking Guard',
    vehicleControlsState.camera.parkingGuard ? 'Enabled' : 'Disabled'
  );
}

function toggleNightVision() {
  vehicleControlsState.camera.night = !vehicleControlsState.camera.night;
  showNotification(
    '🌙 Night Vision',
    vehicleControlsState.camera.night ? 'On' : 'Off'
  );
}

function setCameraMode(mode) {
  vehicleControlsState.camera.mode = mode;
  const modes = {
    panoramic: 'Panoramic view',
    parking: 'Parking assistance',
    recording: 'Recording',
  };
  showNotification('📷 Camera Mode', modes[mode] || mode);
}

/**
 * SETTINGS FUNCTIONS
 */
function openSettings() {
  vehicleControlsState.settings.menuOpen = !vehicleControlsState.settings.menuOpen;
  if (vehicleControlsState.settings.menuOpen) {
    showSettingsPanel();
  }
}

function showSettingsPanel() {
  const settingsHTML = `
    <div class="settings-modal">
      <div class="settings-panel">
        <h2>⚙️ Vehicle Settings</h2>
        <div class="settings-content">
          <div class="setting-item">
            <label>Display Brightness</label>
            <input type="range" min="0" max="100" value="${vehicleControlsState.settings.brightness}" 
              onchange="setDisplayBrightness(this.value)">
            <span>${vehicleControlsState.settings.brightness}%</span>
          </div>
          <div class="setting-item">
            <label>Sound Volume</label>
            <input type="range" min="0" max="100" value="${vehicleControlsState.settings.soundVolume}" 
              onchange="setSoundVolume(this.value)">
            <span>${vehicleControlsState.settings.soundVolume}%</span>
          </div>
          <div class="setting-item">
            <label>Language</label>
            <select onchange="setLanguage(this.value)">
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="German">Deutsch</option>
              <option value="French">Français</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Units</label>
            <select onchange="setUnits(this.value)">
              <option value="metric" selected>Metric (km, °C)</option>
              <option value="imperial">Imperial (mi, °F)</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Notifications</label>
            <input type="checkbox" ${vehicleControlsState.settings.notifications ? 'checked' : ''} 
              onchange="toggleNotifications()">
          </div>
          <button class="close-btn" onclick="closeSettings()">Close Settings</button>
        </div>
      </div>
    </div>
  `;
  
  let modal = document.querySelector('.settings-modal');
  if (!modal) {
    const div = document.createElement('div');
    div.innerHTML = settingsHTML;
    document.body.appendChild(div.firstElementChild);
    modal = document.querySelector('.settings-modal');
  }
  modal.style.display = 'flex';
}

function closeSettings() {
  vehicleControlsState.settings.menuOpen = false;
  const modal = document.querySelector('.settings-modal');
  if (modal) modal.style.display = 'none';
}

function setDisplayBrightness(value) {
  vehicleControlsState.settings.brightness = parseInt(value);
  document.querySelector('.app-shell').style.opacity = 0.5 + (vehicleControlsState.settings.brightness / 100) * 0.5;
  showNotification('🔅 Display Brightness', `${vehicleControlsState.settings.brightness}%`);
}

function setSoundVolume(value) {
  vehicleControlsState.settings.soundVolume = parseInt(value);
  showNotification('🔊 Sound Volume', `${vehicleControlsState.settings.soundVolume}%`);
}

function setLanguage(lang) {
  vehicleControlsState.settings.language = lang;
  showNotification('🌐 Language', `Changed to ${lang}`);
}

function setUnits(units) {
  vehicleControlsState.settings.units = units;
  showNotification('📏 Units', units === 'metric' ? 'Metric (km, °C)' : 'Imperial (mi, °F)');
}

function toggleNotifications() {
  vehicleControlsState.settings.notifications = !vehicleControlsState.settings.notifications;
  showNotification(
    '🔔 Notifications',
    vehicleControlsState.settings.notifications ? 'Enabled' : 'Disabled'
  );
}

/**
 * NOTIFICATION SYSTEM
 */
function showNotification(title, message) {
  const notification = document.createElement('div');
  notification.className = 'vehicle-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-dismiss
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * UPDATE CONTROLS DISPLAY
 */
function updateControlsDisplay() {
  const lockBtn = document.getElementById('lockBtn');
  const lightsBtn = document.getElementById('lightsBtn');
  const trunkBtn = document.getElementById('trunkBtn');
  const climateBtn = document.getElementById('climateBtn');
  const cameraBtn = document.getElementById('cameraBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  if (lockBtn) {
    lockBtn.classList.toggle('on', vehicleControlsState.lock.status === 'locked');
    lockBtn.title = `Vehicle ${vehicleControlsState.lock.status}`;
  }
  
  if (lightsBtn) {
    lightsBtn.classList.toggle('on', vehicleControlsState.lights.main);
    lightsBtn.title = vehicleControlsState.lights.main ? 'Lights On' : 'Lights Off';
  }
  
  if (trunkBtn) {
    trunkBtn.classList.toggle('on', vehicleControlsState.trunk.status === 'open');
    trunkBtn.title = `Trunk ${vehicleControlsState.trunk.status}`;
  }
  
  if (climateBtn) {
    climateBtn.classList.toggle('on', vehicleControlsState.climate.enabled);
    climateBtn.title = vehicleControlsState.climate.enabled 
      ? `Climate: ${vehicleControlsState.climate.temperature}°C` 
      : 'Climate Off';
  }
  
  if (cameraBtn) {
    cameraBtn.classList.toggle('on', vehicleControlsState.camera.active);
    cameraBtn.title = vehicleControlsState.camera.active ? '🔴 Recording' : 'Camera Off';
  }
  
  if (settingsBtn) {
    settingsBtn.classList.toggle('on', vehicleControlsState.settings.menuOpen);
    settingsBtn.title = 'Settings';
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Re-attach enhanced event listeners
    const lockBtn = document.getElementById('lockBtn');
    const unlockBtn = document.getElementById('unlockBtn');
    const lightsBtn = document.getElementById('lightsBtn');
    const trunkBtn = document.getElementById('trunkBtn');
    const climateBtn = document.getElementById('climateBtn');
    const seatsBtn = document.getElementById('seatsBtn');
    const cameraBtn = document.getElementById('cameraBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    if (lockBtn) lockBtn.addEventListener('dblclick', enableAutoLock);
    if (unlockBtn) unlockBtn.addEventListener('dblclick', enableChildLock);
    if (lightsBtn) lightsBtn.addEventListener('dblclick', toggleHighBeam);
    if (trunkBtn) trunkBtn.addEventListener('dblclick', setAutoClose);
    if (climateBtn) climateBtn.addEventListener('dblclick', toggleAC);
    if (seatsBtn) seatsBtn.addEventListener('dblclick', toggleSeatVentilation);
    if (cameraBtn) cameraBtn.addEventListener('dblclick', toggleParkingGuard);
    if (settingsBtn) settingsBtn.addEventListener('dblclick', openSettings);

    updateControlsDisplay();
  }, 1000);
});
