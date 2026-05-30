using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace BMW.SmartDrive
{
    [System.Serializable]
    public class AssistToggle
    {
        public string name;
        public Button button;
        public Text statusText;
        public bool enabledByDefault;
        [HideInInspector] public bool isActive;
    }

    [System.Serializable]
    public class RouteSegment
    {
        public float distance;
        public string instruction;
        public string destination;
    }

    [System.Serializable]
    public class MediaTrack
    {
        public string title;
        public string subtitle;
        public float durationSeconds;
    }

    public class CockpitManager : MonoBehaviour
    {
        [Header("Vehicle Status")]
        public Text fuelText;
        public Slider fuelSlider;
        public Text batteryText;
        public Slider batterySlider;
        public Text engineText;
        public Slider engineTempSlider;
        public Text tireText;
        public Slider tireSlider;
        public Text statusBannerText;
        public Image statusBannerBackground;

        [Header("Driving Assist")]
        public AssistToggle laneAssist;
        public AssistToggle adaptiveCruise;
        public AssistToggle collisionWarning;
        public AssistToggle blindSpotMonitor;

        [Header("Driver Monitor")]
        public Text attentionText;
        public Slider attentionGauge;
        public Text eyeStatusText;
        public Text faceDetectedText;

        [Header("Navigation")]
        public Text routeDistanceText;
        public Text routeInstructionText;
        public Text routeDestinationText;
        public Text etaText;
        public Text travelTimeText;
        public Text routeLengthText;
        public Text speedLimitText;
        public float speedLimit = 80f;

        [Header("Instrument Cluster")]
        public Text currentSpeedText;
        public Text currentGearText;
        public Text currentModeText;
        public Text clusterInfoText;

        [Header("Media")]
        public Text trackTitleText;
        public Text trackSubtitleText;
        public Text mediaPositionText;
        public Text mediaDurationText;
        public Slider mediaProgressSlider;
        public Button prevTrackButton;
        public Button playPauseButton;
        public Button nextTrackButton;

        [Header("Vehicle Controls")]
        public Button lockButton;
        public Button unlockButton;
        public Button lightsButton;
        public Button trunkButton;
        public Button climateButton;
        public Button seatsButton;
        public Button cameraButton;
        public Button settingsButton;
        public Text voiceCommandText;

        [Header("Route Simulation")]
        public List<RouteSegment> segments = new List<RouteSegment>();
        public List<MediaTrack> playlist = new List<MediaTrack>();

        private float fuelLevel = 68f;
        private float batteryLevel = 72f;
        private float engineTemp = 92f;
        private float tirePressure = 2.4f;
        private float attentionLevel = 85f;
        private float currentSpeed = 75f;
        private int currentGearIndex = 3;
        private string[] gearStates = { "P", "R", "N", "D" };
        private float mediaPosition = 85f;
        private int currentTrackIndex = 0;
        private bool isPlaying = true;
        private bool vehicleLocked = true;
        private bool lightsOn = false;
        private bool trunkOpen = false;
        private bool climateOn = true;
        private bool seatsAdjusted = false;
        private bool cameraActive = false;
        private bool settingsOpen = false;
        private float routeDistance = 2.4f;
        private int activeSegmentIndex = 0;
        private float routeEtaMinutes = 13f;

        private void Start()
        {
            InitializeAssists();
            InitializePlaylist();
            RefreshAllUI();
            AttachButtonHandlers();
            InvokeRepeating(nameof(SimulateDrive), 1f, 1f);
        }

        private void InitializeAssists()
        {
            laneAssist.isActive = laneAssist.enabledByDefault;
            adaptiveCruise.isActive = adaptiveCruise.enabledByDefault;
            collisionWarning.isActive = collisionWarning.enabledByDefault;
            blindSpotMonitor.isActive = blindSpotMonitor.enabledByDefault;
        }

        private void InitializePlaylist()
        {
            if (playlist.Count == 0)
            {
                playlist.Add(new MediaTrack { title = "Dream Ahead", subtitle = "BMW Sounds · Electric Collection", durationSeconds = 225 });
                playlist.Add(new MediaTrack { title = "City Nights", subtitle = "Autobahn Audio", durationSeconds = 198 });
                playlist.Add(new MediaTrack { title = "Energy Flow", subtitle = "Electric Pulse", durationSeconds = 210 });
            }
        }

        private void AttachButtonHandlers()
        {
            laneAssist.button.onClick.AddListener(() => ToggleAssist(laneAssist));
            adaptiveCruise.button.onClick.AddListener(() => ToggleAssist(adaptiveCruise));
            collisionWarning.button.onClick.AddListener(() => ToggleAssist(collisionWarning));
            blindSpotMonitor.button.onClick.AddListener(() => ToggleAssist(blindSpotMonitor));

            prevTrackButton.onClick.AddListener(() => ChangeTrack(-1));
            playPauseButton.onClick.AddListener(TogglePlayPause);
            nextTrackButton.onClick.AddListener(() => ChangeTrack(1));

            lockButton.onClick.AddListener(() => SetLocked(true));
            unlockButton.onClick.AddListener(() => SetLocked(false));
            lightsButton.onClick.AddListener(() => ToggleLights());
            trunkButton.onClick.AddListener(() => ToggleTrunk());
            climateButton.onClick.AddListener(() => ToggleClimate());
            seatsButton.onClick.AddListener(() => ToggleSeats());
            cameraButton.onClick.AddListener(() => ToggleCamera());
            settingsButton.onClick.AddListener(() => ToggleSettings());
        }

        private void ToggleAssist(AssistToggle assist)
        {
            assist.isActive = !assist.isActive;
            RefreshAssistUI(assist);
        }

        private void RefreshAllUI()
        {
            RefreshStatusUI();
            RefreshAssistUI(laneAssist);
            RefreshAssistUI(adaptiveCruise);
            RefreshAssistUI(collisionWarning);
            RefreshAssistUI(blindSpotMonitor);
            RefreshDriverMonitorUI();
            RefreshNavigationUI();
            RefreshClusterUI();
            RefreshMediaUI();
            RefreshControlUI();
        }

        private void RefreshStatusUI()
        {
            fuelText.text = $"{fuelLevel:F0}%";
            fuelSlider.value = fuelLevel;
            batteryText.text = $"{batteryLevel:F0}%";
            batterySlider.value = batteryLevel;
            engineText.text = $"{engineTemp:F0}°C";
            engineTempSlider.value = engineTemp;
            tireText.text = $"{tirePressure:F1} bar";
            tireSlider.value = tirePressure;

            statusBannerText.text = currentSpeed > speedLimit ? "Speed Limit Exceeded" : "All Systems Normal";
            statusBannerBackground.color = currentSpeed > speedLimit ? new Color(1f, 0.35f, 0.35f, 0.25f) : new Color(0.17f, 0.49f, 0.32f, 0.18f);
        }

        private void RefreshAssistUI(AssistToggle assist)
        {
            assist.statusText.text = assist.isActive ? "ON" : "OFF";
            assist.button.image.color = assist.isActive ? new Color(0.22f, 0.78f, 0.72f) : new Color(0.14f, 0.15f, 0.2f);
        }

        private void RefreshDriverMonitorUI()
        {
            attentionText.text = $"{attentionLevel:F0}%";
            attentionGauge.value = attentionLevel / 100f;
            eyeStatusText.text = attentionLevel < 55 ? "Closed" : "Open";
            faceDetectedText.text = attentionLevel < 40 ? "No" : "Yes";
        }

        private void RefreshNavigationUI()
        {
            var segment = segments[Mathf.Clamp(activeSegmentIndex, 0, segments.Count - 1)];
            routeDistanceText.text = $"{routeDistance:F1} km";
            routeInstructionText.text = segment.instruction;
            routeDestinationText.text = segment.destination;
            travelTimeText.text = $"{routeEtaMinutes:F0} min";
            etaText.text = System.DateTime.Now.AddMinutes(routeEtaMinutes).ToString("hh:mm tt");
            routeLengthText.text = $"{routeDistance:F1} km";
            speedLimitText.text = $"{speedLimit:F0}";
        }

        private void RefreshClusterUI()
        {
            currentSpeedText.text = $"{currentSpeed:F0}";
            currentGearText.text = gearStates[currentGearIndex];
            currentModeText.text = currentSpeed >= 90 ? "SPORT" : currentSpeed >= 60 ? "COMFORT" : "ECO";
            clusterInfoText.text = $"{System.DateTime.Now:hh:mm tt} · {12580:N0} km · +24°C";
        }

        private void RefreshMediaUI()
        {
            var track = playlist[currentTrackIndex];
            trackTitleText.text = track.title;
            trackSubtitleText.text = track.subtitle;
            mediaDurationText.text = FormatTime(track.durationSeconds);
            mediaPositionText.text = FormatTime(mediaPosition);
            mediaProgressSlider.value = mediaPosition / track.durationSeconds;
            playPauseButton.GetComponentInChildren<Text>().text = isPlaying ? "⏸" : "▶";
        }

        private void RefreshControlUI()
        {
            lockButton.GetComponentInChildren<Text>().text = vehicleLocked ? "Locked" : "Lock";
            unlockButton.GetComponentInChildren<Text>().text = vehicleLocked ? "Unlock" : "Unlocked";
            lightsButton.image.color = lightsOn ? new Color(0.22f, 0.78f, 0.72f) : Color.white;
            trunkButton.image.color = trunkOpen ? new Color(0.22f, 0.78f, 0.72f) : Color.white;
            climateButton.image.color = climateOn ? new Color(0.22f, 0.78f, 0.72f) : Color.white;
            seatsButton.image.color = seatsAdjusted ? new Color(0.22f, 0.78f, 0.72f) : Color.white;
            cameraButton.image.color = cameraActive ? new Color(0.22f, 0.78f, 0.72f) : Color.white;
            settingsButton.image.color = settingsOpen ? new Color(0.22f, 0.78f, 0.72f) : Color.white;
            voiceCommandText.text = $"Hey BMW, status {currentSpeed:F0} km/h";
        }

        private void SimulateDrive()
        {
            if (currentSpeed > 0 && routeDistance > 0.2f)
            {
                routeDistance = Mathf.Max(0.2f, routeDistance - currentSpeed * 0.005f);
                routeEtaMinutes = Mathf.Max(1f, routeDistance * 5f);
                attentionLevel = Mathf.Clamp(attentionLevel - (currentSpeed > speedLimit ? 1.5f : 0.2f), 30f, 100f);
                mediaPosition += isPlaying ? 1f : 0f;
                if (mediaPosition >= playlist[currentTrackIndex].durationSeconds)
                {
                    ChangeTrack(1);
                }
                if (routeDistance <= 0.6f && activeSegmentIndex < segments.Count - 1)
                {
                    activeSegmentIndex++;
                }
                RefreshAllUI();
            }
        }

        private void ChangeTrack(int direction)
        {
            currentTrackIndex = (currentTrackIndex + direction + playlist.Count) % playlist.Count;
            mediaPosition = 0f;
            RefreshMediaUI();
        }

        private void TogglePlayPause()
        {
            isPlaying = !isPlaying;
            RefreshMediaUI();
        }

        private void SetLocked(bool locked)
        {
            vehicleLocked = locked;
            RefreshControlUI();
        }

        private void ToggleLights()
        {
            lightsOn = !lightsOn;
            RefreshControlUI();
        }

        private void ToggleTrunk()
        {
            trunkOpen = !trunkOpen;
            RefreshControlUI();
        }

        private void ToggleClimate()
        {
            climateOn = !climateOn;
            RefreshControlUI();
        }

        private void ToggleSeats()
        {
            seatsAdjusted = !seatsAdjusted;
            RefreshControlUI();
        }

        private void ToggleCamera()
        {
            cameraActive = !cameraActive;
            RefreshControlUI();
        }

        private void ToggleSettings()
        {
            settingsOpen = !settingsOpen;
            RefreshControlUI();
        }

        private string FormatTime(float seconds)
        {
            var minutes = Mathf.FloorToInt(seconds / 60f);
            var remaining = Mathf.FloorToInt(seconds % 60f);
            return $"{minutes:00}:{remaining:00}";
        }
    }
}
