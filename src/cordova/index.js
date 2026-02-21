/* jshint esversion: 6 */

import { useCordovaStore } from '../stores/cordova';
import { useDeviceStore } from '../stores/device';
import push from './push-capacitor.js';
import facebook from './facebook.js';
import cache from '../services/cache';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import config from '../../config/conf.json';

console.log('CORDOVA INDEX.JS IS LOADING!');

window.facebook = facebook;
window.appVersion = '2.2.2';

const onDeviceReady = () => {
    console.log('Device ready');
    const hasToDoInit = true;
    cache.setItem('appVersion', window.appVersion);
    if (hasToDoInit) {
        doInit();
    }
};

const doInit = async () => {
    console.log('do Init');
    const cordovaStore = useCordovaStore();

    cordovaStore.setDeviceReady();

    // Initialize device info with Capacitor
    await initDeviceInfo();

    // Initialize push notifications with Capacitor
    console.log('Initializing push notifications...');
    push.init();

    // Initialize network monitoring with Capacitor
    initNetworkMonitoring();

    document.addEventListener('backbutton', onBackbutton, false);
};

const initDeviceInfo = async () => {
    const cordovaStore = useCordovaStore();

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
            cordovaStore.setDevice(compatibleDevice);
        } catch (error) {
            console.error('Error getting device info:', error);
            // Fallback to existing window.device if available
            if (window.device) {
                cordovaStore.setDevice(window.device);
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
        cordovaStore.setDevice(webDevice);
    }
};

const initNetworkMonitoring = async () => {
    const cordovaStore = useCordovaStore();

    if (Capacitor.isNativePlatform()) {
        console.log('Initializing Capacitor network monitoring...');

        try {
            // Get initial network status
            const status = await Network.getStatus();
            console.log('Initial network status:', status);

            if (status.connected) {
                cordovaStore.setDeviceOnline();
            } else {
                cordovaStore.setDeviceOffline();
            }

            // Listen for network changes
            Network.addListener('networkStatusChange', (status) => {
                console.log('Network status changed:', status);
                if (status.connected) {
                    cordovaStore.setDeviceOnline();
                } else {
                    cordovaStore.setDeviceOffline();
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
    const cordovaStore = useCordovaStore();
    cordovaStore.setDeviceOnline();
};

const onOffline = () => {
    console.log('Device offline (browser event)');
    const cordovaStore = useCordovaStore();
    cordovaStore.setDeviceOffline();
};

//  cordova.fireDocumentEvent('backbutton'); for testing in console
const onBackbutton = () => {
    console.log('Backbutton');
    const cordovaStore = useCordovaStore();
    cordovaStore.onBackButton();
};

document.addEventListener('deviceready', onDeviceReady, false);

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
