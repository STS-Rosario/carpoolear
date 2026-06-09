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

export async function shareContent({ title, text, url }) {
    const shareText = text || title || '';
    const payload = {
        title,
        text: shareText,
        url
    };

    if (Capacitor.isNativePlatform()) {
        try {
            const { Share } = await import('@capacitor/share');
            await Share.share({
                title,
                text: shareText,
                url,
                dialogTitle: title
            });
            return { ok: true, method: 'capacitor' };
        } catch (error) {
            if (isUserCancelled(error)) {
                return { ok: false, cancelled: true, method: 'capacitor' };
            }
        }
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
            await navigator.share(payload);
            return { ok: true, method: 'navigator' };
        } catch (error) {
            if (isUserCancelled(error)) {
                return { ok: false, cancelled: true, method: 'navigator' };
            }
        }
    }

    if (hasCordovaSocialShare()) {
        socialShare.share({
            message: shareText,
            subject: title,
            url
        });
        return { ok: true, method: 'cordova' };
    }

    return { ok: false, cancelled: false, method: 'none' };
}
