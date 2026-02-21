/* jshint esversion: 6 */

import store from '../store';
import push from './push-capacitor.js';
import facebook from './facebook.js';
import * as types from '../store/mutation-types';
import cache from '../services/cache';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { SplashScreen } from '@capacitor/splash-screen';
import config from '../../config/conf.json';

console.log('CORDOVA INDEX.JS IS LOADING!');

window.facebook = facebook;
window.appVersion = '2.2.2';

const onDeviceReady = () => {
    console.log('Device ready');
    const hasToDoInit = true;
    /* if (window.device && window.device.platform) {
        if (window.device.platform.toLowerCase() === 'android' || window.device.platform.toLowerCase() === 'ios') {
            hasToDoInit = false;
            cache.getItem('appVersion').then((appVersion) => {
                console.log('appVersion', appVersion, window.appVersion !== appVersion);
                if (window.appVersion !== appVersion) {
                    console.log('Clear all cache on device start');
                    cache.clear();
                    window.CacheClear(function () {
                        cache.setItem('appVersion', window.appVersion);
                        console.log('Wipe all data');
                        doInit();
                        window.location.reload();
                    }, function () {
                        console.log('Failed to wipe all data');
                        doInit();
                    });
                } else {
                    console.log('Same version, do Init');
                    doInit();
                }
            });
        }
    } */
    cache.setItem('appVersion', window.appVersion);
    if (hasToDoInit) {
        doInit();
    }
};

const doInit = async () => {
    console.log('do Init');
    store.commit('cordova/' + types.CORDOVA_DEVICEREADY);

    // Initialize device info with Capacitor
    await initDeviceInfo();

    // Initialize push notifications with Capacitor
    console.log('Initializing push notifications...');
    push.init();

    // Initialize network monitoring with Capacitor
    initNetworkMonitoring();

    store.dispatch('init');

    document.addEventListener('backbutton', onBackbutton, false);
};

const initDeviceInfo = async () => {
    if (Capacitor.isNativePlatform()) {
        console.log('Initializing Capacitor device info...');

        try {
            const deviceInfo = await Device.getInfo();
            console.log('Device info:', deviceInfo);

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
            store.commit('cordova/' + types.CORDOVA_SET_DEVICE, compatibleDevice);
        } catch (error) {
            console.error('Error getting device info:', error);
            // Fallback to existing window.device if available
            if (window.device) {
                store.commit('cordova/' + types.CORDOVA_SET_DEVICE, window.device);
            }
        }
    } else {
        console.log('Web platform - using browser device detection');
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
        store.commit('cordova/' + types.CORDOVA_SET_DEVICE, webDevice);
    }
};

const initNetworkMonitoring = async () => {
    if (Capacitor.isNativePlatform()) {
        console.log('Initializing Capacitor network monitoring...');

        try {
            // Get initial network status
            const status = await Network.getStatus();
            console.log('Initial network status:', status);

            if (status.connected) {
                store.dispatch('cordova/deviceOnline');
            } else {
                store.dispatch('cordova/deviceOffline');
            }

            // Listen for network changes
            Network.addListener('networkStatusChange', (status) => {
                console.log('Network status changed:', status);
                if (status.connected) {
                    store.dispatch('cordova/deviceOnline');
                } else {
                    store.dispatch('cordova/deviceOffline');
                }
            });
        } catch (error) {
            console.error('Error initializing network monitoring:', error);
            // Fallback to browser events
            initBrowserNetworkEvents();
        }
    } else {
        console.log('Web platform - using browser network events');
        initBrowserNetworkEvents();
    }
};

const initBrowserNetworkEvents = () => {
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
};

const onOnline = () => {
    console.log('Device online (browser event)');
    store.dispatch('cordova/deviceOnline');
};

const onOffline = () => {
    console.log('Device offline (browser event)');
    store.dispatch('cordova/deviceOffline');
};

//  cordova.fireDocumentEvent('backbutton'); for testing in console
const onBackbutton = () => {
    console.log('Backbutton');
    store.dispatch('cordova/onBackButton');
};

const onPause = () => {
    store.dispatch('cordova/onPausa');
};

const onResumen = () => {
    store.dispatch('cordova/onResumen');
};

document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('pause', onPause, false);
document.addEventListener('resume', onResumen, false);

// For Capacitor: Initialize immediately if running on native platform
console.log('Checking platform:', Capacitor.getPlatform());
console.log('Is native platform:', Capacitor.isNativePlatform());

if (Capacitor.isNativePlatform()) {
    console.log('Capacitor native platform detected - initializing immediately');

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
