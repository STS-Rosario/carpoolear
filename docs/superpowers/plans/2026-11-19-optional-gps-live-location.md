# Optional GPS + Live Location Capability Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mark Android GPS hardware optional for Play distribution, detect GPS capability on all platforms, hide live-location share UI when missing, bump Android to 4.0.36 / 4003600.

**Architecture:** Tiny Capacitor `DeviceGps` plugin on Android for `FEATURE_LOCATION_GPS`; JS `deviceHasGpsCapability()` with session cache; gate TripButtons / OngoingTripCard / LiveLocationShare start UI; force-merged manifest `required="false"`.

**Tech Stack:** Vue 2 Options API, Vitest, Capacitor 7, Android Java plugin, i18n.js

## Global Constraints

- Spanish unavailable copy exactly: `No disponible en este dispositivo por falta de GPS`
- Android version: `versionCode 4003600`, `versionName "4.0.36"`
- Manifest: `android.hardware.location.gps` + `android:required="false"` + `tools:replace="android:required"`
- Do not gate LiveLocationPublic / LiveLocationTrip view screens
- TDD: test(web)/feat(web) commits; config-only steps may be feat(web) after a source assertion test
- Prefer `carpoolear/` only (not carpoolear-nx)

## File map

| File | Responsibility |
| --- | --- |
| `src/utils/deviceGps.js` | Capability detection + cache |
| `src/utils/deviceGps.test.js` | Unit tests |
| `src/utils/ongoingTrip.js` | Optional `shouldShowLiveLocationShareWithGps` helper |
| `android/.../DeviceGpsPlugin.java` | Native FEATURE_LOCATION_GPS |
| `android/.../MainActivity.java` | `registerPlugin(DeviceGpsPlugin.class)` |
| `android/.../AndroidManifest.xml` | Optional GPS + tools:replace |
| `android/app/build.gradle` | Version bump |
| `TripButtons.vue` / `OngoingTripCard.vue` | Gate share buttons |
| `LiveLocationShare.vue` | Unavailable message, hide start |
| `src/language/i18n.js` | `liveLocationGpsUnavailable` |

---

### Task 1: `deviceHasGpsCapability` util

**Files:**
- Create: `src/utils/deviceGps.js`
- Test: `src/utils/deviceGps.test.js`

**Interfaces:**
- Produces: `deviceHasGpsCapability(deps?: { getPlatform, hasWebGeolocation, hasAndroidGps, cache }) => Promise<boolean>`
- Produces: `clearDeviceGpsCapabilityCache()` for tests

- [ ] **Step 1: Write failing tests**

```js
import { describe, expect, it, beforeEach } from 'vitest';
import {
    clearDeviceGpsCapabilityCache,
    deviceHasGpsCapability
} from './deviceGps.js';

describe('deviceHasGpsCapability', () => {
    beforeEach(() => {
        clearDeviceGpsCapabilityCache();
    });

    it('returns true on web when geolocation exists', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'web',
                hasWebGeolocation: () => true
            })
        ).resolves.toBe(true);
    });

    it('returns false on web when geolocation missing', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'web',
                hasWebGeolocation: () => false
            })
        ).resolves.toBe(false);
    });

    it('uses Android native probe', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'android',
                hasAndroidGps: async () => false
            })
        ).resolves.toBe(false);
    });

    it('returns true on ios', async () => {
        await expect(
            deviceHasGpsCapability({
                getPlatform: () => 'ios'
            })
        ).resolves.toBe(true);
    });

    it('caches the first resolved value', async () => {
        let calls = 0;
        const hasWebGeolocation = () => {
            calls += 1;
            return true;
        };
        await deviceHasGpsCapability({
            getPlatform: () => 'web',
            hasWebGeolocation
        });
        await deviceHasGpsCapability({
            getPlatform: () => 'web',
            hasWebGeolocation
        });
        expect(calls).toBe(1);
    });
});
```

- [ ] **Step 2: Run tests — expect FAIL** (module missing)

Run: `npx vitest run src/utils/deviceGps.test.js`

- [ ] **Step 3: Implement**

