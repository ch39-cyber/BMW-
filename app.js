const appState = {
  fuel: 68,
  battery: 72,
  engineTemp: 92,
  tirePressure: 2.4,
  speed: 75,
  gear: 'D',
  mode: 'COMFORT',
  speedLimit: 80,
  routeDistance: 2.4,
  routeInstruction: 'Turn Right',
  routeDestination: 'City Center',
  eta: '12:58 PM',
  travelTime: '13 min',
  routeLength: '7.2 km',
  topTemperature: 24,
  weatherIcon: '☀️',
  attention: 85,
  eyeStatus: 'Open',
  faceDetected: 'Yes',
  mediaPosition: 85,
  mediaDuration: 225,
  isPlaying: true,
  vehicleLocked: true,
  lightsOn: false,
  trunkOpen: false,
  cameraActive: false,
  climateOn: true,
  seatsAdjusted: false,
  settingsOpen: false,
  drivingAssists: {
    laneAssist: true,
    adaptiveCruise: true,
    collisionWarning: true,
    blindSpotMonitor: true,
  },
  activePage: 'Cockpit',
  tracks: [
    { title: 'Dream Ahead', subtitle: 'BMW Sounds · Electric Collection', duration: 225 },
    { title: 'City Nights', subtitle: 'Autobahn Audio', duration: 204 },
    { title: 'Energy Flow', subtitle: 'Electric Pulse', duration: 193 },
  ],
  trackIndex: 0,
  routeSegments: [
    { distance: 2.4, instruction: 'Turn Right', destination: 'City Center' },
    { distance: 1.4, instruction: 'Keep Left', destination: 'City Bridge' },
    { distance: 0.4, instruction: 'Prepare to Arrive', destination: 'Destination' },
  ],
  segmentIndex: 0,
  vehicleDistance: 12580,
  bannerText: 'All Systems Normal',
  bannerType: 'success',
  aiResponse: 'Hello Driver, I am BMW Smart AI. Ask me to navigate, optimize route, control systems, or check vehicle status.',
  aiSuggestions: ['Navigate to work', 'Play next track', 'Turn on lights', 'Lock doors', 'Check vehicle status'],
};

const elements = {
  topTemperature: document.getElementById('top-temperature'),
  weatherIcon: document.querySelector('.weather'),
  voiceCommandText: document.getElementById('voiceCommandText'),
  fuelValue: document.getElementById('fuel-value'),
  fuelBar: document.getElementById('fuel-bar'),
  batteryValue: document.getElementById('battery-value'),
  batteryBar: document.getElementById('battery-bar'),
  engineValue: document.getElementById('engine-value'),
  engineBar: document.getElementById('engine-bar'),
  tireValue: document.getElementById('tire-value'),
  tireBar: document.getElementById('tire-bar'),
  routeDistance: document.getElementById('routeDistance'),
  routeInstruction: document.getElementById('routeInstruction'),
  routeSubtitle: document.getElementById('routeSubtitle'),
  speedLimitValue: document.getElementById('speedLimitValue'),
  speedLimitCard: document.getElementById('speedLimitCard'),
  currentSpeed: document.getElementById('currentSpeed'),
  currentGear: document.getElementById('currentGear'),
  clusterSpeed: document.querySelector('.cluster-speed'),
  clusterGear: document.querySelector('.cluster-gear'),
  clusterInfo: document.getElementById('clusterInfo'),
  attentionPercent: document.getElementById('attentionPercent'),
  attentionFill: document.getElementById('attention-fill'),
  eyeStatus: document.getElementById('eyeStatus'),
  faceDetected: document.getElementById('faceDetected'),
  navStep: document.getElementById('navStep'),
  navAction: document.getElementById('navAction'),
  navDestination: document.getElementById('navDestination'),
  navEta: document.getElementById('navEta'),
  navTravelTime: document.getElementById('navTravelTime'),
  navLength: document.getElementById('navLength'),
  mediaPosition: document.getElementById('mediaPosition'),
  mediaDuration: document.getElementById('mediaDuration'),
  mediaProgressFill: document.getElementById('mediaProgressFill'),
  trackTitle: document.getElementById('trackTitle'),
  trackSubtitle: document.getElementById('trackSubtitle'),
  playPauseBtn: document.getElementById('playPauseBtn'),
  prevTrackBtn: document.getElementById('prevTrack'),
  nextTrackBtn: document.getElementById('nextTrack'),
  speedRange: document.getElementById('speedRange'),
  laneAssistBtn: document.getElementById('laneAssistBtn'),
  adaptiveCruiseBtn: document.getElementById('adaptiveCruiseBtn'),
  collisionWarningBtn: document.getElementById('collisionWarningBtn'),
  blindSpotBtn: document.getElementById('blindSpotBtn'),
  lockBtn: document.getElementById('lockBtn'),
  unlockBtn: document.getElementById('unlockBtn'),
  lightsBtn: document.getElementById('lightsBtn'),
  trunkBtn: document.getElementById('trunkBtn'),
  climateBtn: document.getElementById('climateBtn'),
  seatsBtn: document.getElementById('seatsBtn'),
  cameraBtn: document.getElementById('cameraBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  aiInput: document.getElementById('aiInput'),
  aiSendBtn: document.getElementById('aiSendBtn'),
  aiResponse: document.getElementById('aiResponse'),
  aiSuggestions: document.getElementById('aiSuggestions'),
  aiHelpBtn: document.getElementById('aiHelpBtn'),
  statusBanner: document.querySelector('.status-banner'),
  navTabs: document.querySelectorAll('.nav-tab'),
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}

function formatEta(addMinutes) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + addMinutes);
  const hours = now.getHours() % 12 || 12;
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const suffix = now.getHours() >= 12 ? 'PM' : 'AM';
  return `${hours}:${minutes} ${suffix}`;
}

