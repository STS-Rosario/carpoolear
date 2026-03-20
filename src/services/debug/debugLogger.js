/* jshint esversion: 6 */

const STORAGE_KEY = 'DEBUG_MODE_ENABLED';
const LOG_LEVELS = ['log', 'info', 'warn', 'error', 'debug'];

function serializeArg(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'string') return arg;
    try {
        if (typeof arg === 'object' && arg instanceof Error) {
            return `${arg.name}: ${arg.message}\n${arg.stack || ''}`;
        }
        return JSON.stringify(arg);
    } catch (e) {
        return String(arg);
    }
}

function createDebugLogger(options = {}) {
    const storage = options.storage || {
        getItem: () => Promise.resolve(null),
        setItem: () => Promise.resolve()
    };
    const getDeviceInfo = options.getDeviceInfo || function () {
        return {
            appVersion: (typeof window !== 'undefined' && window.appVersion) || 'unknown',
            device: (typeof window !== 'undefined' && window.device) || { platform: 'unknown', model: 'unknown', osVersion: 'unknown' },
            notificationPermission: typeof window !== 'undefined' && window.Notification ? window.Notification.permission : 'unknown',
            networkOnline: (typeof navigator !== 'undefined' && navigator.onLine !== undefined) ? navigator.onLine : true
        };
    };

    let logBuffer = [];
    let enabled = false;
    const originalConsole = {};
    let isPatched = false;

    function capture(level) {
        return (...args) => {
            if (originalConsole[level]) {
                originalConsole[level].apply(console, args);
            }
            if (enabled) {
                const message = args.map(serializeArg).join(' ');
                logBuffer.push({
                    level,
                    timestamp: new Date().toISOString(),
                    message
                });
            }
        };
    }

    function patchConsole() {
        if (isPatched) return;
        LOG_LEVELS.forEach((level) => {
            originalConsole[level] = console[level];
            console[level] = capture(level);
        });
        isPatched = true;
    }

    function unpatchConsole() {
        if (!isPatched) return;
        LOG_LEVELS.forEach((level) => {
            if (originalConsole[level]) {
                console[level] = originalConsole[level];
            }
        });
        isPatched = false;
    }

    function clearLogs() {
        logBuffer = [];
    }

    function getDebugInfo() {
        const info = getDeviceInfo();
        const lines = [];

        lines.push('=== Carpoolear Debug Info ===');
        lines.push(`App Version: ${info.appVersion}`);
        lines.push(`Device: ${JSON.stringify(info.device)}`);
        lines.push(`Notification Permission: ${info.notificationPermission}`);
        lines.push(`Network: ${info.networkOnline ? 'online' : 'offline'}`);
        lines.push('');
        lines.push('=== Console Logs ===');

        logBuffer.forEach((entry) => {
            lines.push(`[${entry.timestamp}] [${entry.level}] ${entry.message}`);
        });

        return lines.join('\n');
    }

    async function init() {
        clearLogs();
        const stored = await storage.getItem(STORAGE_KEY);
        enabled = stored === true || stored === 'true';
        if (enabled) {
            patchConsole();
        } else {
            unpatchConsole();
        }
    }

    async function setEnabled(value) {
        enabled = !!value;
        await storage.setItem(STORAGE_KEY, enabled);
        if (enabled) {
            patchConsole();
        } else {
            unpatchConsole();
        }
    }

    function isEnabled() {
        return enabled;
    }

    async function isEnabledAsync() {
        const stored = await storage.getItem(STORAGE_KEY);
        return stored === true || stored === 'true';
    }

    return {
        init,
        clearLogs,
        getDebugInfo,
        isEnabled,
        isEnabledAsync,
        setEnabled
    };
}

let defaultInstance = null;

function getDefaultInstance() {
    if (!defaultInstance) {
        throw new Error('Debug logger not initialized. Call initDebugLogger() first.');
    }
    return defaultInstance;
}

function init(cache, getDeviceInfo) {
    if (!defaultInstance) {
        defaultInstance = createDebugLogger({
            storage: cache,
            getDeviceInfo
        });
    }
    return defaultInstance;
}

function clearLogsExport() {
    return getDefaultInstance().clearLogs();
}
function getDebugInfoExport() {
    return getDefaultInstance().getDebugInfo();
}
function isEnabledExport() {
    return getDefaultInstance().isEnabled();
}
function setEnabledExport(v) {
    return getDefaultInstance().setEnabled(v);
}
function isEnabledAsyncExport() {
    return getDefaultInstance().isEnabledAsync();
}

export {
    createDebugLogger,
    init,
    clearLogsExport as clearLogs,
    getDebugInfoExport as getDebugInfo,
    isEnabledExport as isEnabled,
    setEnabledExport as setEnabled,
    isEnabledAsyncExport as isEnabledAsync
};

export default { createDebugLogger, init, clearLogs: clearLogsExport, getDebugInfo: getDebugInfoExport, isEnabled: isEnabledExport, setEnabled: setEnabledExport, isEnabledAsync: isEnabledAsyncExport };
