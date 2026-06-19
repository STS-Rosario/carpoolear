import { SPLASH_WEB_BUILD_NUMBER } from './customSplash.js';

export const SUPPORT_INFO_SECTION_HEADER = '--- Información del dispositivo ---';

function displayValue(value, fallback = 'unknown') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    return String(value);
}

export function resolveAppVersion({
    appVersionInfo,
    windowAppVersion,
    webBuildNumber = SPLASH_WEB_BUILD_NUMBER,
    isNativePlatform = false
} = {}) {
    if (appVersionInfo && appVersionInfo.version != null && appVersionInfo.version !== '') {
        return {
            appVersion: String(appVersionInfo.version),
            appVersionName: displayValue(appVersionInfo.versionName, ''),
            appVersionSource: displayValue(appVersionInfo.versionSource, 'unknown'),
            webBuildNumber: isNativePlatform ? '' : String(webBuildNumber)
        };
    }

    if (windowAppVersion) {
        return {
            appVersion: String(windowAppVersion),
            appVersionName: '',
            appVersionSource: 'fallback',
            webBuildNumber: isNativePlatform ? '' : String(webBuildNumber)
        };
    }

    return {
        appVersion: 'unknown',
        appVersionName: '',
        appVersionSource: 'unknown',
        webBuildNumber: isNativePlatform ? '' : String(webBuildNumber)
    };
}

export function normalizeDeviceRecord(device) {
    if (!device || typeof device !== 'object') {
        return {
            operatingSystem: 'unknown',
            deviceModel: 'unknown',
            osVersion: 'unknown',
            deviceManufacturer: 'unknown',
            isVirtual: 'unknown',
            webViewVersion: 'unknown'
        };
    }

    const operatingSystem = displayValue(
        device.platform || device.operatingSystem,
        'unknown'
    );
    const osVersion = displayValue(
        device.osVersion || device.version || device.os,
        'unknown'
    );

    return {
        operatingSystem,
        deviceModel: displayValue(device.model, 'unknown'),
        osVersion,
        deviceManufacturer: displayValue(device.manufacturer, 'unknown'),
        isVirtual: device.isVirtual === undefined
            ? 'unknown'
            : String(Boolean(device.isVirtual)),
        webViewVersion: displayValue(device.webViewVersion, 'unknown')
    };
}

export function buildSupportInfoSnapshot(deps = {}) {
    const {
        appVersionInfo = null,
        windowAppVersion = null,
        capacitorPlatform = 'unknown',
        isNativePlatform = false,
        webBuildNumber = SPLASH_WEB_BUILD_NUMBER,
        device = null,
        deviceId = null,
        networkOnline = null,
        notificationPermission = null,
        userAgent = null
    } = deps;

    const versionFields = resolveAppVersion({
        appVersionInfo,
        windowAppVersion,
        webBuildNumber,
        isNativePlatform
    });
    const deviceFields = normalizeDeviceRecord(device);

    return {
        ...versionFields,
        platform: displayValue(capacitorPlatform, 'unknown'),
        ...deviceFields,
        deviceId: displayValue(deviceId, 'unknown'),
        networkOnline: networkOnline === null
            ? 'unknown'
            : (networkOnline ? 'online' : 'offline'),
        notificationPermission: displayValue(notificationPermission, 'unknown'),
        userAgent: displayValue(userAgent, 'unknown')
    };
}

const SUPPORT_INFO_FIELD_LABELS = [
    ['appVersion', 'App Version'],
    ['appVersionName', 'App Version Name'],
    ['appVersionSource', 'App Version Source'],
    ['webBuildNumber', 'Web Build'],
    ['platform', 'Platform'],
    ['operatingSystem', 'Operating System'],
    ['deviceModel', 'Device Model'],
    ['osVersion', 'OS Version'],
    ['deviceManufacturer', 'Manufacturer'],
    ['isVirtual', 'Is Virtual Device'],
    ['webViewVersion', 'WebView Version'],
    ['deviceId', 'Device ID'],
    ['networkOnline', 'Network'],
    ['notificationPermission', 'Notification Permission'],
    ['userAgent', 'User Agent']
];

export function formatSupportInfoLines(snapshot) {
    const lines = [SUPPORT_INFO_SECTION_HEADER];

    SUPPORT_INFO_FIELD_LABELS.forEach(([key, label]) => {
        const value = snapshot[key];
        if (value === '' || value === undefined) {
            return;
        }
        lines.push(`${label}: ${value}`);
    });

    return lines;
}

export function formatSupportInfoBlock(snapshot) {
    return formatSupportInfoLines(snapshot).join('\n');
}

export function appendSupportInfoToMessage(message, snapshot) {
    const block = formatSupportInfoBlock(snapshot);
    const trimmed = message == null ? '' : String(message).trim();

    if (!trimmed) {
        return block;
    }

    return `${trimmed}\n\n${block}`;
}

export async function fetchSupportInfoSnapshot(deps = {}) {
    const {
        importCordovaStore = () => import('../stores/cordova.js'),
        importRootStore = () => import('../stores/root.js'),
        importCapacitorCore = () => import('@capacitor/core'),
        windowRef = typeof window !== 'undefined' ? window : null,
        navigatorRef = typeof navigator !== 'undefined' ? navigator : null
    } = deps;

    let appVersionInfo = null;
    let device = windowRef && windowRef.device ? windowRef.device : null;
    let deviceId = null;
    let networkOnline = navigatorRef && navigatorRef.onLine !== undefined
        ? navigatorRef.onLine
        : null;
    let capacitorPlatform = 'unknown';
    let isNativePlatform = false;

    try {
        const { Capacitor } = await importCapacitorCore();
        capacitorPlatform = Capacitor.getPlatform();
        isNativePlatform = Capacitor.isNativePlatform();
    } catch (e) {
        // Capacitor unavailable in test or web-only contexts
    }

    try {
        const { useRootStore } = await importRootStore();
        const rootStore = useRootStore();
        if (rootStore && rootStore.appVersionInfo) {
            appVersionInfo = rootStore.appVersionInfo;
        }
    } catch (e) {
        // Store not ready yet
    }

    try {
        const { useCordovaStore } = await importCordovaStore();
        const store = useCordovaStore();
        if (store) {
            if (store.device) {
                device = store.device;
            }
            if (store.deviceId) {
                deviceId = store.deviceId;
            }
            if (store.networkState !== undefined) {
                networkOnline = store.networkState;
            }
        }
    } catch (e) {
        // Store not ready yet
    }

    return buildSupportInfoSnapshot({
        appVersionInfo,
        windowAppVersion: windowRef && windowRef.appVersion ? windowRef.appVersion : null,
        capacitorPlatform,
        isNativePlatform,
        device,
        deviceId,
        networkOnline,
        notificationPermission: windowRef && windowRef.Notification
            ? windowRef.Notification.permission
            : null,
        userAgent: navigatorRef ? navigatorRef.userAgent : null
    });
}
