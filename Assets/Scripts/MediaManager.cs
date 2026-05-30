using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace BMW.SmartDrive
{
    [System.Serializable]
    public class MediaTrack
    {
        public string title;
        public string subtitle;
        public float durationSeconds;
    }

    public class MediaManager : MonoBehaviour
    {
        public Text trackTitleText;
        public Text trackSubtitleText;
        public Text mediaPositionText;
        public Text mediaDurationText;
        public Slider mediaProgressSlider;
        public Button playPauseButton;
        public Button prevTrackButton;
        public Button nextTrackButton;

        public List<MediaTrack> playlist = new List<MediaTrack>();

        private int currentTrackIndex;
        private float currentPosition;
        private bool isPlaying = true;

        private void Start()
        {
            if (playlist.Count == 0)
            {
                playlist.Add(new MediaTrack { title = "Dream Ahead", subtitle = "BMW Sounds · Electric Collection", durationSeconds = 225 });
                playlist.Add(new MediaTrack { title = "City Nights", subtitle = "Autobahn Audio", durationSeconds = 198 });
            }

            currentTrackIndex = 0;
            currentPosition = 0f;
            AttachButtons();
            RefreshPlayerUI();
        }

        private void AttachButtons()
        {
            if (playPauseButton != null) playPauseButton.onClick.AddListener(TogglePlay);
            if (prevTrackButton != null) prevTrackButton.onClick.AddListener(() => ChangeTrack(-1));
            if (nextTrackButton != null) nextTrackButton.onClick.AddListener(() => ChangeTrack(1));
        }

        private void Update()
        {
            if (!isPlaying || playlist.Count == 0) return;

            currentPosition += Time.deltaTime;
            if (currentPosition >= playlist[currentTrackIndex].durationSeconds)
            {
                ChangeTrack(1);
            }
            else
            {
                RefreshPositionUI();
            }
        }

        private void TogglePlay()
        {
            isPlaying = !isPlaying;
            RefreshPlayerUI();
        }

        private void ChangeTrack(int direction)
        {
            currentTrackIndex = (currentTrackIndex + direction + playlist.Count) % playlist.Count;
            currentPosition = 0f;
            RefreshPlayerUI();
        }

        private void RefreshPlayerUI()
        {
            if (playlist.Count == 0) return;

            var track = playlist[currentTrackIndex];
            if (trackTitleText != null) trackTitleText.text = track.title;
            if (trackSubtitleText != null) trackSubtitleText.text = track.subtitle;
            if (mediaDurationText != null) mediaDurationText.text = FormatTime(track.durationSeconds);
            if (playPauseButton != null) playPauseButton.GetComponentInChildren<Text>().text = isPlaying ? "⏸" : "▶";
            RefreshPositionUI();
        }

        private void RefreshPositionUI()
        {
            if (playlist.Count == 0) return;

            var track = playlist[currentTrackIndex];
            if (mediaPositionText != null) mediaPositionText.text = FormatTime(currentPosition);
            if (mediaProgressSlider != null) mediaProgressSlider.value = currentPosition / track.durationSeconds;
        }

        private string FormatTime(float seconds)
        {
            var minutes = Mathf.FloorToInt(seconds / 60f);
            var remaining = Mathf.FloorToInt(seconds % 60f);
            return $"{minutes:00}:{remaining:00}";
        }
    }
}
