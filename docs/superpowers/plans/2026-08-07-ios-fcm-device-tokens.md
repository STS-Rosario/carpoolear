# iOS FCM Device Tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On iOS, persist Firebase Cloud Messaging registration tokens as `device_id` so backend FCM send works; leave Android/web unchanged.

**Architecture:** Keep `@capacitor/push-notifications` for permission, APNs registration, and notification display/tap. Add `@capacitor-firebase/messaging` and, on iOS only, use its FCM `getToken` / `tokenReceived` as `device_id`. Enable `FirebaseApp.configure()` on iOS.

**Tech Stack:** Capacitor 7, `@capacitor-firebase/messaging` 7.x, `@capacitor/push-notifications`, Firebase iOS SDK via CocoaPods, Vitest source tests.

## Global Constraints

- No backend APNs compatibility bridge.
- Android continues to use Capacitor PushNotifications `registration` token.
- Web push unchanged (Firebase JS `getToken`).
- Do not POST APNs hex tokens from iOS as `device_id`.

---

### Task 1: Token selection helper + tests

**Files:**
- Create: `src/cordova/nativePushDeviceToken.js`
- Create: `src/cordova/nativePushDeviceToken.test.js`

**Interfaces:**
- Produces: `isIosNativePlatform(platform: string): boolean`
- Produces: `persistPushDeviceToken(token: string, deps: { setDeviceId: (t: string) => void, register: () => Promise<unknown> }): Promise<unknown>`

- [ ] **Step 1: Write failing tests**

```js
import { describe, expect, it, vi } from 'vitest';
import {
    isIosNativePlatform,
    persistPushDeviceToken
} from './nativePushDeviceToken.js';

describe('isIosNativePlatform', () => {
    it('is true only for ios', () => {
        expect(isIosNativePlatform('ios')).toBe(true);
        expect(isIosNativePlatform('android')).toBe(false);
        expect(isIosNativePlatform('web')).toBe(false);
    });
});

describe('persistPushDeviceToken', () => {
    it('sets device id then registers', async () => {
        const setDeviceId = vi.fn();
        const register = vi.fn().mockResolvedValue(undefined);
        await persistPushDeviceToken('fcm-token', { setDeviceId, register });
        expect(setDeviceId).toHaveBeenCalledWith('fcm-token');
        expect(register).toHaveBeenCalled();
    });

    it('no-ops when token is empty', async () => {
        const setDeviceId = vi.fn();
        const register = vi.fn();
        await persistPushDeviceToken('', { setDeviceId, register });
        expect(setDeviceId).not.toHaveBeenCalled();
        expect(register).not.toHaveBeenCalled();
    });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx vitest run src/cordova/nativePushDeviceToken.test.js`

- [ ] **Step 3: Implement helper**

```js
export function isIosNativePlatform(platform) {
    return platform === 'ios';
}

export async function persistPushDeviceToken(token, { setDeviceId, register }) {
    if (!token) {
        return;
    }
    setDeviceId(token);
    return register();
}
```

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit** `test:` then `feat:` for helper (or single `feat:` if combined with wiring in later task — prefer `test:` for test file first, `feat:` for helper)

---

### Task 2: Require iOS FCM path in push-capacitor source tests

**Files:**
- Modify: `src/cordova/push-capacitor.test.js`

- [ ] **Step 1: Add failing assertions** that `push-capacitor.js` imports/uses `FirebaseMessaging`, `isIosNativePlatform`, and on iOS does not persist `token.value` from PushNotifications `registration` without going through FCM.

```js
describe('push-capacitor.js native iOS FCM token', () => {
    it('uses Firebase Messaging for iOS device_id and keeps PushNotifications for Android', () => {
        expect(source).toContain('@capacitor-firebase/messaging');
        expect(source).toContain('FirebaseMessaging');
        expect(source).toContain('isIosNativePlatform');
        expect(source).toContain('persistPushDeviceToken');
        expect(source).toContain("getPlatform() === 'ios'") // or isIosNativePlatform(Capacitor.getPlatform())
        expect(source).toMatch(/tokenReceived/);
        expect(source).toMatch(/getToken/);
    });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Commit** `test: require iOS FCM token path in push-capacitor`

---

### Task 3: Install plugin + enable Firebase on iOS

**Files:**
- Modify: `package.json` / lockfile via npm install
- Modify: `ios/App/App/AppDelegate.swift` — uncomment/enable `FirebaseApp.configure()` and `import FirebaseCore`
- Modify: `ios/App/Podfile` if sync does not add messaging pod (verify after sync)

- [ ] **Step 1:** `npm install @capacitor-firebase/messaging@^7.3.0` (Capacitor 7 line)
- [ ] **Step 2:** Enable Firebase in AppDelegate:

```swift
import FirebaseCore
// in didFinishLaunching:
FirebaseApp.configure()
```

- [ ] **Step 3:** `npx cap sync ios` (may need network / pod install)
- [ ] **Step 4:** Commit `feat: add Firebase Messaging plugin and configure iOS Firebase`

---

### Task 4: Wire iOS FCM token in push-capacitor.js

**Files:**
- Modify: `src/cordova/push-capacitor.js`

- [ ] **Step 1: Implement** — in `initNativePush`:
  - Import helpers and dynamically import `FirebaseMessaging` when platform is iOS.
  - On Android `registration`: `persistPushDeviceToken(token.value, ...)`.
  - On iOS `registration`: do not persist APNs `token.value`; call `FirebaseMessaging.getToken()` and persist; also `addListener('tokenReceived', ...)`.
  - Keep existing received/tap PushNotifications listeners for both platforms.

- [ ] **Step 2: Run** `npx vitest run src/cordova/push-capacitor.test.js src/cordova/nativePushDeviceToken.test.js` — expect PASS

- [ ] **Step 3: Commit** `feat: register FCM tokens for iOS push devices`

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| `@capacitor-firebase/messaging` | 3 |
| `FirebaseApp.configure()` | 3 |
| iOS FCM as device_id | 4 |
| Android unchanged | 4 |
| Web unchanged | (no change) |
| Token refresh | 4 (`tokenReceived`) |
| Unit tests for branching | 1–2 |
| No backend changes | — |