function setToggleState(button, active) {
  button.classList.toggle('on', active);
  button.textContent = active ? 'ON' : 'OFF';
}

function setControlState(button, active) {
  button.classList.toggle('on', active);
}

function updateRouteState() {
  const segment = appState.routeSegments[appState.segmentIndex];
  appState.routeInstruction = segment.instruction;
  appState.routeDestination = segment.destination;

  const remaining = Math.max(0.2, appState.routeDistance);
  appState.travelTime = `${Math.max(1, Math.ceil(remaining * 5))} min`;
  appState.eta = formatEta(Number(appState.travelTime.replace(' min', '')));
  appState.routeLength = `${remaining.toFixed(1)} km`;
  appState.navStep = `${remaining.toFixed(1)} km`;

  if (remaining < 1.2 && appState.segmentIndex < appState.routeSegments.length - 1) {
    appState.segmentIndex += 1;
  }
}

function updateWarnings() {
  const speedWarning = appState.speed > appState.speedLimit;
  appState.bannerText = speedWarning ? 'Speed Limit Exceeded' : 'All Systems Normal';
  appState.bannerType = speedWarning ? 'warning' : 'success';
  if (speedWarning) {
    appState.attention = Math.max(50, appState.attention - 5);
  }
}

function parseAiCommand(command) {
  const text = command.toLowerCase();

  if (/navigate|route to|go to|take me to/.test(text)) {
    const destinations = {
      work: { destination: 'City Center', distance: 7.2, instruction: 'Keep right toward City Center' },
      home: { destination: 'Home Hub', distance: 5.8, instruction: 'Continue straight to Home Hub' },
      airport: { destination: 'Airport Terminal', distance: 12.4, instruction: 'Take the expressway to Airport Terminal' },
      city: { destination: 'City Center', distance: 7.2, instruction: 'Keep right toward City Center' },
      office: { destination: 'City Center', distance: 7.2, instruction: 'Keep right toward City Center' },
    };

    const match = Object.keys(destinations).find((keyword) => text.includes(keyword));
    const route = match ? destinations[match] : { destination: command.replace(/.*to\s+/i, '').trim(), distance: 4.6, instruction: 'Follow the route guidance' };

    appState.routeDestination = route.destination;
    appState.routeInstruction = route.instruction;
    appState.routeDistance = route.distance;
    appState.routeSegments = [
      { distance: route.distance, instruction: route.instruction, destination: route.destination },
      { distance: Math.max(0.2, route.distance * 0.35), instruction: 'Prepare for arrival', destination: route.destination },
    ];
    appState.segmentIndex = 0;
    appState.travelTime = `${Math.max(1, Math.ceil(route.distance * 5))} min`;
    appState.eta = formatEta(Math.max(1, Math.ceil(route.distance * 5)));
    appState.activePage = 'Map';
    updateSuggestions();
    return `Routing to ${route.destination}. Estimated ${appState.travelTime}.`;
  }

  if (/show (cockpit|dashboard)|cockpit view/.test(text)) {
    appState.activePage = 'Cockpit';
    updateSuggestions();
    return 'Showing cockpit view.';
  }

  if (/show map/.test(text)) {
    appState.activePage = 'Map';
    updateSuggestions();
    return 'Showing map view.';
  }

  if (/play|pause|next|previous|track|song/.test(text)) {
    if (/pause/.test(text)) {
      appState.isPlaying = false;
      updateSuggestions();
      return 'Media playback paused.';
    }
    if (/next/.test(text) || /forward/.test(text)) {
      changeTrack(1);
      updateSuggestions();
      return `Playing next track: ${appState.tracks[appState.trackIndex].title}.`;
    }
    if (/previous/.test(text) || /back/.test(text)) {
      changeTrack(-1);
      updateSuggestions();
      return `Playing previous track: ${appState.tracks[appState.trackIndex].title}.`;
    }
    appState.isPlaying = true;
    updateSuggestions();
    return `Playing ${appState.tracks[appState.trackIndex].title}.`;
  }

  if (/lights/.test(text)) {
    appState.lightsOn = /on/.test(text) || !/off/.test(text);
    updateSuggestions();
    return `Lights turned ${appState.lightsOn ? 'on' : 'off'}.`;
  }

  if (/lock|unlock/.test(text)) {
    appState.vehicleLocked = /unlock/.test(text) ? false : true;
    updateSuggestions();
    return `Vehicle ${appState.vehicleLocked ? 'locked' : 'unlocked'}.`;
  }

  if (/climate/.test(text)) {
    appState.climateOn = /on/.test(text) || !/off/.test(text);
    updateSuggestions();
    return `Climate system ${appState.climateOn ? 'enabled' : 'disabled'}.`;
  }

  if (/trunk/.test(text)) {
    appState.trunkOpen = /open/.test(text) ? true : /close/.test(text) ? false : !appState.trunkOpen;
    updateSuggestions();
    return `Trunk ${appState.trunkOpen ? 'opened' : 'closed'}.`;
  }

  if (/status|health|report/.test(text)) {
    return `Vehicle status: Fuel ${appState.fuel}%, Battery ${appState.battery}%, Tires ${appState.tirePressure.toFixed(1)} bar, Attention ${appState.attention}%, ${appState.bannerText}.`;
  }

  if (/assistant|autopilot|driver/.test(text)) {
    return 'BMW Smart AI is monitoring your drive, optimizing your route, and keeping you informed.';
  }

  return 'I am ready to assist. Try commands such as "Navigate to work", "Play next track", "Turn on lights", or "Lock the car".';
}

