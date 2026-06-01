/**
 * GPS Navigation System for BMW SmartDrive
 * Real-time location tracking, distance calculation, direction guidance
 * Integrates Geolocation API with turn-by-turn navigation
 */

const gpsNavigationState = {
  // Current Location
  currentLocation: {
    latitude: 28.6139,
    longitude: 77.2090,
    accuracy: 0,
    altitude: 0,
    speed: 0,
    heading: 0,
    timestamp: null,
  },

  // Destination
  destination: {
    latitude: 28.5244,
    longitude: 77.1855,
    name: 'City Center',
    address: '123 Main Street, New Delhi',
  },

  // Route Data
  routeData: {
    totalDistance: 0,
    remainingDistance: 0,
    totalDuration: 0,
    remainingDuration: 0,
    waypoints: [],
    currentWaypoint: 0,
    routePolyline: [],
  },

  // Navigation State
  navigationActive: false,
  nextTurnDistance: 0,
  nextTurnDirection: '',
  nextTurnStreet: '',
  arrival: {
    eta: null,
    distance: 0,
    duration: 0,
  },

  // Historical Tracking
  locationHistory: [],
  speedHistory: [],
  maxHistory: 100,

  // Alerts
  speedAlert: false,
  speedAlertThreshold: 80,
  offRouteAlert: false,
  offRouteThreshold: 50, // meters
};

const gpsElements = {
  currentLatitude: null,
  currentLongitude: null,
  currentAccuracy: null,
  currentSpeed: null,
  currentHeading: null,
  destinationName: null,
  destinationDistance: null,
  destinationDuration: null,
  destinationEta: null,
  nextTurnDirection: null,
  nextTurnDistance: null,
  nextTurnStreet: null,
  routeMapCanvas: null,
  speedAlertBanner: null,
  offRouteAlertBanner: null,
  gpsStatusIndicator: null,
  navigationStartBtn: null,
  navigationStopBtn: null,
  recenterMapBtn: null,
  mockLocationBtn: null,
};

/**
 * Initialize GPS Navigation System
 */
function initializeGpsNavigation() {
  createGpsPanel();
  attachGpsEventListeners();
  startLocationTracking();
  updateNavigationUI();
}

/**
 * Create GPS Navigation Panel UI
 */
