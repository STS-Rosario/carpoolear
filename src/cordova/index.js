/* jshint esversion: 6 */

import push from './push-capacitor.js';
import facebook from './facebook.js';
import cache from '../services/cache';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import config from '../../config/conf.json';
import { useCordovaStore } from '../stores/cordova';
import { useRootStore } from '../stores/root';

window.facebook = facebook;
window.appVersion = '3.1.8';

function getCordovaStore () {
    return useCordovaStore();
}

function getRootStore () {
    return useRootStore();
}

const onDeviceReady = () => {
    const hasToDoInit = true;
    cache.setItem('appVersion', window.appVersion);
    if (hasToDoInit) {
        doInit();
    }
};

const doInit = async () => {
    getCordovaStore().setDeviceReady();

    // Initialize device info with Capacitor
    await initDeviceInfo();

    // Initialize push notifications with Capacitor
    push.init();

    // Initialize network monitoring with Capacitor
    initNetworkMonitoring();

    getRootStore().init();

    document.addEventListener('backbutton', onBackbutton, false);
};

const initDeviceInfo = async () => {
    const cordovaStore = getCordovaStore();

    if (Capacitor.isNativePlatform()) {
        try {
            const deviceInfo = await Device.getInfo();

            // Create a device object compatible with the old Cordova format
            const compatibleDevice = {
                platform: deviceInfo.platform,
                model: deviceInfo.model,
                version: deviceInfo.osVersion,
                manufacturer: deviceInfo.manufacturer,
                isVirtual: deviceInfo.isVirtual,
                webViewVersion: deviceInfo.webViewVersion
            };

            // Set the device globally for backward compatibility
            window.device = compatibleDevice;

            // Update the store
            cordovaStore.setDevice(compatibleDevice);
        } catch (error) {
            // Fallback to existing window.device if available
            if (window.device) {
                cordovaStore.setDevice(window.device);
            }
        }
    } else {
        // For web platform, create a basic device object
        const webDevice = {
            platform: 'browser',
            model: 'Unknown',
            version: navigator.userAgent,
            manufacturer: 'Unknown',
            isVirtual: false,
            webViewVersion: navigator.userAgent
        };

        window.device = webDevice;
        cordovaStore.setDevice(webDevice);
    }
};

const initNetworkMonitoring = async () => {
    const cordovaStore = getCordovaStore();

    if (Capacitor.isNativePlatform()) {
        try {
            // Get initial network status
            const status = await Network.getStatus();

            if (status.connected) {
                cordovaStore.deviceOnline();
            } else {
                cordovaStore.deviceOffline();
            }

            // Listen for network changes
            Network.addListener('networkStatusChange', (status) => {
                if (status.connected) {
                    cordovaStore.deviceOnline();
                } else {
                    cordovaStore.deviceOffline();
                }
            });
        } catch (error) {
            // Fallback to browser events
            initBrowserNetworkEvents();
        }
    } else {
        initBrowserNetworkEvents();
    }
};

const initBrowserNetworkEvents = () => {
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
};

const onOnline = () => {
    getCordovaStore().deviceOnline();
};

const onOffline = () => {
    getCordovaStore().deviceOffline();
};

//  cordova.fireDocumentEvent('backbutton'); for testing in console
const onBackbutton = () => {
    getCordovaStore().onBackButton();
};

const onPause = () => {
    getCordovaStore().onPausa();
};

const onResumen = () => {
    getCordovaStore().onResumen();
};

document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('pause', onPause, false);
document.addEventListener('resume', onResumen, false);

// For Capacitor: Initialize immediately if running on native platform
console.log('Checking platform:', Capacitor.getPlatform());
console.log('Is native platform:', Capacitor.isNativePlatform());

if (Capacitor.isNativePlatform()) {
    // Wait a bit for Capacitor to be fully ready
    setTimeout(() => {
        onDeviceReady();
    }, 1000);
} else {
    if (
        config.web_push_notification &&
        window.Notification.permission === 'granted'
    ) {
        onDeviceReady();
    }
}
