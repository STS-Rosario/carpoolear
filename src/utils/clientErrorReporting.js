import { DebugApi } from '../services/api';
import {
    sanitizeClientLogContext,
    sanitizeClientLogString
} from './clientLogSanitizer.js';

const defaultDebugApi = new DebugApi();

export function formatApiErrorForClientLog(error) {
    if (!error) {
        return null;
    }

    const payload = {
        status: error.status,
        message: error.data?.message || error.message || null,
        errors: error.data?.errors || error.errors || null
    };

    if (error.offline === true) {
        payload.offline = true;
    }

    return sanitizeClientLogContext(payload);
}

export function formatErrorStackForClientLog(error) {
    if (!error) {
        return null;
    }

    if (typeof error === 'string') {
        return sanitizeClientLogString(error);
    }

    if (error instanceof Error) {
        return sanitizeClientLogString(error.stack || error.message);
    }

    if (typeof error.stack === 'string') {
        return sanitizeClientLogString(error.stack);
    }

    if (typeof error.message === 'string') {
        return sanitizeClientLogString(error.message);
    }

    return null;
}

export async function reportClientError({
    source,
    message,
    error,
    context,
    debugApi = defaultDebugApi
} = {}) {
    const safeSource = sanitizeClientLogString(source, 200);
    const safeLog =
        sanitizeClientLogString(message, 4000) ||
        formatErrorStackForClientLog(error);

    const safeContext = sanitizeClientLogContext({
        ...(context || {}),
        ...(formatApiErrorForClientLog(error) || {})
    });

    const hasContext =
        safeContext && Object.keys(safeContext).length > 0;

    if (!safeLog && !hasContext) {
        return;
    }

    try {
        await debugApi.log({
            source: safeSource,
            log: safeLog,
            context: hasContext ? safeContext : undefined
        });
    } catch (reportError) {
        // Never surface logging failures to the user.
    }
}

export async function logGenericApiErrorForDebug(source, error, options = {}) {
    const { debugEnabled = false } = options;

    if (debugEnabled) {
        console.error(`[${source}] API error`, {
            status: error?.status,
            offline: error?.offline,
            data: error?.data
        });
    }

    await reportClientError({
        source,
        message: `${source} API error`,
        error,
        debugApi: options.debugApi
    });
}
