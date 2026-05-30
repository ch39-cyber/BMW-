# BMW SmartDrive Unity Cockpit Prototype

This repository now includes a Unity prototype scaffold for the BMW SmartDrive cockpit simulator.

## What is included

- `Assets/Scripts/CockpitManager.cs` — main simulation logic for UI-driven cockpit features
- `Packages/manifest.json` — minimal Unity package manifest for project compatibility

## Setup Instructions

1. Open Unity Hub and create a new 3D project in the repository root.
2. Confirm that the folder structure contains `Assets/` and `Packages/`.
3. Open the `Assets` folder in the Unity Editor.
4. Create a new Canvas and UI layout that matches the cockpit design.
5. Add a new empty GameObject named `CockpitManager` and attach `CockpitManager.cs`.
6. Optionally create additional manager GameObjects for modular control:
   - `DrivingAssistantManager` for assistance toggles and status
   - `NavigationManager` for route guidance, ETA, and speed limits
   - `MediaManager` for playlist playback and audio progress
   - `VehicleControlsManager` for lock, lights, trunk, climate, seats, camera, and settings
7. Assign all UI references in the inspector:
   - text fields for fuel, battery, engine, tire, route, navigation, media, instrument cluster, and driver monitor
   - sliders for progress bars and gauges
   - buttons for assist toggles, media controls, and vehicle controls
8. Add route segments and playlist items using the serialized fields in the inspector.
8. Play the scene to simulate driving assistant behavior, navigation updates, media playback, and vehicle controls.

## Recommended Unity Version

Use Unity 2021.3 LTS or newer. This prototype uses built-in UI components from `UnityEngine.UI`.

## Next steps

- Build a 3D cockpit environment using `Canvas` and `RawImage` textures
- Add camera transitions and interactive 3D steering wheel / dashboard elements
- Add backend data feeds for real-time telemetry and navigation