```js
import { Capacitor, registerPlugin } from '@capacitor/core';

let cached = undefined;
let DeviceGps = null;

function loadDeviceGps() {
    if (!DeviceGps) {
        DeviceGps = registerPlugin('DeviceGps');
    }
    return DeviceGps;
}

export function clearDeviceGpsCapabilityCache() {
    cached = undefined;
}

function defaultHasWebGeolocation() {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

async function defaultHasAndroidGps() {
    const plugin = loadDeviceGps();
    const result = await plugin.hasGps();
    return Boolean(result && result.value);
}

export async function deviceHasGpsCapability(deps = {}) {
    if (cached !== undefined) {
        return cached;
    }
    const getPlatform = deps.getPlatform || (() => Capacitor.getPlatform());
    const hasWebGeolocation =
        deps.hasWebGeolocation || defaultHasWebGeolocation;
    const hasAndroidGps = deps.hasAndroidGps || defaultHasAndroidGps;

    const platform = getPlatform();
    let value = true;
    if (platform === 'web') {
        value = Boolean(hasWebGeolocation());
    } else if (platform === 'android') {
        try {
            value = Boolean(await hasAndroidGps());
        } catch (e) {
            value = false;
        }
    } else if (platform === 'ios') {
        value = true;
    }

    cached = value;
    return value;
}
```

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add src/utils/deviceGps.js src/utils/deviceGps.test.js
git commit -m "$(cat <<'EOF'
test(web): cover device GPS capability detection

EOF
)"
# If red/green split preferred: commit test first while failing is awkward after green —
# follow repo TDD: commit test(web) then feat(web) in two commits by staging test alone first next time.
# For this task if already green: one feat commit is OK only if tests were watched red first in the session.
```

Preferred commit sequence (do this during execution):

1. Add only the test file, run fail, commit `test(web): ...`
2. Add implementation, run pass, commit `feat(web): ...`

---

### Task 2: `shouldShowLiveLocationShareWithGps` helper

**Files:**
- Modify: `src/utils/ongoingTrip.js`
- Modify: `src/utils/ongoingTrip.test.js`

**Interfaces:**
- Consumes: `shouldShowLiveLocationShare`
- Produces: `shouldShowLiveLocationShareWithGps(trip, userId, now, hasGps) => boolean`

- [ ] **Step 1: Failing tests**

```js
it('hides share when device has no GPS even in share window', () => {
    expect(
        shouldShowLiveLocationShareWithGps(driverTrip, 7, start.subtract(30, 'minute'), false)
    ).toBe(false);
});

