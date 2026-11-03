import { shareContent as defaultShareContent } from './shareContent.js';
import { buildTripShareMessage } from './tripShareMessage.js';
import { buildWebAppTripDetailUrl } from './supportTicketTripReport.js';
import toast from '../services/toast.js';

export function buildAbsoluteTripDetailUrl(tripId, env = import.meta.env) {
    return buildWebAppTripDetailUrl(tripId, env);
}

export function buildTripShareClipboardText({ text, url }) {
    return [text, url].filter(Boolean).join('\n\n');
}

export async function copyTripShareToClipboard({ text, url }) {
    const clip = buildTripShareClipboardText({ text, url });
    if (!clip || typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('clipboard_unavailable');
    }
    await navigator.clipboard.writeText(clip);
}

export async function shareTripDetail({
    trip,
    locale,
    translate,
    shareContent = defaultShareContent,
    env = import.meta.env
}) {
    const url = buildAbsoluteTripDetailUrl(trip.id, env);
    const text = buildTripShareMessage({
        trip,
        locale,
        translate
    });
    const title = translate('tripCreationShareTrip');

    const result = await shareContent({
        title,
        text,
        url
    });

    if (import.meta.env.DEV) {
        console.info('[shareTripDetail]', result);
    }

    if (result.ok || result.cancelled) {
        return result;
    }

    try {
        await copyTripShareToClipboard({ text, url });
        toast.toast(translate('liveLocationCopySuccess'));
        return {
            ...result,
            ok: true,
            method: 'clipboard',
            copied: true
        };
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('[shareTripDetail] clipboard fallback failed', error);
        }
        return {
            ...result,
            reason: result.reason || 'clipboard_failed'
        };
    }
}
