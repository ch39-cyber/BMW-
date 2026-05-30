using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace BMW.SmartDrive
{
    [System.Serializable]
    public class RouteStep
    {
        public float distanceKm;
        public string instruction;
        public string destination;
    }

    public class NavigationManager : MonoBehaviour
    {
        public Text routeDistanceText;
        public Text routeInstructionText;
        public Text routeDestinationText;
        public Text etaText;
        public Text travelTimeText;
        public Text routeLengthText;
        public Text speedLimitText;

        [Header("Route Configuration")]
        public float speedLimit = 80f;
        public List<RouteStep> routeSteps = new List<RouteStep>();

        private int currentStepIndex;
        private float remainingDistance;
        private float remainingMinutes;

        private void Start()
        {
            if (routeSteps.Count == 0)
            {
                routeSteps.Add(new RouteStep { distanceKm = 2.4f, instruction = "Turn Right", destination = "City Center" });
                routeSteps.Add(new RouteStep { distanceKm = 1.2f, instruction = "Keep Left", destination = "City Bridge" });
                routeSteps.Add(new RouteStep { distanceKm = 0.4f, instruction = "Prepare to Arrive", destination = "Destination" });
            }

            currentStepIndex = 0;
            remainingDistance = routeSteps[0].distanceKm;
            remainingMinutes = remainingDistance * 5f;
            RefreshNavigationUI();
        }

        public void UpdateRoute(float currentSpeedKmH)
        {
            var distanceDelta = currentSpeedKmH * Time.deltaTime / 3600f;
            remainingDistance = Mathf.Max(0.0f, remainingDistance - distanceDelta);
            remainingMinutes = Mathf.Max(1f, remainingDistance * 5f);

            if (remainingDistance <= 0.5f && currentStepIndex < routeSteps.Count - 1)
            {
                currentStepIndex++;
                remainingDistance = routeSteps[currentStepIndex].distanceKm;
            }

            RefreshNavigationUI();
        }

        private void RefreshNavigationUI()
        {
            var step = routeSteps[Mathf.Clamp(currentStepIndex, 0, routeSteps.Count - 1)];
            if (routeDistanceText != null) routeDistanceText.text = $"{remainingDistance:F1} km";
            if (routeInstructionText != null) routeInstructionText.text = step.instruction;
            if (routeDestinationText != null) routeDestinationText.text = step.destination;
            if (travelTimeText != null) travelTimeText.text = $"{remainingMinutes:F0} min";
            if (routeLengthText != null) routeLengthText.text = $"{remainingDistance:F1} km";
            if (speedLimitText != null) speedLimitText.text = $"{speedLimit:F0}";
            if (etaText != null) etaText.text = System.DateTime.Now.AddMinutes(remainingMinutes).ToString("hh:mm tt");
        }
    }
}
