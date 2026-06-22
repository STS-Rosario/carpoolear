import { Capacitor } from '@capacitor/core';
import { DEFAULT_IMAGE_UPLOAD_MAX_BYTES, getImageUploadMaxBytes } from './imageUpload';

export const DEFAULT_COMPRESS_MAX_DIMENSION = 3072;
export const NATIVE_UPLOAD_TARGET_BYTES = 3 * 1024 * 1024;
const QUALITY_STEPS = [0.88, 0.78, 0.68, 0.58, 0.48];

export function resolveNativeUploadMaxBytes(config) {
    const maxBytes = getImageUploadMaxBytes(config);

    if (Capacitor.isNativePlatform()) {
        return Math.min(maxBytes, NATIVE_UPLOAD_TARGET_BYTES);
    }

    return maxBytes;
}

export async function compressImageFilesForUpload(files, config, options = {}) {
    const maxBytes = options.maxBytes ?? resolveNativeUploadMaxBytes(config);
    const list = Array.from(files || []);

    if (!list.length) {
        return [];
    }

    return Promise.all(
        list.map((file) => compressImageFileForUpload(file, { ...options, maxBytes }))
    );
}

export function computeScaledDimensions(width, height, maxDimension) {
    if (!width || !height) {
        return { width: 0, height: 0 };
    }

    if (width <= maxDimension && height <= maxDimension) {
        return { width, height };
    }

    const scale = maxDimension / Math.max(width, height);

    return {
        width: Math.round(width * scale),
        height: Math.round(height * scale)
    };
}

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
}

function canvasToJpegBlob(canvas, quality) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', quality);
    });
}

function buildCompressedFileName(file) {
    const baseName = (file.name || 'image').replace(/\.[^.]+$/, '') || 'image';

    return `${baseName}.jpg`;
}

export async function compressImageFileForUpload(file, options = {}) {
    if (!file) {
        throw new Error('Missing image file');
    }

    const maxBytes = options.maxBytes ?? DEFAULT_IMAGE_UPLOAD_MAX_BYTES;
    const maxDimension = options.maxDimension ?? DEFAULT_COMPRESS_MAX_DIMENSION;
    const mime = String(file.type || '').toLowerCase();

    if (file.size <= maxBytes && /^image\/jpe?g$/.test(mime)) {
        return file;
    }

    const img = await loadImageFromFile(file);
    const { width, height } = computeScaledDimensions(
        img.naturalWidth,
        img.naturalHeight,
        maxDimension
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Canvas not available');
    }

    ctx.drawImage(img, 0, 0, width, height);

    let lastBlob = null;
    for (let stepIndex = 0; stepIndex < QUALITY_STEPS.length; stepIndex += 1) {
        const blob = await canvasToJpegBlob(canvas, QUALITY_STEPS[stepIndex]);
        if (!blob) {
            continue;
        }

        lastBlob = blob;
        if (blob.size <= maxBytes) {
            return new File([blob], buildCompressedFileName(file), {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
        }
    }

    if (!lastBlob) {
        throw new Error('Compression failed');
    }

    return new File([lastBlob], buildCompressedFileName(file), {
        type: 'image/jpeg',
        lastModified: Date.now()
    });
}
