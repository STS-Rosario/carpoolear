import { shareContent as defaultShareContent } from './shareContent.js';
import { buildTripShareMessage } from './tripShareMessage.js';
import { buildWebAppTripDetailUrl } from './supportTicketTripReport.js';
import { copyTextToClipboard } from './copyTextToClipboard.js';
import dialogs from '../services/dialogs.js';

export function buildAbsoluteTripDetailUrl(tripId, env = import.meta.env) {
    return buildWebAppTripDetailUrl(tripId, env);
}

export function buildTripShareClipboardText({ text, url }) {
    return [text, url].filter(Boolean).join('\n\n');
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

    const copied = await copyTextToClipboard(
        buildTripShareClipboardText({ text, url })
    );
    if (!copied) {
        if (import.meta.env.DEV) {
            console.warn('[shareTripDetail] clipboard fallback failed');
        }
        return {
            ...result,
            ok: false,
            reason: result.reason || 'clipboard_failed'
        };
    }

    dialogs.message(translate('liveLocationCopySuccess'), {
        estado: 'success'
    });
    return {
        ...result,
        ok: true,
        method: 'clipboard',
        copied: true
    };
}
