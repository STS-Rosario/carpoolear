export const IMAGE_UPLOAD_ACCEPT =
    'image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

export const DEFAULT_IMAGE_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

const JPEG_EXTENSIONS = new Set(['jpg', 'jpeg']);
const JPEG_MIMES = new Set(['image/jpeg', 'image/jpg']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);
const ALLOWED_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
]);

export function getImageFileExtension(file) {
    const name = file && file.name ? String(file.name) : '';
    const dotIndex = name.lastIndexOf('.');

    if (dotIndex < 0) {
        return '';
    }

    return name.slice(dotIndex + 1).toLowerCase();
}

function isAllowedExtension(extension, allowedExtensions = ALLOWED_EXTENSIONS) {
    if (!extension) {
        return false;
    }

    if (allowedExtensions.has(extension)) {
        return true;
    }

    if (JPEG_EXTENSIONS.has(extension)) {
        return [...allowedExtensions].some((allowed) => JPEG_EXTENSIONS.has(allowed));
    }

    return false;
}

function isAllowedMime(mime, allowedMimes = ALLOWED_MIMES) {
    if (!mime) {
        return false;
    }

    const normalized = String(mime).toLowerCase();

    if (allowedMimes.has(normalized)) {
        return true;
    }

    if (JPEG_MIMES.has(normalized)) {
        return [...allowedMimes].some((allowed) => JPEG_MIMES.has(allowed));
    }

    return false;
}

export function isAllowedImageUpload(file) {
    if (!file) {
        return false;
    }

    const extension = getImageFileExtension(file);
    const mime = file.type ? String(file.type).toLowerCase() : '';

    return isAllowedExtension(extension) || isAllowedMime(mime);
}

export function filterAllowedImageUploads(files, limit = Number.POSITIVE_INFINITY) {
    return Array.from(files || [])
        .filter(isAllowedImageUpload)
        .slice(0, limit);
}

export function getImageUploadMaxBytes(config) {
    const n = config && config.image_upload_max_bytes;
    if (n != null && Number(n) > 0) {
        return Number(n);
    }

    return DEFAULT_IMAGE_UPLOAD_MAX_BYTES;
}

export function getImageUploadMaxMb(config) {
    return getImageUploadMaxBytes(config) / (1024 * 1024);
}

export function findOversizedImageUploads(files, maxBytes, getDisplayName) {
    return Array.from(files || [])
        .filter((file) => file && typeof file.size === 'number' && file.size > maxBytes)
        .map((file, index) => ({
            file,
            displayName: getDisplayName ? getDisplayName(file, index) : (file.name || '')
        }));
}

export function selectAllowedImageUploads(files, options = {}) {
    const maxBytes = options.maxBytes ?? DEFAULT_IMAGE_UPLOAD_MAX_BYTES;
    const allowed = filterAllowedImageUploads(files, options.limit);
    const oversized = findOversizedImageUploads(allowed, maxBytes, options.getDisplayName);
    const oversizedFiles = new Set(oversized.map((entry) => entry.file));

    return {
        files: allowed.filter((file) => !oversizedFiles.has(file)),
        oversized,
        maxBytes
    };
}

function formatOversizedImageUploadLabels(oversized) {
    return oversized.map((entry) => entry.displayName).filter(Boolean);
}

export function getImageUploadSizeErrorKey(oversized) {
    return oversized.length === 1 ? 'imageUploadTooLargeSingle' : 'imageUploadTooLargeMultiple';
}

export function getImageUploadSizeErrorParams(oversized, maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    const fileLabels = formatOversizedImageUploadLabels(oversized).join(', ');

    if (oversized.length === 1) {
        return {
            fileLabel: fileLabels,
            maxMb
        };
    }

    return {
        fileLabels,
        maxMb
    };
}

export function getDataUrlByteSize(dataUrl) {
    const value = String(dataUrl || '');
    const commaIndex = value.indexOf(',');

    if (commaIndex < 0) {
        return 0;
    }

    const base64 = value.slice(commaIndex + 1);
    const padding = (base64.match(/=+$/) || [''])[0].length;

    return Math.floor((base64.length * 3) / 4) - padding;
}

export function normalizeCapacitorImageFormat(format) {
    const normalized = String(format || 'jpeg').toLowerCase();

    return normalized === 'jpg' ? 'jpeg' : normalized;
}
