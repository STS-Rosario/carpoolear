import { Capacitor, registerPlugin } from '@capacitor/core';

let cached;
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