function createGpsPanel() {
  const gpsHTML = `
    <section class="panel card gps-navigation-panel">
      <div class="gps-header">
        <h2>🧭 GPS NAVIGATION</h2>
        <span class="gps-status-indicator" id="gpsStatusIndicator">●</span>
      </div>

      <!-- Current Location Status -->
      <div class="gps-status-card">
        <div class="status-row">
          <span class="label">Current Location</span>
          <div class="location-data">
            <span id="currentLatitude">--.----°</span> | <span id="currentLongitude">--.----°</span>
          </div>
        </div>
        <div class="status-row">
          <span class="label">Accuracy</span>
          <span id="currentAccuracy">---m</span>
        </div>
        <div class="status-row">
          <span class="label">Current Speed</span>
          <span id="currentSpeed">0 km/h</span>
        </div>
        <div class="status-row">
          <span class="label">Heading</span>
          <span id="currentHeading">↑ 0°</span>
        </div>
      </div>

      <!-- Destination Information -->
      <div class="destination-card">
        <div class="destination-header">
          <h3 id="destinationName">Select Destination</h3>
          <button class="destination-clear-btn" id="clearDestinationBtn">✕</button>
        </div>
        <div class="destination-meta">
          <div class="meta-row">
            <span class="icon">📍</span>
            <span id="destinationDistance">-- km</span>
            <span class="separator">|</span>
            <span id="destinationDuration">-- min</span>
          </div>
          <div class="meta-row">
            <span class="icon">🕐</span>
            <span>ETA: </span>
            <span id="destinationEta">--:-- --</span>
          </div>
        </div>
      </div>

      <!-- Next Turn Guidance -->
      <div class="turn-guidance-card">
        <div class="turn-visualization">
          <div class="turn-arrow" id="nextTurnDirection">→</div>
          <div class="turn-info">
            <div class="turn-distance" id="nextTurnDistance">-- m</div>
            <div class="turn-street" id="nextTurnStreet">-- Street</div>
          </div>
        </div>
      </div>

      <!-- Route Map Canvas -->
      <div class="route-map-container">
        <canvas id="routeMapCanvas" class="route-map-canvas" width="300" height="240"></canvas>
        <button class="recenter-btn" id="recenterMapBtn">⊙ Recenter</button>
      </div>

      <!-- Speed & Alert Warnings -->
      <div id="speedAlertBanner" class="alert-banner speed-alert" style="display:none;">
        ⚠️ Speed Limit Exceeded
      </div>
      <div id="offRouteAlertBanner" class="alert-banner offroute-alert" style="display:none;">
        ⚠️ Off Route - Recalculating...
      </div>

      <!-- Navigation Controls -->
      <div class="navigation-controls">
        <button id="navigationStartBtn" class="nav-btn start-btn">▶ Start Navigation</button>
        <button id="navigationStopBtn" class="nav-btn stop-btn" style="display:none;">⏹ Stop Navigation</button>
        <button id="mockLocationBtn" class="nav-btn mock-btn">🎮 Simulate Drive</button>
      </div>

      <!-- Quick Destinations -->
      <div class="quick-destinations">
        <h4>Quick Destinations</h4>
        <div class="destination-chips">
          <button class="dest-chip" data-dest="home">🏠 Home</button>
          <button class="dest-chip" data-dest="work">💼 Work</button>
          <button class="dest-chip" data-dest="airport">✈️ Airport</button>
        </div>
      </div>

      <!-- Location History -->
      <div class="location-history">
        <h4>Recent Locations</h4>
        <div id="locationHistoryList" class="history-list"></div>
      </div>
    </section>
  `;

  const rightPanel = document.querySelector('.right-panel');
  const navPanelExists = document.querySelector('.gps-navigation-panel');
  
  if (!navPanelExists && rightPanel) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = gpsHTML;
    rightPanel.insertBefore(tempDiv.firstElementChild, rightPanel.firstChild);
    cacheGpsElements();
  }
}

/**
 * Cache GPS UI Elements
 */
function cacheGpsElements() {
  gpsElements.currentLatitude = document.getElementById('currentLatitude');
  gpsElements.currentLongitude = document.getElementById('currentLongitude');
  gpsElements.currentAccuracy = document.getElementById('currentAccuracy');
  gpsElements.currentSpeed = document.getElementById('currentSpeed');
  gpsElements.currentHeading = document.getElementById('currentHeading');
  gpsElements.destinationName = document.getElementById('destinationName');
  gpsElements.destinationDistance = document.getElementById('destinationDistance');
  gpsElements.destinationDuration = document.getElementById('destinationDuration');
  gpsElements.destinationEta = document.getElementById('destinationEta');
  gpsElements.nextTurnDirection = document.getElementById('nextTurnDirection');
  gpsElements.nextTurnDistance = document.getElementById('nextTurnDistance');
  gpsElements.nextTurnStreet = document.getElementById('nextTurnStreet');
  gpsElements.routeMapCanvas = document.getElementById('routeMapCanvas');
  gpsElements.speedAlertBanner = document.getElementById('speedAlertBanner');
  gpsElements.offRouteAlertBanner = document.getElementById('offRouteAlertBanner');
  gpsElements.gpsStatusIndicator = document.getElementById('gpsStatusIndicator');
  gpsElements.navigationStartBtn = document.getElementById('navigationStartBtn');
  gpsElements.navigationStopBtn = document.getElementById('navigationStopBtn');
  gpsElements.recenterMapBtn = document.getElementById('recenterMapBtn');
  gpsElements.mockLocationBtn = document.getElementById('mockLocationBtn');
}

/**
 * Attach Event Listeners
 */
function attachGpsEventListeners() {
  if (gpsElements.navigationStartBtn) {
    gpsElements.navigationStartBtn.addEventListener('click', startNavigation);
  }
  if (gpsElements.navigationStopBtn) {
    gpsElements.navigationStopBtn.addEventListener('click', stopNavigation);
  }
  if (gpsElements.recenterMapBtn) {
    gpsElements.recenterMapBtn.addEventListener('click', recenterMap);
  }
  if (gpsElements.mockLocationBtn) {
    gpsElements.mockLocationBtn.addEventListener('click', toggleMockLocation);
  }

  // Quick destination chips
  document.querySelectorAll('.dest-chip').forEach((chip) => {
    chip.addEventListener('click', () => setQuickDestination(chip.dataset.dest));
  });

  // Clear destination
  const clearBtn = document.getElementById('clearDestinationBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => clearDestination());
  }
}

