# Optional GPS + Live Location Capability Gate

**Date:** 2026-11-19  
**Branch:** `fix/optional-gps-live-location` in `carpoolear/`  
**Out of scope:** `carpoolear-nx/`, backend changes, iOS marketing/build version bump, gating live-location **view** screens, changing location permission copy, automatic suspension or Play Console “Proceed anyway”

## Goal

Make GPS a non-required Android hardware feature so Play can distribute the app to devices without GPS, and hide share / “needs your GPS” live-location UI when the device lacks GPS. Viewing someone else’s shared map stays available. Ship with Android version `4.0.36` / `4003600` for resubmit.

## Decisions

| Topic | Choice |
| --- | --- |
| Play fix | Mark `android.hardware.location.gps` as `required="false"` with `tools:replace="android:required"` so plugin manifests cannot force required |
| Scope of UI gate | Share entry points + share screen start controls (option B); not view maps |
| Platforms | All platforms (option C): web / Android / iOS |
| No-GPS on share route | Stay on page; hide start controls; show “No disponible en este dispositivo por falta de GPS” (option A) |
| Android detection | `PackageManager.FEATURE_LOCATION_GPS` via tiny app Capacitor plugin (`DeviceGps.hasGps()`) |
| Web detection | `'geolocation' in navigator` |
| iOS detection | Always `true` for this change (no Play feature filter; iPhones in scope) |
| Caching | In-memory session cache for the capability result |
| Version | `versionCode 4003600`, `versionName "4.0.36"` (past Play upload `4.0.35` / `4003500`) |
| Delivery | Frontend-only PR; TDD red/green/refactor commits |

## Architecture

### Android packaging

In `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-feature
    android:name="android.hardware.location.gps"
    android:required="false"
    tools:replace="android:required" />
```

Ensure the `tools` namespace is declared on `<manifest>`. This overrides `@capacitor-community/background-geolocation`’s default-required GPS feature in the merged AAB.

Bump `android/app/build.gradle` `defaultConfig` to `4003600` / `4.0.36`.

### Capability util (`src/utils/deviceGps.js`)

- `deviceHasGpsCapability(deps?)` → `Promise<boolean>`
- Injectable deps for tests: platform getter, web geolocation probe, Android native `hasGps`, cache store
- Defaults: Capacitor platform; web probe; Capacitor `registerPlugin('DeviceGps')`; module-level cache
- Clears only on full reload (no explicit invalidate API in v1)

### Native Android plugin

Minimal Capacitor plugin in the app module (Java) exposing `hasGps()` → `PackageManager.hasSystemFeature(FEATURE_LOCATION_GPS)`. Register from `MainActivity` / Capacitor plugin list as required by Capacitor 7 app plugins.

### UI composition

Existing trip-window / participant rules stay in `shouldShowLiveLocationShare(trip, userId, now)`.

Call sites that start sharing must also require GPS:

- `TripButtons.showLiveLocationShare`
- `OngoingTripCard.showShareLocationLink`

`LiveLocationShare.vue` (`/trips/:id/live`):

- On mount (or when capability resolves false): do not show start-sharing button/controls
- Show i18n string key (e.g. `liveLocationGpsUnavailable`) with Spanish copy: `No disponible en este dispositivo por falta de GPS`
- Active share stop/copy UI: only relevant when already sharing; without GPS we still hide **start**; if an active share somehow loads, stop/copy may remain (edge case); primary requirement is unavailable message + no start

Unchanged: `LiveLocationPublic`, `LiveLocationTrip`, public map viewing.

## Data flow

```text
App load / first share UI check
  → deviceHasGpsCapability()
      web: geolocation in navigator
      android: DeviceGps.hasGps() → FEATURE_LOCATION_GPS
      ios: true
  → cache boolean
  → TripButtons / OngoingTripCard: shouldShowLiveLocationShare && hasGps
  → LiveLocationShare: if !hasGps → message, no start controls
```

## Testing (TDD)

1. `deviceGps.test.js` — web true/false, Android probe true/false, iOS true, cache hit
2. Helper or call-site tests — share visibility false when GPS false even if trip window allows share
3. View/source tests — TripButtons, OngoingTripCard, LiveLocationShare wire GPS gate + unavailable key
4. Manifest source assertion — `required="false"` and `tools:replace` present for GPS feature
5. Version numbers present in `build.gradle` as part of the version bump change

## Success criteria

- Merged release AAB does not require `android.hardware.location.gps` (Play hardware-feature warning cleared for this cause)
- Devices without GPS can install; share live-location controls are hidden; share page shows the Spanish unavailable copy
- Devices with GPS behave as today for share and view
- Android build identity is `4.0.36` / `4003600`
