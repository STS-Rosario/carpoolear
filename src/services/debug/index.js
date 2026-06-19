/* jshint esversion: 6 */

import cache from '../cache';
import { createDebugLogger } from './debugLogger.js';
import {
    buildSupportInfoSnapshot,
    fetchSupportInfoSnapshot
} from '../../utils/supportInfo.js';

let defaultInstance = null;

function getSupportInfoSnapshot() {
    return buildSupportInfoSnapshot({
        windowAppVersion: typeof window !== 'undefined' && window.appVersion
            ? window.appVersion
            : null,
        device: typeof window !== 'undefined' && window.device ? window.device : null,
        notificationPermission: typeof window !== 'undefined' && window.Notification
            ? window.Notification.permission
            : null,
        networkOnline: typeof navigator !== 'undefined' && navigator.onLine !== undefined
            ? navigator.onLine
            : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    });
}

async function refreshSupportInfoSnapshot(instance) {
    if (!instance) {
        return;
    }

    try {
        const snapshot = await fetchSupportInfoSnapshot();
        instance.setSupportInfoSnapshot(snapshot);
    } catch (err) {
        instance.refreshSupportInfoSnapshot();
    }
}

async function init() {
    defaultInstance = createDebugLogger({
        storage: cache,
        getSupportInfoSnapshot
    });
    await defaultInstance.init();
    await refreshSupportInfoSnapshot(defaultInstance);
}

function getInstance() {
    return defaultInstance;
}

export { init, getInstance, refreshSupportInfoSnapshot };