function updateSuggestions() {
  appState.aiSuggestions = [
    appState.activePage !== 'Map' ? 'Navigate to work' : 'Show cockpit view',
    appState.isPlaying ? 'Pause music' : 'Play music',
    appState.lightsOn ? 'Turn off lights' : 'Turn on lights',
    appState.vehicleLocked ? 'Unlock doors' : 'Lock doors',
    'Check vehicle status',
  ];
}

function refreshAiUI() {
  if (!elements.aiSuggestions) return;
  
  elements.aiSuggestions.innerHTML = '';
  appState.aiSuggestions.forEach((suggestion) => {
    const chip = document.createElement('div');
    chip.className = 'ai-suggestion-chip';
    chip.textContent = suggestion;
    chip.addEventListener('click', () => {
      elements.aiInput.value = suggestion;
      processAiInput();
    });
    elements.aiSuggestions.appendChild(chip);
  });
}

function processAiInput() {
  const input = elements.aiInput.value.trim();
  if (!input) return;

  const response = parseAiCommand(input);
  appState.aiResponse = response;
  elements.aiResponse.textContent = response;
  elements.aiInput.value = '';

  updateStatus();
  refreshAiUI();
}

function updateStatus() {
  updateWarnings();
  updateRouteState();
  if (elements.speedRange) {
    elements.speedRange.value = appState.speed;
  }

  elements.topTemperature.textContent = `${appState.topTemperature}°C`;
  elements.weatherIcon.textContent = appState.weatherIcon;
  elements.fuelValue.textContent = `${appState.fuel}%`;
  elements.fuelBar.style.width = `${appState.fuel}%`;
  elements.batteryValue.textContent = `${appState.battery}%`;
  elements.batteryBar.style.width = `${appState.battery}%`;
  elements.engineValue.textContent = `${appState.engineTemp}°C`;
  elements.engineBar.style.width = `${Math.min(appState.engineTemp, 130) / 130 * 100}%`;
  elements.tireValue.textContent = `${appState.tirePressure.toFixed(1)} bar`;
  elements.tireBar.style.width = `${((appState.tirePressure - 1.8) / 1.0) * 100}%`;
  elements.routeDistance.textContent = `${appState.routeDistance.toFixed(1)} km`;
  elements.routeInstruction.textContent = appState.routeInstruction;
  elements.routeSubtitle.textContent = appState.routeDestination;
  elements.speedLimitValue.textContent = appState.speedLimit;
  elements.currentSpeed.textContent = appState.speed;
  elements.currentGear.textContent = appState.gear;
  elements.clusterSpeed.textContent = appState.speed;
  elements.clusterGear.textContent = appState.gear;
  elements.clusterInfo.textContent = `${document.getElementById('top-time').textContent} · ${appState.vehicleDistance.toLocaleString()} km · +${appState.topTemperature}°C`;
  elements.attentionPercent.textContent = `${appState.attention}%`;
  elements.attentionFill.style.width = `${appState.attention}%`;
  elements.eyeStatus.textContent = appState.eyeStatus;
  elements.faceDetected.textContent = appState.faceDetected;

  const currentTrack = appState.tracks[appState.trackIndex];
  elements.trackTitle.textContent = currentTrack.title;
  elements.trackSubtitle.textContent = currentTrack.subtitle;
  appState.mediaDuration = currentTrack.duration;
  elements.mediaPosition.textContent = formatTime(appState.mediaPosition);
  elements.mediaDuration.textContent = formatTime(appState.mediaDuration);
  elements.mediaProgressFill.style.width = `${(appState.mediaPosition / appState.mediaDuration) * 100}%`;
  elements.playPauseBtn.textContent = appState.isPlaying ? '⏸' : '▶';

  elements.navStep.textContent = `${appState.routeDistance.toFixed(1)} km`;
  elements.navAction.textContent = appState.routeInstruction;
  elements.navDestination.textContent = appState.routeDestination;
  elements.navEta.textContent = `ETA ${appState.eta}`;
  elements.navTravelTime.textContent = appState.travelTime;
  elements.navLength.textContent = appState.routeLength;

  setToggleState(elements.laneAssistBtn, appState.drivingAssists.laneAssist);
  setToggleState(elements.adaptiveCruiseBtn, appState.drivingAssists.adaptiveCruise);
  setToggleState(elements.collisionWarningBtn, appState.drivingAssists.collisionWarning);
  setToggleState(elements.blindSpotBtn, appState.drivingAssists.blindSpotMonitor);
  setControlState(elements.lightsBtn, appState.lightsOn);
  setControlState(elements.climateBtn, appState.climateOn);
  setControlState(elements.seatsBtn, appState.seatsAdjusted);
  setControlState(elements.cameraBtn, appState.cameraActive);
  setControlState(elements.settingsBtn, appState.settingsOpen);
  elements.trunkBtn.classList.toggle('on', appState.trunkOpen);

  elements.lockBtn.disabled = appState.vehicleLocked;
  elements.unlockBtn.disabled = !appState.vehicleLocked;
  elements.lockBtn.classList.toggle('on', appState.vehicleLocked);
  elements.unlockBtn.classList.toggle('on', !appState.vehicleLocked);

  elements.statusBanner.textContent = appState.bannerText;
  elements.statusBanner.classList.toggle('warning', appState.bannerType === 'warning');
  elements.statusBanner.classList.toggle('success', appState.bannerType === 'success');
  elements.speedLimitCard.classList.toggle('warning', appState.speed > appState.speedLimit);

  updateSuggestions();
  refreshAiUI();

  elements.navTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.page === appState.activePage);
  });
  elements.voiceCommandText.textContent = `Hey BMW, show ${appState.activePage.toLowerCase()} view`;
}

