import { Capacitor } from '@capacitor/core';
import socialShare from '../services/socialShare.js';

function isUserCancelled(error) {
    if (!error) {
        return false;
    }
    const name = error.name || '';
    const message = String(error.message || error);
    return (
        name === 'AbortError' ||
        /cancel/i.test(message) ||
        /abort/i.test(message) ||
        /dismiss/i.test(message)
    );
}

function hasCordovaSocialShare() {
    return Boolean(
        typeof window !== 'undefined' &&
            window.plugins &&
            window.plugins.socialsharing &&
            window.plugins.socialsharing.shareWithOptions
    );
}

function pruneShareFields(fields) {
    const data = {};
    for (const [key, value] of Object.entries(fields)) {
        if (value != null && String(value).trim() !== '') {
            data[key] = value;
        }
    }
    return data;
}

/**
 * Pick a Web Share API payload supported by the browser (MDN canShare pattern).
 */
export function buildNavigatorSharePayload({ title, text, url }) {
    const shareText = text || title || '';
    const candidates = [
        pruneShareFields({ title, text: shareText, url }),
        pruneShareFields({ text: shareText, url }),
        pruneShareFields({ url }),
        pruneShareFields({ text: shareText }),
        pruneShareFields({ title })
    ].filter((candidate) => Object.keys(candidate).length > 0);

    const nav =
        typeof navigator !== 'undefined' ? navigator : null;

    if (!nav || typeof nav.share !== 'function') {
        return {
            data: candidates[0] || null,
            reason: 'no_share_api'
        };
    }

    if (typeof nav.canShare !== 'function') {
        const preferred =
            candidates.find((candidate) => candidate.url) || candidates[0];
        return { data: preferred || null };
    }

    for (const data of candidates) {
        try {
            if (nav.canShare(data)) {
                return { data };
            }
        } catch {
            // Some browsers throw on canShare for unsupported shapes.
        }
    }

    return { data: null, reason: 'canShare_rejected' };
}

function logShareDevResult(result, context) {
    if (import.meta.env.DEV) {
        console.info('[shareContent]', context, result);
    }
}

async function shareViaNavigator({ title, text, url }) {
    const { data, reason } = buildNavigatorSharePayload({ title, text, url });

    if (!data) {
        return {
            ok: false,
            cancelled: false,
            method: 'navigator',
            reason: reason || 'canShare_rejected'
        };
    }

    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
        return {
            ok: false,
            cancelled: false,
            method: 'navigator',
            reason: 'no_share_api'
        };
    }

    try {
        await navigator.share(data);
        return { ok: true, method: 'navigator' };
    } catch (error) {
        if (isUserCancelled(error)) {
            return { ok: false, cancelled: true, method: 'navigator' };
        }
        return {
            ok: false,
            cancelled: false,
            method: 'navigator',
            reason: 'share_error'
        };
    }
}

async function shareViaCapacitor({ title, text, url }) {
    const shareText = text || title || '';
    const { data } = buildNavigatorSharePayload({ title, text: shareText, url });
    const sharePayload = data || {
        title,
        text: shareText,
        url
    };

    const { Share } = await import('@capacitor/share');
    await Share.share({
        title: sharePayload.title ?? title,
        text: sharePayload.text ?? shareText,
        url: sharePayload.url ?? url,
        dialogTitle: title
    });
    return { ok: true, method: 'capacitor' };
}

export async function shareContent({ title, text, url }) {
    const shareText = text || title || '';

    if (Capacitor.isNativePlatform()) {
        try {
            const result = await shareViaCapacitor({ title, text: shareText, url });
            logShareDevResult(result, 'capacitor');
            return result;
        } catch (error) {
            if (isUserCancelled(error)) {
                const result = {
                    ok: false,
                    cancelled: true,
                    method: 'capacitor'
                };
                logShareDevResult(result, 'capacitor');
                return result;
            }
        }
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        const result = await shareViaNavigator({ title, text: shareText, url });
        if (result.ok || result.cancelled) {
            logShareDevResult(result, 'navigator');
            return result;
        }
    } else if (typeof navigator !== 'undefined') {
        logShareDevResult(
            { ok: false, method: 'navigator', reason: 'no_share_api' },
            'navigator'
        );
    }

    if (hasCordovaSocialShare()) {
        socialShare.share({
            message: shareText,
            subject: title,
            url
        });
        const result = { ok: true, method: 'cordova' };
        logShareDevResult(result, 'cordova');
        return result;
    }

    const result = {
        ok: false,
        cancelled: false,
        method: 'none',
        reason: 'no_share_api'
    };
    logShareDevResult(result, 'none');
    return result;
}
