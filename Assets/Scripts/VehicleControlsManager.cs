using UnityEngine;
using UnityEngine.UI;

namespace BMW.SmartDrive
{
    public class VehicleControlsManager : MonoBehaviour
    {
        public Button lockButton;
        public Button unlockButton;
        public Button lightsButton;
        public Button trunkButton;
        public Button climateButton;
        public Button seatsButton;
        public Button cameraButton;
        public Button settingsButton;
        public Text lockStatusText;
        public Text lightsStatusText;
        public Text trunkStatusText;
        public Text climateStatusText;
        public Text seatsStatusText;
        public Text cameraStatusText;
        public Text settingsStatusText;

        private bool isLocked = true;
        private bool lightsOn = false;
        private bool trunkOpen = false;
        private bool climateOn = true;
        private bool seatsAdjusted = false;
        private bool cameraActive = false;
        private bool settingsOpen = false;

        private void Start()
        {
            if (lockButton != null) lockButton.onClick.AddListener(() => SetLocked(true));
            if (unlockButton != null) unlockButton.onClick.AddListener(() => SetLocked(false));
            if (lightsButton != null) lightsButton.onClick.AddListener(ToggleLights);
            if (trunkButton != null) trunkButton.onClick.AddListener(ToggleTrunk);
            if (climateButton != null) climateButton.onClick.AddListener(ToggleClimate);
            if (seatsButton != null) seatsButton.onClick.AddListener(ToggleSeats);
            if (cameraButton != null) cameraButton.onClick.AddListener(ToggleCamera);
            if (settingsButton != null) settingsButton.onClick.AddListener(ToggleSettings);
            RefreshControlUI();
        }

        public void SetLocked(bool locked)
        {
            isLocked = locked;
            RefreshControlUI();
        }

        public void ToggleLights()
        {
            lightsOn = !lightsOn;
            RefreshControlUI();
        }

        public void ToggleTrunk()
        {
            trunkOpen = !trunkOpen;
            RefreshControlUI();
        }

        public void ToggleClimate()
        {
            climateOn = !climateOn;
            RefreshControlUI();
        }

        public void ToggleSeats()
        {
            seatsAdjusted = !seatsAdjusted;
            RefreshControlUI();
        }

        public void ToggleCamera()
        {
            cameraActive = !cameraActive;
            RefreshControlUI();
        }

        public void ToggleSettings()
        {
            settingsOpen = !settingsOpen;
            RefreshControlUI();
        }

        private void RefreshControlUI()
        {
            if (lockStatusText != null) lockStatusText.text = isLocked ? "Locked" : "Unlocked";
            if (lightsStatusText != null) lightsStatusText.text = lightsOn ? "On" : "Off";
            if (trunkStatusText != null) trunkStatusText.text = trunkOpen ? "Open" : "Closed";
            if (climateStatusText != null) climateStatusText.text = climateOn ? "Active" : "Off";
            if (seatsStatusText != null) seatsStatusText.text = seatsAdjusted ? "Adjusted" : "Standard";
            if (cameraStatusText != null) cameraStatusText.text = cameraActive ? "On" : "Off";
            if (settingsStatusText != null) settingsStatusText.text = settingsOpen ? "Open" : "Closed";

            if (lockButton != null) lockButton.interactable = !isLocked;
            if (unlockButton != null) unlockButton.interactable = isLocked;
        }
    }
}