/**
 * Start Location Tracking with Geolocation API
 */
function startLocationTracking() {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser');
    setGpsStatus('error');
    return;
  }

  setGpsStatus('tracking');

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  navigator.geolocation.watchPosition(
    (position) => updateCurrentLocation(position),
    (error) => handleLocationError(error),
    options
  );
}

/**
 * Update Current Location from Geolocation API
 */
function updateCurrentLocation(position) {
  const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
  const timestamp = position.timestamp;

  gpsNavigationState.currentLocation = {
    latitude,
    longitude,
    accuracy,
    altitude: altitude || 0,
    speed: speed ? speed * 3.6 : 0, // Convert m/s to km/h
    heading: heading || 0,
    timestamp,
  };

  // Store in history
  if (gpsNavigationState.locationHistory.length >= gpsNavigationState.maxHistory) {
    gpsNavigationState.locationHistory.shift();
  }
  gpsNavigationState.locationHistory.push({
    lat: latitude,
    lng: longitude,
    time: new Date(),
  });

  // Update Speed History
  if (gpsNavigationState.speedHistory.length >= gpsNavigationState.maxHistory) {
    gpsNavigationState.speedHistory.shift();
  }
  gpsNavigationState.speedHistory.push(gpsNavigationState.currentLocation.speed);

  setGpsStatus('active');
  updateNavigationUI();
  updateRouteMetrics();
  checkAlerts();
  drawRouteMap();
}

/**
 * Handle Location Errors
 */
function handleLocationError(error) {
  console.error('Geolocation Error:', error.message);
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log('User denied the request for Geolocation');
      setGpsStatus('denied');
      break;
    case error.POSITION_UNAVAILABLE:
      console.log('Location information is unavailable');
      setGpsStatus('unavailable');
      break;
    case error.TIMEOUT:
      console.log('The request to get user location timed out');
      break;
  }
}

/**
 * Set GPS Status Indicator
 */
function setGpsStatus(status) {
  const indicator = gpsElements.gpsStatusIndicator;
  if (!indicator) return;

  const statusMap = {
    active: { color: '#72ffb7', text: '● Active' },
    tracking: { color: '#3cd1ff', text: '● Tracking' },
    error: { color: '#ff5a5a', text: '● Error' },
    denied: { color: '#ff8c42', text: '● Denied' },
    unavailable: { color: '#ff8c42', text: '● Unavailable' },
  };

  const config = statusMap[status] || statusMap.error;
  indicator.style.color = config.color;
  indicator.title = config.text;
}

/**
 * Start Navigation to Destination
 */
function startNavigation() {
  if (!gpsNavigationState.destination.latitude || !gpsNavigationState.destination.longitude) {
    alert('Please select a destination first');
    return;
  }

  gpsNavigationState.navigationActive = true;
  gpsElements.navigationStartBtn.style.display = 'none';
  gpsElements.navigationStopBtn.style.display = 'block';
  calculateRoute();
}

/**
 * Stop Navigation
 */
function stopNavigation() {
  gpsNavigationState.navigationActive = false;
  gpsElements.navigationStartBtn.style.display = 'block';
  gpsElements.navigationStopBtn.style.display = 'none';
  gpsElements.speedAlertBanner.style.display = 'none';
  gpsElements.offRouteAlertBanner.style.display = 'none';
}

/**
 * Calculate Route using Simple Distance Formula
 */
