/* jshint esversion: 6 */

import store from '../store';
import push from './push.js';
import facebook from './facebook.js';
import * as types from '../store/mutation-types';

window.facebook = facebook;

let onDeviceReady = () => {
    console.log('Device ready');
    store.commit('cordova/' + types.CORDOVA_DEVICEREADY);
    store.commit('cordova/' + types.CORDOVA_SET_DEVICE, window.device);

    if (window.PushNotification) {
        console.log('push init');
        push.init();
    }
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
