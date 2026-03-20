/* jshint esversion: 6 */

import cache from '../cache';
import { createDebugLogger } from './debugLogger.js';

let defaultInstance = null;

function getDeviceInfo() {
    let device = (window && window.device) || { platform: 'unknown', model: 'unknown', osVersion: 'unknown' };
    let networkOnline = (typeof navigator !== 'undefined' && navigator.onLine !== undefined) ? navigator.onLine : true;
    try {
        const { useCordovaStore } = require('../../stores/cordova');
        const store = useCordovaStore();
        if (store && store.device) {
            device = store.device;
        }
        if (store && store.networkState !== undefined) {
            networkOnline = store.networkState;
        }
    } catch (e) {
        // Store not ready yet, use window/navigator fallbacks
    }
    return {
        appVersion: (window && window.appVersion) || 'unknown',
        device,
        notificationPermission: typeof window !== 'undefined' && window.Notification
            ? window.Notification.permission
            : 'unknown',
        networkOnline
    };
}

async function init() {
    defaultInstance = createDebugLogger({
        storage: cache,
        getDeviceInfo
    });
    await defaultInstance.init();
}

function getInstance() {
    return defaultInstance;
}

export { init, getInstance };
export { createDebugLogger } from './debugLogger.js';
