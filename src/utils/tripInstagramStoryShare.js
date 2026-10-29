import { Capacitor } from '@capacitor/core';
import TripApi from '../services/api/Trips.js';

const tripsApi = new TripApi();
const STORY_TITLE = 'Carpoolear - Instagram story';

function isUserCancelled(error) {
    const name = error?.name || '';
    const message = String(error?.message || error || '');
    return (
        name === 'AbortError' ||
        /cancel/i.test(message) ||
        /abort/i.test(message) ||
        /dismiss/i.test(message)
    );
}

async function blobToBase64(blob) {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const chunks = [];
    for (let offset = 0; offset < bytes.length; offset += 0x8000) {
        chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + 0x8000)));
    }

    return btoa(chunks.join(''));
}

async function shareOnNative(fileName, blob, title) {
    const [{ Directory, Filesystem }, { Share }] = await Promise.all([
        import('@capacitor/filesystem'),
        import('@capacitor/share')
    ]);
    const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: await blobToBase64(blob),
        directory: Directory.Cache
    });

    if (!savedFile.uri) {
        throw new Error('The story image was saved without a shareable file URI.');
    }

    try {
        await Share.share({
            title,
            dialogTitle: title,
            files: [savedFile.uri]
        });
        return { ok: true, method: 'capacitor' };
    } catch (error) {
        if (isUserCancelled(error)) {
            return { ok: false, cancelled: true, method: 'capacitor' };
        }
        throw error;
    } finally {
        try {
            await Filesystem.deleteFile({
                path: fileName,
                directory: Directory.Cache
            });
        } catch (error) {
            console.error('Could not remove temporary trip story image:', error);
        }
    }
}

async function shareOnWeb(file, title) {
    if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
    ) {
        try {
            await navigator.share({ title, files: [file] });
            return { ok: true, method: 'navigator' };
        } catch (error) {
            if (isUserCancelled(error)) {
                return { ok: false, cancelled: true, method: 'navigator' };
            }
            console.warn('Web Share API failed; downloading the trip story instead:', error);
        }
    }

    if (
        typeof document === 'undefined' ||
        typeof URL.createObjectURL !== 'function'
    ) {
        throw new Error('This browser cannot download the trip story image.');
    }

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    try {
        link.click();
        return { ok: true, method: 'download' };
    } finally {
        link.remove();
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    }
}

export async function shareTripInstagramStory(tripId, title = STORY_TITLE) {
    const numericTripId = Number(tripId);
    if (!Number.isInteger(numericTripId) || numericTripId <= 0) {
        throw new TypeError('A valid trip ID is required to share its story.');
    }

    const image = await tripsApi.instagramStory(numericTripId);
    if (
        !(image instanceof Blob) ||
        image.size === 0 ||
        image.type !== 'image/png'
    ) {
        throw new Error('The trip story endpoint did not return a valid PNG image.');
    }

    const fileName = `carpoolear-viaje-${numericTripId}-instagram-story.png`;
    if (Capacitor.isNativePlatform()) {
        return shareOnNative(fileName, image, title);
    }

    if (typeof File === 'undefined') {
        throw new Error('This browser cannot create a shareable story image.');
    }

    return shareOnWeb(new File([image], fileName, { type: 'image/png' }), title);
}