function consumeSpeedChange(value) {
  appState.speed = value;
  if (appState.speed >= 120) appState.mode = 'SPORT';
  else if (appState.speed >= 60) appState.mode = 'COMFORT';
  else appState.mode = 'ECO';
  appState.attention = Math.max(50, 100 - Math.floor((appState.speed - 30) / 2));
  appState.routeDistance = Math.max(0.2, appState.routeDistance - (value / 2400));
  appState.mediaPosition = Math.min(appState.mediaDuration, appState.mediaPosition + 1);
  updateRouteState();
  updateWarnings();
  document.querySelector('.hud-mode').textContent = appState.mode;
  updateStatus();
}

function toggleDriveAssist(key) {
  appState.drivingAssists[key] = !appState.drivingAssists[key];
  updateWarnings();
  updateStatus();
}

function changeTrack(offset) {
  appState.trackIndex = (appState.trackIndex + offset + appState.tracks.length) % appState.tracks.length;
  appState.mediaPosition = 0;
  updateStatus();
}

function animateMedia() {
  if (appState.isPlaying) {
    appState.mediaPosition += 1;
    if (appState.mediaPosition >= appState.mediaDuration) {
      changeTrack(1);
    } else {
      updateStatus();
    }
  }
}

function setupEventListeners() {
  elements.speedRange.addEventListener('input', (event) => {
    consumeSpeedChange(Number(event.target.value));
  });

  elements.laneAssistBtn.addEventListener('click', () => toggleDriveAssist('laneAssist'));
  elements.adaptiveCruiseBtn.addEventListener('click', () => toggleDriveAssist('adaptiveCruise'));
  elements.collisionWarningBtn.addEventListener('click', () => toggleDriveAssist('collisionWarning'));
  elements.blindSpotBtn.addEventListener('click', () => toggleDriveAssist('blindSpotMonitor'));

  elements.lockBtn.addEventListener('click', () => {
    appState.vehicleLocked = true;
    updateStatus();
  });
  elements.unlockBtn.addEventListener('click', () => {
    appState.vehicleLocked = false;
    updateStatus();
  });
  elements.lightsBtn.addEventListener('click', () => {
    appState.lightsOn = !appState.lightsOn;
    updateStatus();
  });
  elements.trunkBtn.addEventListener('click', () => {
    appState.trunkOpen = !appState.trunkOpen;
    updateStatus();
  });
  elements.climateBtn.addEventListener('click', () => {
    appState.climateOn = !appState.climateOn;
    updateStatus();
  });
  elements.seatsBtn.addEventListener('click', () => {
    appState.seatsAdjusted = !appState.seatsAdjusted;
    updateStatus();
  });
  elements.cameraBtn.addEventListener('click', () => {
    appState.cameraActive = !appState.cameraActive;
    updateStatus();
  });
  elements.settingsBtn.addEventListener('click', () => {
    appState.settingsOpen = !appState.settingsOpen;
    updateStatus();
  });

  elements.playPauseBtn.addEventListener('click', () => {
    appState.isPlaying = !appState.isPlaying;
    elements.playPauseBtn.textContent = appState.isPlaying ? '⏸' : '▶';
  });
  elements.prevTrackBtn.addEventListener('click', () => changeTrack(-1));
  elements.nextTrackBtn.addEventListener('click', () => changeTrack(1));

  elements.navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      appState.activePage = tab.dataset.page;
      updateStatus();
    });
  });

  if (elements.aiSendBtn) {
    elements.aiSendBtn.addEventListener('click', processAiInput);
  }

  if (elements.aiInput) {
    elements.aiInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        processAiInput();
      }
    });
  }
}

function startClock() {
  const timeElement = document.getElementById('top-time');
  function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const suffix = now.getHours() >= 12 ? 'PM' : 'AM';
    timeElement.textContent = `${hours}:${minutes} ${suffix}`;
  }
  updateClock();
  setInterval(updateClock, 1000 * 30);
}

function init() {
  setupEventListeners();
  updateRouteState();
  updateWarnings();
  updateSuggestions();
  refreshAiUI();
  updateStatus();
  startClock();
  setInterval(animateMedia, 1000);
}

init();
