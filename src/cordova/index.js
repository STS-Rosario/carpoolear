/* jshint esversion: 6 */

console.log('CORDOVA INDEX.JS IS LOADING!');

import store from '../store';
import push from './push-capacitor.js';
import facebook from './facebook.js';
import * as types from '../store/mutation-types';
import cache from '../services/cache';
import { Capacitor } from '@capacitor/core';

window.facebook = facebook;
window.appVersion = '2.2.2';

let onDeviceReady = () => {
    console.log('Device ready');
    let hasToDoInit = true;
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

let doInit = () => {
    console.log('do Init');
    store.commit('cordova/' + types.CORDOVA_DEVICEREADY);
    store.commit('cordova/' + types.CORDOVA_SET_DEVICE, window.device);

    // Initialize push notifications with Capacitor
    console.log('Initializing push notifications...');
    push.init();
    store.dispatch('init');

    document.addEventListener('backbutton', onBackbutton, false);
};

let onOnline = () => {
    console.log('Device online');
    store.dispatch('cordova/deviceOnline');
};

let onOffline = () => {
    console.log('Device offline');
    store.dispatch('cordova/deviceOffline');
};

//  cordova.fireDocumentEvent('backbutton'); for testing in console
let onBackbutton = () => {
    console.log('Backbutton');
    store.dispatch('cordova/onBackButton');
};

let onPause = () => {
    store.dispatch('cordova/onPausa');
};

let onResumen = () => {
    store.dispatch('cordova/onResumen');
};

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('online', onOnline, false);
document.addEventListener('offline', onOffline, false);

document.addEventListener('pause', onPause, false);
document.addEventListener('resumen', onResumen, false);

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
    console.log('Web platform or Cordova - waiting for deviceready event');
}