function calculateRoute() {
  const current = gpsNavigationState.currentLocation;
  const dest = gpsNavigationState.destination;

  // Haversine formula for distance calculation
  const R = 6371; // Earth's radius in km
  const dLat = ((dest.latitude - current.latitude) * Math.PI) / 180;
  const dLon = ((dest.longitude - current.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((current.latitude * Math.PI) / 180) *
      Math.cos((dest.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Estimate duration (assuming 60 km/h average)
  const duration = (distance / 60) * 60; // in minutes

  gpsNavigationState.routeData.totalDistance = distance;
  gpsNavigationState.routeData.remainingDistance = distance;
  gpsNavigationState.routeData.totalDuration = duration;
  gpsNavigationState.routeData.remainingDuration = duration;

  // Create simple waypoints
  createWaypoints(current, dest, distance);
}

/**
 * Create Route Waypoints
 */
function createWaypoints(current, dest, distance) {
  gpsNavigationState.routeData.waypoints = [
    {
      latitude: current.latitude,
      longitude: current.longitude,
      name: 'Start',
      distance: 0,
      duration: 0,
    },
  ];

  // Create intermediate waypoints
  const steps = Math.ceil(distance / 1.5); // ~1.5 km per waypoint
  for (let i = 1; i < steps; i++) {
    const progress = i / steps;
    gpsNavigationState.routeData.waypoints.push({
      latitude: current.latitude + (dest.latitude - current.latitude) * progress,
      longitude: current.longitude + (dest.longitude - current.longitude) * progress,
      name: `Waypoint ${i}`,
      distance: distance * (1 - progress),
      duration: gpsNavigationState.routeData.totalDuration * (1 - progress),
    });
  }

  // Add destination
  gpsNavigationState.routeData.waypoints.push({
    latitude: dest.latitude,
    longitude: dest.longitude,
    name: dest.name,
    distance: 0,
    duration: 0,
  });

  gpsNavigationState.routeData.currentWaypoint = 0;
}

/**
 * Update Route Metrics
 */
function updateRouteMetrics() {
  if (!gpsNavigationState.navigationActive) return;

  const current = gpsNavigationState.currentLocation;
  const dest = gpsNavigationState.destination;

  // Calculate remaining distance
  const R = 6371;
  const dLat = ((dest.latitude - current.latitude) * Math.PI) / 180;
  const dLon = ((dest.longitude - current.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((current.latitude * Math.PI) / 180) *
      Math.cos((dest.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const remainingDistance = R * c;

  gpsNavigationState.routeData.remainingDistance = remainingDistance;
  gpsNavigationState.routeData.remainingDuration = Math.max(
    1,
    Math.ceil((remainingDistance / 60) * 60)
  );

  // Calculate ETA
  const now = new Date();
  now.setMinutes(now.getMinutes() + gpsNavigationState.routeData.remainingDuration);
  gpsNavigationState.arrival.eta = now;
  gpsNavigationState.arrival.distance = remainingDistance;
  gpsNavigationState.arrival.duration = gpsNavigationState.routeData.remainingDuration;

  // Update next turn
  updateNextTurn(current);
}

/**
 * Update Next Turn Information
 */
function updateNextTurn(current) {
  const dest = gpsNavigationState.destination;

  // Calculate bearing to destination
  const dLon =
    ((dest.longitude - current.longitude) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((dest.latitude * Math.PI) / 180);
  const x =
    Math.cos((current.latitude * Math.PI) / 180) * Math.sin((dest.latitude * Math.PI) / 180) -
    Math.sin((current.latitude * Math.PI) / 180) * Math.cos((dest.latitude * Math.PI) / 180) * Math.cos(dLon);
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  // Calculate turn direction based on bearing difference
  const headingDiff = (bearing - current.heading + 360) % 360;
  let direction = '↑'; // straight
  let directionName = 'Continue';

  if (headingDiff > 10 && headingDiff < 90) {
    direction = '↗';
    directionName = 'Turn Right';
  } else if (headingDiff > 90 && headingDiff < 180) {
    direction = '→';
    directionName = 'Turn Sharp Right';
  } else if (headingDiff > 180 && headingDiff < 270) {
    direction = '↙';
    directionName = 'Turn Left';
  } else if (headingDiff > 270) {
    direction = '←';
    directionName = 'Turn Sharp Left';
  }

  // Calculate distance to next turn (simplified)
  const distToTurn = Math.max(50, gpsNavigationState.routeData.remainingDistance * 0.2 * 1000); // in meters

  gpsNavigationState.nextTurnDirection = direction;
  gpsNavigationState.nextTurnDistance = distToTurn;
  gpsNavigationState.nextTurnStreet = dest.address || dest.name;
}

/**
 * Update Navigation UI
 */
function updateNavigationUI() {
  const loc = gpsNavigationState.currentLocation;
  const dest = gpsNavigationState.destination;
  const route = gpsNavigationState.routeData;
  const arrival = gpsNavigationState.arrival;

  // Current location
  if (gpsElements.currentLatitude) gpsElements.currentLatitude.textContent = loc.latitude.toFixed(4) + '°';
  if (gpsElements.currentLongitude) gpsElements.currentLongitude.textContent = loc.longitude.toFixed(4) + '°';
  if (gpsElements.currentAccuracy) gpsElements.currentAccuracy.textContent = loc.accuracy.toFixed(0) + ' m';
  if (gpsElements.currentSpeed) gpsElements.currentSpeed.textContent = loc.speed.toFixed(1) + ' km/h';
  if (gpsElements.currentHeading) {
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    const idx = Math.round(loc.heading / 45) % 8;
    gpsElements.currentHeading.textContent = directions[idx] + ' ' + loc.heading.toFixed(0) + '°';
  }

  // Destination
  if (gpsElements.destinationName) gpsElements.destinationName.textContent = dest.name || 'Select Destination';
  if (gpsElements.destinationDistance)
    gpsElements.destinationDistance.textContent = route.remainingDistance.toFixed(1) + ' km';
  if (gpsElements.destinationDuration)
    gpsElements.destinationDuration.textContent = route.remainingDuration.toFixed(0) + ' min';
  if (gpsElements.destinationEta && arrival.eta) {
    const hours = arrival.eta.getHours() % 12 || 12;
    const mins = String(arrival.eta.getMinutes()).padStart(2, '0');
    const suffix = arrival.eta.getHours() >= 12 ? 'PM' : 'AM';
    gpsElements.destinationEta.textContent = `${hours}:${mins} ${suffix}`;
  }

  // Next turn
  if (gpsElements.nextTurnDirection) gpsElements.nextTurnDirection.textContent = gpsNavigationState.nextTurnDirection;
  if (gpsElements.nextTurnDistance)
    gpsElements.nextTurnDistance.textContent = gpsNavigationState.nextTurnDistance.toFixed(0) + ' m';
  if (gpsElements.nextTurnStreet) gpsElements.nextTurnStreet.textContent = gpsNavigationState.nextTurnStreet;
}

/**
 * Check Speed and Route Alerts
 */
function checkAlerts() {
  if (!gpsNavigationState.navigationActive) return;

  const speed = gpsNavigationState.currentLocation.speed;
  const speedLimit = appState?.speedLimit || 80;

  // Speed alert
  gpsNavigationState.speedAlert = speed > speedLimit;
  if (gpsElements.speedAlertBanner) {
    gpsElements.speedAlertBanner.style.display = gpsNavigationState.speedAlert ? 'block' : 'none';
  }

  // Off-route alert (check distance from nearest waypoint)
  if (gpsNavigationState.routeData.waypoints.length > 0) {
    const current = gpsNavigationState.currentLocation;
    const wp = gpsNavigationState.routeData.waypoints[gpsNavigationState.routeData.currentWaypoint];
    const R = 6371000; // Earth radius in meters
    const dLat = ((wp.latitude - current.latitude) * Math.PI) / 180;
    const dLon = ((wp.longitude - current.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((current.latitude * Math.PI) / 180) *
        Math.cos((wp.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    gpsNavigationState.offRouteAlert = distance > gpsNavigationState.offRouteThreshold;
    if (gpsElements.offRouteAlertBanner) {
      gpsElements.offRouteAlertBanner.style.display = gpsNavigationState.offRouteAlert ? 'block' : 'none';
    }
  }
}

/**
 * Draw Route Map on Canvas
 */
function drawRouteMap() {
  const canvas = gpsElements.routeMapCanvas;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.fillStyle = '#08121e';
  ctx.fillRect(0, 0, width, height);

  // Draw border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  const current = gpsNavigationState.currentLocation;
  const dest = gpsNavigationState.destination;
  const waypoints = gpsNavigationState.routeData.waypoints;

  if (!waypoints.length) return;

  // Calculate bounds
  let minLat = current.latitude,
    maxLat = current.latitude;
  let minLng = current.longitude,
    maxLng = current.longitude;
  waypoints.forEach((wp) => {
    minLat = Math.min(minLat, wp.latitude);
    maxLat = Math.max(maxLat, wp.latitude);
    minLng = Math.min(minLng, wp.longitude);
    maxLng = Math.max(maxLng, wp.longitude);
  });

  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;
  const padding = 20;

  // Convert lat/lng to canvas coordinates
  const toCanvasX = (lng) => padding + ((lng - minLng) / lngRange) * (width - 2 * padding);
  const toCanvasY = (lat) => height - padding - ((lat - minLat) / latRange) * (height - 2 * padding);

  // Draw route line
  ctx.strokeStyle = '#3cd1ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  waypoints.forEach((wp, idx) => {
    const x = toCanvasX(wp.longitude);
    const y = toCanvasY(wp.latitude);
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // Draw waypoints
  waypoints.forEach((wp, idx) => {
    const x = toCanvasX(wp.longitude);
    const y = toCanvasY(wp.latitude);
    ctx.fillStyle = idx === 0 ? '#72ffb7' : idx === waypoints.length - 1 ? '#ff5a5a' : '#3cd1ff';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw current position
  const currentX = toCanvasX(current.longitude);
  const currentY = toCanvasY(current.latitude);
  ctx.fillStyle = '#72ffb7';
  ctx.beginPath();
  ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(114, 255, 183, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
  ctx.stroke();

  // Draw destination
  const destX = toCanvasX(dest.longitude);
  const destY = toCanvasY(dest.latitude);
  ctx.fillStyle = '#ff5a5a';
  ctx.beginPath();
  ctx.arc(destX, destY, 6, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Recenter Map on Current Location
 */
function recenterMap() {
  drawRouteMap();
}

/**
 * Set Quick Destination
 */
function setQuickDestination(destType) {
  const destinations = {
    home: { latitude: 28.5355, longitude: 77.3910, name: '🏠 Home', address: 'Your Home Address' },
    work: { latitude: 28.4089, longitude: 77.3178, name: '💼 Work', address: 'Your Work Address' },
    airport: { latitude: 28.5562, longitude: 77.1000, name: '✈️ Airport', address: 'Delhi Airport' },
  };

  const dest = destinations[destType];
  if (dest) {
    gpsNavigationState.destination = { ...dest };
    updateNavigationUI();
    drawRouteMap();
  }
}

/**
 * Clear Destination
 */
function clearDestination() {
  gpsNavigationState.destination = { latitude: 0, longitude: 0, name: 'Select Destination' };
  stopNavigation();
  updateNavigationUI();
}

/**
 * Toggle Mock Location for Testing
 */
let mockLocationInterval;
function toggleMockLocation() {
  if (mockLocationInterval) {
    clearInterval(mockLocationInterval);
    mockLocationInterval = null;
    gpsElements.mockLocationBtn.textContent = '🎮 Simulate Drive';
    return;
  }

  gpsElements.mockLocationBtn.textContent = '⏹ Stop Simulation';
  let progress = 0;
  const startLat = gpsNavigationState.currentLocation.latitude;
  const startLng = gpsNavigationState.currentLocation.longitude;
  const destLat = gpsNavigationState.destination.latitude || 28.5244;
  const destLng = gpsNavigationState.destination.longitude || 77.1855;

  mockLocationInterval = setInterval(() => {
    progress += 0.01;
    if (progress > 1) {
      progress = 1;
      clearInterval(mockLocationInterval);
      mockLocationInterval = null;
      gpsElements.mockLocationBtn.textContent = '🎮 Simulate Drive';
      return;
    }

    gpsNavigationState.currentLocation.latitude = startLat + (destLat - startLat) * progress;
    gpsNavigationState.currentLocation.longitude = startLng + (destLng - startLng) * progress;
    gpsNavigationState.currentLocation.speed = 60 + Math.random() * 20;
    gpsNavigationState.currentLocation.heading = Math.atan2(
      destLng - startLng,
      destLat - startLat
    ) * (180 / Math.PI);

    updateNavigationUI();
    updateRouteMetrics();
    checkAlerts();
    drawRouteMap();
  }, 500);
}

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeGpsNavigation, 500);
});
