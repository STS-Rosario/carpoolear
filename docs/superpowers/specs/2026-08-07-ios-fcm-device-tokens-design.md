# iOS FCM device tokens — Design

**Date:** 2026-08-07  
**Status:** Approved  
**Repo:** `carpoolear/` (legacy frontend / Capacitor app)

## Problem

Backend iOS push (`PushChannel::sendIOS`) sends through Firebase/FCM since commit `50223f82` (2026-07-03). The iOS app still uploads native APNs device tokens (typically 64-char hex) via `@capacitor/push-notifications` `registration` → `POST /devices` as `device_id`. FCM rejects those tokens and devices are deactivated. Android/web already send FCM tokens.

## Goal

On iOS, register and persist **FCM registration tokens** as `device_id`, matching Android/web. Ship a new iOS build; no backend compatibility bridge for APNs-shaped tokens.

## Approach (chosen)

Add `@capacitor-firebase/messaging` for FCM token access on iOS. Keep `@capacitor/push-notifications` for permission, display, and tap handling on native platforms.

### Alternatives considered

| Option | Notes |
|--------|--------|
| Firebase Messaging via AppDelegate + custom bridge | Fewer npm deps; more native glue and Cap sync risk |
| Replace push plugin entirely with `@capacitor-firebase/messaging` | Larger Android churn; Android already works |

## Design

### Native iOS setup

1. Depend on `@capacitor-firebase/messaging` (version compatible with Capacitor 7).
2. Ensure Firebase is configured at launch (`FirebaseApp.configure()`), using existing `GoogleService-Info.plist`.
3. After APNs registration, Firebase Messaging must receive the APNs token (plugin/SDK handles this when Firebase is configured; verify against plugin docs during implementation).
4. Firebase Console must already (or will) have an APNs auth key/cert for the iOS app — required for FCM→APNs delivery; out of app-code scope but required for success in production.

### JS push init (`src/cordova/push-capacitor.js`)

1. **Web:** unchanged (Firebase JS `getToken`).
2. **Android:** unchanged — Capacitor PushNotifications `registration` token → `setDeviceId` → `deviceStore.register()`.
3. **iOS:**
   - Still use PushNotifications for `requestPermissions` / `register` and for received/tap listeners.
   - Do **not** use the PushNotifications `registration` token as `device_id`.
   - Obtain FCM token via `@capacitor-firebase/messaging` (`getToken` and/or token-received listener).
   - Call `setDeviceId(fcmToken)` and `deviceStore.register()`.
   - On FCM token refresh, update device id and re-register.

### Backend

No changes. Device API remains a blind store of `device_id`. Send path stays FCM for iOS.

### Out of scope

- APNs fallback / dual send path in `PushChannel`
- Rejecting non-FCM iOS tokens on register
- Removing dead `sendAPNsNotification`
- Changing DeviceManager validation

## Success criteria

- After installing a build with this change, an iOS device row stores an FCM-shaped token (not 64-hex APNs).
- Opening the app overwrites previous APNs rows for that session/device with the FCM token when registration succeeds.
- Android and web push registration behavior unchanged.
- Unit tests cover the iOS vs Android token-selection branching in the push init module (source/contract tests consistent with existing project patterns).

## Risks / notes

- Pod install / `npx cap sync ios` required after adding the plugin.
- If Firebase is not configured on iOS, FCM token fetch will fail — enable configure as part of this work.
- Production push still depends on Firebase Console APNs credentials for the iOS app.
