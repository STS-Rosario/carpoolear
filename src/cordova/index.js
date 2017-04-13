/*jshint esversion: 6 */

import store from '../store';
import * as types from '../store/mutation-types';
import push from './push.js';

import facebook from './facebook.js';

window.facebook = facebook;

let onDeviceReady = () => {
  console.log('Device ready');
  store.commit('cordova/' + types.CORDOVA_DEVICEREADY);
  store.commit('cordova/' + types.CORDOVA_SET_DEVICE, window.device);

  if (window.PushNotification) {
    push.init();
  }
};

let onOnline = () => {
  console.log('Device online');
  store.commit('cordova/' + types.CORDOVA_ONLINE);
};

let onOffline = () => {
  console.log('Device offline');
  store.commit('cordova/' + types.CORDOVA_OFFLINE);
};

//  cordova.fireDocumentEvent('backbutton'); for testing in console
let onBackbutton = () => {
  console.log('Backbutton');
};

let onPause = () => {

};

let onResumen = () => {

};

document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('online', onOnline, false);
document.addEventListener('offline', onOffline, false);
document.addEventListener('backbutton', onBackbutton, false);
document.addEventListener('pause', onPause, false);
document.addEventListener('resumen', onResumen, false);
