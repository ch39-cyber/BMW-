using UnityEngine;
using UnityEngine.UI;

namespace BMW.SmartDrive
{
    [System.Serializable]
    public class AssistOption
    {
        public string name;
        public Button button;
        public Text statusText;
        public bool isActive;
    }

    public class DrivingAssistantManager : MonoBehaviour
    {
        public AssistOption laneAssist;
        public AssistOption adaptiveCruise;
        public AssistOption collisionWarning;
        public AssistOption blindSpotMonitor;

        private void Start()
        {
            InitializeAssist(laneAssist, true);
            InitializeAssist(adaptiveCruise, true);
            InitializeAssist(collisionWarning, true);
            InitializeAssist(blindSpotMonitor, true);

            AttachButton(laneAssist, ToggleAssist);
            AttachButton(adaptiveCruise, ToggleAssist);
            AttachButton(collisionWarning, ToggleAssist);
            AttachButton(blindSpotMonitor, ToggleAssist);
        }

        private void InitializeAssist(AssistOption option, bool defaultState)
        {
            option.isActive = defaultState;
            RefreshOptionUI(option);
        }

        private void AttachButton(AssistOption option, System.Action<AssistOption> callback)
        {
            if (option.button != null)
            {
                option.button.onClick.AddListener(() => callback(option));
            }
        }

        private void ToggleAssist(AssistOption option)
        {
            option.isActive = !option.isActive;
            RefreshOptionUI(option);
        }

        private void RefreshOptionUI(AssistOption option)
        {
            if (option.statusText != null)
            {
                option.statusText.text = option.isActive ? "ON" : "OFF";
            }

            if (option.button != null)
            {
                option.button.image.color = option.isActive ? new Color(0.22f, 0.78f, 0.72f) : new Color(0.16f, 0.18f, 0.22f);
            }
        }
    }
}