it('keeps share when GPS available and window allows', () => {
    expect(
        shouldShowLiveLocationShareWithGps(driverTrip, 7, start.subtract(30, 'minute'), true)
    ).toBe(true);
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```js
export function shouldShowLiveLocationShareWithGps(trip, userId, now, hasGps) {
    return Boolean(hasGps) && shouldShowLiveLocationShare(trip, userId, now);
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit** `test(web)` then `feat(web)`

---

### Task 3: Android DeviceGps plugin + manifest + version

**Files:**
- Create: `android/app/src/main/java/com/sts/carpoolear/DeviceGpsPlugin.java`
- Modify: `android/app/src/main/java/com/sts/carpoolear/MainActivity.java`
- Modify: `android/app/src/main/AndroidManifest.xml`
- Modify: `android/app/build.gradle`
- Test: `android/app/src/main/AndroidManifest.gps.test.js` (or `src/cordova/androidManifestGps.test.js` reading the manifest path) — Vitest reading file contents

- [ ] **Step 1: Failing source tests**

```js
import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const manifestPath = path.resolve(
    __dirname,
    '../../android/app/src/main/AndroidManifest.xml'
);
const gradlePath = path.resolve(
    __dirname,
    '../../android/app/build.gradle'
);

describe('Android GPS optional packaging', () => {
    it('declares GPS optional with tools:replace', () => {
        const xml = fs.readFileSync(manifestPath, 'utf8');
        expect(xml).toContain('xmlns:tools=');
        expect(xml).toMatch(
            /android\.hardware\.location\.gps[\s\S]*android:required="false"/
        );
        expect(xml).toContain('tools:replace="android:required"');
    });

    it('bumps version to 4.0.36 / 4003600', () => {
        const gradle = fs.readFileSync(gradlePath, 'utf8');
        expect(gradle).toContain('versionCode 4003600');
        expect(gradle).toContain('versionName "4.0.36"');
    });
});
```

Place test at `src/cordova/androidGpsPackaging.test.js` with corrected relative paths to `../../android/...`.

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement plugin**

`DeviceGpsPlugin.java`:

```java
package com.sts.carpoolear;

import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DeviceGps")
public class DeviceGpsPlugin extends Plugin {
    @PluginMethod
    public void hasGps(PluginCall call) {
        boolean has = getContext()
            .getPackageManager()
            .hasSystemFeature(PackageManager.FEATURE_LOCATION_GPS);
        JSObject ret = new JSObject();
        ret.put("value", has);
        call.resolve(ret);
    }
}
```

`MainActivity.onCreate` — call `registerPlugin(DeviceGpsPlugin.class);` **before** `super.onCreate(savedInstanceState);` (keep existing WindowCompat line before register+super as needed; registerPlugin must run before bridge init — typically immediately before `super.onCreate`).

Manifest root:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
```

And feature line:

```xml
<uses-feature
    android:name="android.hardware.location.gps"
    android:required="false"
    tools:replace="android:required" />
```

Gradle:

```gradle
versionCode 4003600
versionName "4.0.36"
```

- [ ] **Step 4: Run packaging tests — PASS**

- [ ] **Step 5: Commit** `test(web)` then `feat(web)` for packaging/plugin/version

---

### Task 4: Gate TripButtons + OngoingTripCard

**Files:**
- Modify: `src/components/elements/TripButtons.vue`
- Modify: `src/components/elements/OngoingTripCard.vue`
- Modify: `src/components/elements/OngoingTripCard.view.test.js`
- Create or modify TripButtons view test if present

- [ ] **Step 1: Failing view tests** asserting sources contain `deviceHasGpsCapability` and `shouldShowLiveLocationShareWithGps`

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Wire components**

Pattern:

```js
data() {
  return { deviceHasGps: false, gpsCapabilityResolved: false };
},
async created() {
  this.deviceHasGps = await deviceHasGpsCapability();
  this.gpsCapabilityResolved = true;
},
computed: {
  showLiveLocationShare() {
    if (!this.gpsCapabilityResolved || !this.trip || !this.user) return false;
    return shouldShowLiveLocationShareWithGps(
      this.trip, this.user.id, dayjs(), this.deviceHasGps
    );
  }
}
```

Same for OngoingTripCard `showShareLocationLink` with auth user.

- [ ] **Step 4: PASS + commit** test then feat

---

### Task 5: LiveLocationShare unavailable UI + i18n

**Files:**
- Modify: `src/components/views/LiveLocationShare.vue`
- Modify: `src/components/views/LiveLocationShare.view.test.js`
- Modify: `src/language/i18n.js` (arg, chl, en)
- Optionally extend `src/language` live-location i18n test if one exists

- [ ] **Step 1: Failing tests** for `liveLocationGpsUnavailable` in i18n + view source contains key and `deviceHasGpsCapability`

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement**

i18n:

- arg/chl: `liveLocationGpsUnavailable: 'No disponible en este dispositivo por falta de GPS'`
- en: `liveLocationGpsUnavailable: 'Not available on this device because GPS is missing'`

Template inactive branch:

```html
<div v-else class="live-location-share__inactive">
  <p v-if="!deviceHasGps" class="alert alert-info">
    {{ $t('liveLocationGpsUnavailable') }}
  </p>
  <template v-else>
    <!-- existing intro + start button -->
  </template>
</div>
```

Resolve GPS in `created`/`mounted` before allowing start.

- [ ] **Step 4: PASS + commit**

---

### Task 6: Verify

- [ ] Run: `npx vitest run src/utils/deviceGps.test.js src/utils/ongoingTrip.test.js src/cordova/androidGpsPackaging.test.js src/components/elements/OngoingTripCard.view.test.js src/components/views/LiveLocationShare.view.test.js`
- [ ] Run: `npm run lint`
- [ ] Confirm branch clean aside from intentional commits

---

## Spec coverage check

| Spec item | Task |
| --- | --- |
| Manifest optional + tools:replace | 3 |
| Version 4.0.36 / 4003600 | 3 |
| deviceHasGpsCapability web/android/ios + cache | 1 |
| DeviceGps native plugin | 3 |
| Gate TripButtons / OngoingTripCard | 2, 4 |
| LiveLocationShare message + hide start | 5 |
| Do not gate view screens | (no tasks touch them) |
| TDD commits | each task |
